async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({'audio': true, 'video': true});
	const video = document.getElementById('video');
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.width = video.videoWidth / 3;
      video.height = video.videoHeight / 3;
			resolve();
    };
  });
}

async function start(){
  await setupCamera();
  const deviceInfos = await navigator.mediaDevices.enumerateDevices();
	deviceInfos.forEach(deviceInfo=>{
		console.log(deviceInfo.kind, deviceInfo.label, deviceInfo.deviceId);
	})
	const constraints = await navigator.mediaDevices.getSupportedConstraints();
	for (const [key, value] of Object.entries(constraints)) {
    console.log(`${key}: ${value}`);
  }
  navigator.mediaDevices.ondevicechange = function(event) {
    console.log("ondevicechange", event)
  }
}

window.addEventListener('load', async ()=>{
  if(!navigator.permissions || !navigator.permissions.query){
    console.log("this browser doesn't have permission API", navigator.userAgent)
  }
  if(!navigator.mediaDevices.getDisplayMedia){
    console.log("this browser doesn't have getDisplayMedia", navigator.userAgent)
  }
	const deviceInfos = await navigator.mediaDevices.enumerateDevices();
	deviceInfos.forEach(deviceInfo=>{
		console.log(deviceInfo.kind, deviceInfo.label, deviceInfo.deviceId);
	})
});
