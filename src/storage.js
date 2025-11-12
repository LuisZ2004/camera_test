class StorageManager{
    constructor(storageKey = 'storedPhotos'){
        this.storageKey = storageKey;
    }
    savePhoto(dataURL){
        const photos = this.getAllPhotos();
        photos.push(dataURL);
        localStorage.setItem(this.storageKey, JSON.stringify(photos));
        return true;
    }

    getAllPhotos(){
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    clearAll(){
        localStorage.removeItem(this.storageKey);
    }

    getPhotoCount(){
        return this.getAllPhotos().length;
    }

    getPhotosSlice(startIndex, count){
        const photos = this.getAllPhotos();
        return photos.slice(startIndex, startIndex + count);
    }
}

if (typeof module !== 'undefined' && module.exports){
    module.exports = StorageManager;
}