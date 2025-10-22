const width = 320; 
let height = 0; 
let streaming = false;


const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startButton = document.getElementById("start-button");
const allowButton = document.getElementById("permissions-button");


const galleryLeftBtn = document.getElementById("gallery-left");
const galleryRightBtn = document.getElementById("gallery-right");
const output = document.querySelector(".output");

let currentPhotoIndex = 0; 

const photosPerView = 3; 


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
  }
});


startButton.addEventListener("click", (ev) => {
  takePicture();
  ev.preventDefault();
});


function clearPhoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#aaaaaa";
  context.fillRect(0, 0, canvas.width, canvas.height);
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

  const chunk = photos.slice(currentPhotoIndex, currentPhotoIndex + photosPerView);

  if (chunk.length === 0) {
    output.innerHTML = "<p>No photos saved yet.</p>";
  } else {
    chunk.forEach((dataURL) => {
      const img = document.createElement("img");
      img.setAttribute("src", dataURL);
      img.classList.add("gallery-thumbnail");
      output.appendChild(img);
    });
  }

  if (currentPhotoIndex === 0) {
    galleryLeftBtn.disabled = true;
    galleryLeftBtn.classList.add("disabled");
  } else {
    galleryLeftBtn.disabled = false;
    galleryLeftBtn.classList.remove("disabled");
  }

  if (currentPhotoIndex + photosPerView >= photos.length) {
    galleryRightBtn.disabled = true;
    galleryRightBtn.classList.add("disabled");
  } else {
    galleryRightBtn.disabled = false;
    galleryRightBtn.classList.remove("disabled");
  }
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

updateGalleryView();