/**
 * Class for storage functions and handlers
 */
class StorageManager{
    /**
     * create an instance of the manager class with a key for local storage
     * @param {string} storageKey 
     */
    constructor(storageKey = 'storedPhotos'){
        this.storageKey = storageKey;
    }
    /**
     * Adds the image to local storage
     * @param {string} dataURL 
     * @returns {boolean}
     */
    savePhoto(dataURL){
        const photos = this.getAllPhotos();
        photos.push(dataURL);
        localStorage.setItem(this.storageKey, JSON.stringify(photos));
        return true;
    }
    /**
     * Returns all photos from local storage
     * @returns {Array}
     */
    getAllPhotos(){
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }
    /**
     * clears local storage
     */
    clearAll(){
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Returns number of images in local storage
     * @returns {number} length
     */
    getPhotoCount(){
        return this.getAllPhotos().length;
    }

    /**
     * Gets a range of photos starting at a specific index
     * @param {number} startIndex 
     * @param {numer} count 
     * @returns {photos}
     */
    getPhotosSlice(startIndex, count){
        const photos = this.getAllPhotos();
        return photos.slice(startIndex, startIndex + count);
    }
}

if (typeof module !== 'undefined' && module.exports){
    module.exports = StorageManager;
}