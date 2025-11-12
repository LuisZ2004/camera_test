(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ASCII = factory();
  }
} (this, function () {
    const fontHeight = 10;
    const charset = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm0123456789!@#$%^&*()-=_+/?<>,.;:[]{}|';

    function ASCII(canvas, source, width, height) {
    if (!width || !height){
        return;
    }
    
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    context.textBaseline = 'top';
    context.font = `${fontHeight}px Consolas, monospace`;
    
    const text = context.measureText('@');
    const fontWidth = Math.ceil(text.width);
    
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;
    const hiddenContext = hiddenCanvas.getContext('2d');
    
    hiddenContext.drawImage(source, 0, 0, width, height);
    
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);
    
    for (let y = 0; y < height; y += fontHeight) {
        for (let x = 0; x < width; x += fontWidth) {
            const frameSection = hiddenContext.getImageData(x, y, fontWidth, fontHeight);
            const { r, g, b, brightness } = getAverageRGB(frameSection);
            
            const charIndex = Math.floor((brightness / 255) * (charset.length - 1));
            const char = charset[charset.length - 1 - charIndex];
            
            context.fillStyle = `rgb(${r},${g},${b})`;
            context.fillText(char, x, y);
        }
    }
  }
  
 
  function getAverageRGB(frame) {
    const length = frame.data.length / 4;
    let r = 0, g = 0, b = 0;
    
    for (let i = 0; i < length; i++) {
      r += frame.data[i * 4 + 0];
      g += frame.data[i * 4 + 1];
      b += frame.data[i * 4 + 2];
    }
    
    r = Math.floor(r / length);
    g = Math.floor(g / length);
    b = Math.floor(b / length);
    
    const brightness = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
    
    return { r, g, b, brightness };
  }
  
  return ASCII;
}));