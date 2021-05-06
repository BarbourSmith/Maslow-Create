import * as sys from './jsxcad-sys.js';
import { buildMeshes, orbitDisplay } from './jsxcad-ui-threejs.js';


//Setup worker
const agent = async ({ ask, question }) => {
  if (question.ask) {
    const { identifier, options } = question.ask;
    return askSys(identifier, options);
  }else if (question.touchFile) {
    const { path, workspace } = question.touchFile;
    await sys.touch(path, { workspace });
    // Invalidate the path in all workers.
    await sys.askServices({ touchFile: { path, workspace } });
  }
};

var serviceSpec = {};

if(window.location.href.includes('run')){
    serviceSpec = {
      webWorker: '../maslowWorker.js',  //'../maslowWorker.js', fixes this for run mode
      agent,
      workerType: 'module',
    };
}
else{
    serviceSpec = {
      webWorker: './maslowWorker.js',  //'../maslowWorker.js', fixes this for run mode
      agent,
      workerType: 'module',
    };
}

// window.ask = (question) => {
    // const result = sys.askService(serviceSpec, question);
    // return result;
// };

//Add 3d view //With axis does not work right now. Needs to be changed in jsxcad-ui-threejs
orbitDisplay({view: {fit: false}, withAxes: true, withGrid: true, gridLayer: 0}, document.getElementById('viewerContext')).then(result=>{
    window.updateDisplay = result.updateGeometry
});

sys.setupFilesystem({ fileBase: 'maslow' });

//Test some things
//window.ask({key: "rectangle", x:5, y:5, writePath: "atomGeometry/test" }); //This just establishes the worker

//If there is anything queued up to be called back when the ask worker is operational 
if(window.askSetupCallback){
    window.askSetupCallback();
}

// We need to start receiving messages immediately, but we're not ready to process them yet.
// Put them in a buffer.
const say = (message) => postMessage(message);

const messageBootQueue = [];
onmessage = ({ data }) => messageBootQueue.push(data);

const bootstrap = async () => {
  await sys.boot();
  const { ask, hear } = sys.conversation({ agent, say });
  self.ask = ask;
  window.ask = self.ask;
  
  onmessage = ({ data }) => {
    if(typeof data == 'string'){
        return -1;
    }
    else{
        return hear(data);
    }
  };
  
  // Now that we're ready, drain the buffer.
  if (self.messageBootQueue !== undefined) {
    while (self.messageBootQueue.length > 0) {
      hear(self.messageBootQueue.shift());
    }
  }
  while (messageBootQueue.length > 0) {
    hear(messageBootQueue.shift());
  }
  if (onmessage === undefined) throw Error('die');
};

bootstrap();


//TODo: Add some garbage collection here which checks when a path was last written to or read from and deletes the old ones. Probably will require a wrapper for reading and writing to paths
// listFiles().then(result => {
    // console.log(result);
// })
