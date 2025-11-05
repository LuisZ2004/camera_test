const width = 300; 
let height = 0; 
let streaming = false;


const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startButton = document.getElementById("start-button");
const allowButton = document.getElementById("permissions-button");


const galleryLeftBtn = document.getElementById("gallery-left");
const galleryRightBtn = document.getElementById("gallery-right");
const output = document.querySelector(".output");
const deleteButton = document.getElementById("delete")
const filterSelect = document.getElementById("filter");

let currentPhotoIndex = 0; 
let animationFrameId = null;
const photosPerView = 3; 

/* --------- Filter Stuff -----------*/ 
const filters = {
    "none" : "No filter",
    "8bit": "8-Bit Pixel", 
    "grayscale(1)": "Grayscale",
    "invert(1)": "Invert",
}

function populateFilters() {
  filterSelect.innerHTML = "";

  for (const [filterValue, displayText] of Object.entries(filters)) {
    const option = document.createElement("option");
    option.value = filterValue;
    option.textContent = displayText;
    filterSelect.appendChild(option);
  }
}

function applyFilter(canvas, image, filterType){
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  if(filterType === '8bit'){
    eightBit(canvas,image, 10);
  }else {
    context.filter = filterType;
    context.drawImage(image,0,0,canvas.width,canvas.height);
  }
}
function drawVideoToCanvas() {
  if (streaming) {
    // Apply the 8bit filter from the video to the main canvas
    applyFilter(canvas, video, '8bit');
    
    // Request the next frame to create a live video effect
    animationFrameId = requestAnimationFrame(drawVideoToCanvas);
  }
}

function updateLiveFilter() {
  const selectedFilter = filterSelect.value;

  if (selectedFilter === '8bit') {
    video.style.display = 'none';
    canvas.style.display = 'block';

    if (!animationFrameId) {
      drawVideoToCanvas();
    }
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    video.style.display = 'block';
    canvas.style.display = 'none';
    
    video.style.filter = selectedFilter;
  }
}

/* ------------------------------*/

allowButton.addEventListener("click", () => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      allowButton.style.display = "none"
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });
});

video.addEventListener("canplay", (ev) => {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    streaming = true;
    canvas.style.display = "none"
  }
});


startButton.addEventListener("click", (ev) => {
  takePicture();
  ev.preventDefault();
});


function clearPhoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  if (filterSelect.value !== '8bit') {
    canvas.style.display = 'none';
  }
}
clearPhoto();

function takePicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    context.drawImage(video, 0, 0, width, height);
    const data = canvas.toDataURL("image/png");   
    clearPhoto(); 

    let photos = JSON.parse(localStorage.getItem('storedPhotos')) || [];
    photos.push(data);
    localStorage.setItem('storedPhotos', JSON.stringify(photos));
    
    currentPhotoIndex = Math.floor((photos.length - 1) / photosPerView) * photosPerView;

    updateGalleryView(); 

  } else {
    clearPhoto();
  }
}


function updateGalleryView() {
  const photos = JSON.parse(localStorage.getItem('storedPhotos')) || [];
  output.innerHTML = ""; 

  const selectedFilter = filterSelect.value;

  const chunk = photos.slice(currentPhotoIndex, currentPhotoIndex + photosPerView);

  if (chunk.length === 0) {
    output.innerHTML = "<p>No photos saved yet.</p>";
  }

  chunk.forEach((dataURL) => {
    const img = new Image();
    
    img.onload = () => {
      const galleryCanvas = document.createElement("canvas");
      galleryCanvas.classList.add("gallery-thumbnail");

      applyFilter(galleryCanvas, img, selectedFilter);

      output.appendChild(galleryCanvas);
    };

    img.src = dataURL;
  });

  galleryLeftBtn.disabled = (currentPhotoIndex === 0);
  galleryLeftBtn.classList.toggle("disabled", currentPhotoIndex === 0);

  galleryRightBtn.disabled = (currentPhotoIndex + photosPerView >= photos.length);
  galleryRightBtn.classList.toggle("disabled", (currentPhotoIndex + photosPerView >= photos.length));
}


galleryLeftBtn.addEventListener("click", () => {
  currentPhotoIndex = Math.max(0, currentPhotoIndex - photosPerView);
  updateGalleryView(); 
});

galleryRightBtn.addEventListener("click", () => {
  const photos = JSON.parse(localStorage.getItem('storedPhotos')) || [];
  if (currentPhotoIndex + photosPerView < photos.length) {
    currentPhotoIndex += photosPerView;
    updateGalleryView(); 
  }
});

deleteButton.addEventListener("click",() =>{
  localStorage.clear();
  currentPhotoIndex = 0;
  updateGalleryView();
})

filterSelect.addEventListener("change", () => {
  updateGalleryView();
  updateLiveFilter();
});

populateFilters();
updateGalleryView();
updateLiveFilter();
