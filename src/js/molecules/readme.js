import Atom from '../prototypes/atom'
import GlobalVariables from '../globalvariables'

/**
 * This class creates the readme atom.
 */
export default class Readme extends Atom{
    /**
     * The constructor function.
     * @param {object} values An array of values passed in which will be assigned to the class as this.x
     */ 
    constructor(values){
        super(values)
        
        /**
         * This atom's name
         * @type {string}
         */
        this.atomType = 'Readme'
        /**
         * The text to appear in the README file
         * @type {string}
         */
        this.readmeText = 'Readme text here'
        /**
         * This atom's type
         * @type {string}
         */
        this.type = 'readme'
        /**
         * This atom's name
         * @type {string}
         */
        this.name = 'README'
        /**
         * This atom's radius...probably inherited and can be deleted
         * @type {number}
         */
        this.radius = 1/72

          /**
         * This atom's height as drawn on the screen
         */
        this.height
        
        
        this.setValues(values)
    }
    
    /**
     * Add a place to edit the readme text to the sidebar*/ 
    updateSidebar(){
        var valueList = super.updateSidebar() //call the super function
        this.createEditableValueListItem(valueList,this,'readmeText', 'Notes', false)
    }
    /**
     * Draw the readme atom with // icon.
     */ 
    draw() {
        
        //Set colors
        if(this.processing){
            GlobalVariables.c.fillStyle = 'blue'
        }
        else if(this.selected){
            GlobalVariables.c.fillStyle = this.selectedColor
            GlobalVariables.c.strokeStyle = this.defaultColor
            /**
             * This background color
             * @type {string}
             */
            this.color = this.selectedColor
            /**
             * This atoms accent color
             * @type {string}
             */
            this.strokeColor = this.defaultColor
        }
        else{
            GlobalVariables.c.fillStyle = this.defaultColor
            GlobalVariables.c.strokeStyle = this.selectedColor
            this.color = this.defaultColor
            this.strokeColor = this.selectedColor
        }
        
        this.inputs.forEach(input => {
            input.draw()       
        })
        if(this.output){
            this.output.draw()
        }
        
        let pixelsX = GlobalVariables.widthToPixels(this.x)
        let pixelsY = GlobalVariables.heightToPixels(this.y)
        let pixelsRadius = GlobalVariables.widthToPixels(this.radius)
        this.height = pixelsRadius * 1.5
        
        GlobalVariables.c.beginPath()
        GlobalVariables.c.rect(pixelsX - pixelsRadius, pixelsY - this.height/2, 2*pixelsRadius, this.height)
        GlobalVariables.c.textAlign = 'start' 
        GlobalVariables.c.fillText(this.name, pixelsX + pixelsRadius/2, pixelsY-pixelsRadius)
        GlobalVariables.c.fill()
        GlobalVariables.c.lineWidth = 1
        GlobalVariables.c.stroke()
        GlobalVariables.c.closePath()
    
        GlobalVariables.c.beginPath()
        GlobalVariables.c.fillStyle = '#484848'
        GlobalVariables.c.font = `${pixelsRadius*1.5}px Work Sans Bold`
        GlobalVariables.c.fillText('//', GlobalVariables.widthToPixels(this.x- this.radius/2), GlobalVariables.heightToPixels(this.y)+this.height/3)
        GlobalVariables.c.fill()
        GlobalVariables.c.closePath()
        
    }
    /**
     * Update the readme text. Called when the readme text has been edited.
     */ 
    setValue(newText) {
        this.readmeText = newText
    }
    
    /**
     * Provides this molecules contribution to the global Readme
     */ 
    requestReadme(){
        return [this.readmeText]
    }
    
    /**
     * Add the readme text to the information saved for this atom
     */ 
    serialize(values){
        //Save the readme text to the serial stream
        var valuesObj = super.serialize(values)
        
        valuesObj.readmeText = this.readmeText
        
        return valuesObj
        
    }
}
