/**
 * Class representing a filter
 */
class Filter {
  /**
   * Create a filter with a 
   * name and display name for the select input form 
   * type as in CSS or js function
   * value for css value (grayscale : 1)
   * @param {string} name 
   * @param {string} displayName 
   * @param {string} type 
   * @param {string} value 
   */
  constructor(name, displayName, type, value){
    this.name        = name;
    this.displayName = displayName;
    this.type        = type;
    this.value       = value;
  }
  /**
   * Apply filter to camera
   * Source is camera input
   * Canvas is where the output is being displayed
   * Width and Height are the dimensions of the output
   * @param {*} canvas 
   * @param {*} source 
   * @param {number} width 
   * @param {number} height 
   */
  applyFilter(canvas, source, width, height){
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    if(this.type === 'function'){
      this.value(canvas, source, width, height);
    } else if(this.type === 'css'){
      context.filter = this.value;
      context.drawImage(source, 0, 0, width, height);
      context.filter = 'none';
    }
  }
}
/**
 * Filter functions  named so far are eightbit and ASCII
 */
const FilterFunctions = {
    eightBit:(canvas, source, _width, _height)=> {
        if(typeof eightBit !== 'undefined'){
            eightBit(canvas, source, 10);
        }
    },
    ASCII:(canvas, source, width, height) => {
        if(typeof ASCII !== 'undefined'){
            ASCII(canvas, source, width, height);
        }
    }
};
/**
 * Class for all filters
 * Creates a map of all filters, with some default css ones and the js functions created so far
 */
class FilterManager {
    constructor(){
        this.filters = new Map();
        this.initializeDefaultFilters();
    }

    initializeDefaultFilters(){
        this.addFilter('none', 'No Filter', 'css', 'none');
        this.addFilter('8bit', '8-Bit Pixel', 'function', FilterFunctions.eightBit);
        this.addFilter('grayscale', 'Grayscale', 'css', 'grayscale(1)');
        this.addFilter('invert', 'Invert', 'css', 'invert(1)');
        this.addFilter('sepia', 'Sepia', 'css', 'sepia(1)');
        this.addFilter('blur', 'Blur', 'css', 'blur(3px)');
        this.addFilter('brightness', 'Bright', 'css', 'brightness(1.5)');
        this.addFilter('contrast', 'High Contrast', 'css', 'contrast(1.5)');
        this.addFilter('ASCII', "ASCII", 'function', FilterFunctions.ASCII);
    }
    /**
     * Creates a new instance of the filter class
     * @param {string} name 
     * @param {string} displayName 
     * @param {string} type 
     * @param {string} value 
     */
    addFilter(name, displayName, type, value){
        const filter = new Filter(name, displayName, type, value);
        this.filters.set(name, filter);
    }
    /**
     * Gets a filter by name
     * @param {string} name 
     * @returns {Filter}
     */
    getFilter(name){
        return this.filters.get(name);
    }
    /**
     * Returns an array of all filters
     * @returns {Filter}
     */
    getAllFilters(){
        return Array.from(this.filters.values());
    }
    /**
     * Gets an input stream and output and applys the filter function
     * @param {string} name 
     * @param {*} canvas 
     * @param {*} source 
     * @param {number} width 
     * @param {number} height 
     */
    applyFilterByName(name, canvas, source, width, height){
        const filter = this.getFilter(name);
        if(filter){
        filter.applyFilter(canvas, source, width, height);
        }
    }
}
/**
 * exports module
 */
if(typeof module !== 'undefined' && module.exports){
  module.exports = { Filter, FilterManager, FilterFunctions };
}