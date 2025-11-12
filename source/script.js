const filterManager  = new FilterManager();
const storageManager = new StorageManager('storedPhotos');
const cameraManager  = new CameraManager(document.getElementById("video"),document.getElementById("canvas"));

const startButton     = document.getElementById("start-button");
const allowButton     = document.getElementById("permissions-button");
const galleryLeftBtn  = document.getElementById("gallery-left");
const galleryRightBtn = document.getElementById("gallery-right");
const output          = document.querySelector(".output");
const deleteButton    = document.getElementById("delete");
const filterSelect    = document.getElementById("filter");

let currentPhotoIndex = 0;
const photosPerView   = 3;

function initializeFilters(){
  filterSelect.innerHTML = "";
  
  filterManager.getAllFilters().forEach(filter => {
    const option = document.createElement("option");
    option.value = filter.name;
    option.textContent = filter.displayName;
    filterSelect.appendChild(option);
  });
}

function updateGalleryView(){
  output.innerHTML = "";
  
  const selectedFilterName = filterSelect.value;
  const photos = storageManager.getPhotosSlice(currentPhotoIndex, photosPerView);
  const totalPhotos = storageManager.getPhotoCount();

  if(totalPhotos === 0){
    output.innerHTML = "<p>No photos</p>";
    galleryLeftBtn.disabled = true;
    galleryRightBtn.disabled = true;
    return;
  }

  photos.forEach((dataURL)=> {
    const img = new Image();
    
    img.onload =()=> {
      const galleryCanvas = document.createElement("canvas");
      galleryCanvas.classList.add("gallery-thumbnail");

      const { width, height } = cameraManager.getDimensions();
      filterManager.applyFilterByName(selectedFilterName, galleryCanvas, img, width, height);

      output.appendChild(galleryCanvas);
    };

    img.src = dataURL;
  });

  galleryLeftBtn.disabled = (currentPhotoIndex === 0);
  galleryRightBtn.disabled = (currentPhotoIndex + photosPerView >= totalPhotos);
}


allowButton.addEventListener("click", async ()=> {
    const success = await cameraManager.requestPermissions();
    if(success){
        allowButton.style.display = "none";
        cameraManager.canvas.style.display = "none";
    }
});

startButton.addEventListener("click",(e)=> {
  e.preventDefault();
  
  const photoData = cameraManager.capturePhoto();
  
  if(photoData){
    storageManager.savePhoto(photoData);
    
    cameraManager.clearCanvas();
    
    const totalPhotos = storageManager.getPhotoCount();
    currentPhotoIndex = Math.floor((totalPhotos - 1)/ photosPerView)* photosPerView;
    updateGalleryView();
  }
});


filterSelect.addEventListener("change",()=> {
  const selectedFilter = filterSelect.value;
  cameraManager.applyLiveFilter(filterManager, selectedFilter);
  updateGalleryView();
});

galleryLeftBtn.addEventListener("click",()=> {
  currentPhotoIndex = Math.max(0, currentPhotoIndex - photosPerView);
  updateGalleryView();
});

galleryRightBtn.addEventListener("click",()=> {
  const totalPhotos = storageManager.getPhotoCount();
  if(currentPhotoIndex + photosPerView < totalPhotos){
    currentPhotoIndex += photosPerView;
    updateGalleryView();
  }
});

deleteButton.addEventListener("click",()=> {
  storageManager.clearAll();
  currentPhotoIndex = 0;
  updateGalleryView();
});

initializeFilters();
updateGalleryView();
cameraManager.applyLiveFilter(filterManager, filterSelect.value);