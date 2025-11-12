class CameraManager{
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

    async requestPermissions(){
        this.stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
        });
        this.video.srcObject = this.stream;
        await this.video.play();
        return true;
    }

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

    capturePhoto() {
        if(this.width && this.height){
            const context = this.canvas.getContext("2d");
            context.drawImage(this.video, 0, 0, this.width, this.height);
            return this.canvas.toDataURL("image/png");
        }
        return null;
    }

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

    clearCanvas(){
        const context = this.canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

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

    isStreaming(){
        return this.streaming;
    }

    getDimensions(){
        return{width: this.width,height: this.height};
    }
}

if(typeof module !== 'undefined' && module.exports){
    module.exports = CameraManager;
}