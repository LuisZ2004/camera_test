const { FilterManager } = require("./filters");

/**
 * Class for Camera and Camera functions
 */
class CameraManager{
    /**
     * Video element is the video input
     * Canvas element is where video stream is being output
     * Listens for camera input, has default width of 300
     * @param {*} videoElement 
     * @param {*} canvasElement 
     */
    constructor(videoElement, canvasElement) {
        this.video            = videoElement;
        this.canvas           = canvasElement;
        this.width            = 300;
        this.height           = 0;
        this.streaming        = false;
        this.stream           = null;
        this.animationFrameId = null;
        this.currentFilter    = 'none';
        
        this.setupVideoListener();
    }
    /**
     * Listens for permissions and upon getting media, the stream is set as camera input
     * @returns {boolean}
     */
    async requestPermissions(){
        this.stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
        });
        this.video.srcObject = this.stream;
        await this.video.play();
        return true;
    }
    /**
     * If the camera is not streaming, set height using aspect ratio and width and adjust video and canvas element
     */
    setupVideoListener(){
        this.video.addEventListener("canplay",() => {
            if(!this.streaming){
                this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
                this.video.setAttribute("width", this.width);
                this.video.setAttribute("height", this.height);
                this.canvas.setAttribute("width", this.width);
                this.canvas.setAttribute("height", this.height);
                this.streaming = true;
            }
        });
    }
    /**
     * Takes photo and draws to canvas
     * @returns {image}
     */
    capturePhoto() {
        if(this.width && this.height){
            const context = this.canvas.getContext("2d");
            context.drawImage(this.video, 0, 0, this.width, this.height);
            return this.canvas.toDataURL("image/png");
        }
        return null;
    }
    /**
     * Inputs a filtermanager class and name for a filter, gets the filter and applys to canvas
     * @param {FilterManager} filterManager 
     * @param {string} filterName 
     */
    applyLiveFilter(filterManager, filterName){
        this.currentFilter = filterName;
        const filter = filterManager.getFilter(filterName);

        if(this.animationFrameId){
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if(filter && filter.type === 'function') {
            this.video.style.display = 'none';
            this.canvas.style.display = 'block';
            this.video.style.filter = 'none';
            
            const drawFrame =() => {
                if(this.streaming && this.currentFilter === filterName) {
                    filter.applyFilter(this.canvas, this.video, this.width, this.height);
                    this.animationFrameId = requestAnimationFrame(drawFrame);
                }
            };
            drawFrame();
        }else if(filter && filter.type === 'css'){
            this.video.style.display = 'block';
            this.canvas.style.display = 'none';
            this.video.style.filter = filter.value;
        }
    }
    /**
     * canvas gets cleared
     */
    clearCanvas(){
        const context = this.canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * stop camera stream 
     */
    stopCamera(){
        if(this.stream){
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.streaming = false;
        }
        if(this.animationFrameId){
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    /**
     * Checks if the stream is on
     * @returns {boolean}
     */
    isStreaming(){
        return this.streaming;
    }
    /**
     * Returns canvas and video dimensions
     * @returns {{number, number}}
     */
    getDimensions(){
        return{width: this.width,height: this.height};
    }
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = CameraManager;
}