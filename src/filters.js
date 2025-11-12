class Filter {
  constructor(name, displayName, type, value){
    this.name        = name;
    this.displayName = displayName;
    this.type        = type;
    this.value       = value;
  }
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

const FilterFunctions = {
    eightBit:(canvas, source, width, height)=> {
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

    addFilter(name, displayName, type, value){
        const filter = new Filter(name, displayName, type, value);
        this.filters.set(name, filter);
    }

    getFilter(name){
        return this.filters.get(name);
    }

    getAllFilters(){
        return Array.from(this.filters.values());
    }

    applyFilterByName(name, canvas, source, width, height){
        const filter = this.getFilter(name);
        if(filter){
        filter.applyFilter(canvas, source, width, height);
        }
    }
}

if(typeof module !== 'undefined' && module.exports){
  module.exports = { Filter, FilterManager, FilterFunctions };
}