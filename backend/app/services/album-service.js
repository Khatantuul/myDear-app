import Album from "../models/album.js";
 

export const saveAlbum = async (albumInfo) => {
    try{
        const {title, description, tags, creator} = albumInfo;

        const album = new Album({title, description, tags, creator});
        return await album.save();
    }catch(err){
        throw err;
    }
}


export const addAlbumPhotos = async (albumID, photoID) => {
    try{
        const album = await Album.findById(albumID).exec();
        album.photos.push(photoID);
        return await album.save();
    }catch(err){
        throw err;
    }
}

export const getAlbums = async (creator) => {
    try{
        const albumsByUser = await Album.find({creator: creator}).populate({ path: 'photos', perDocumentLimit: 4 }).exec();
        return albumsByUser;
    }catch(err){
        throw err;
    }
}

export const getDefaultAlbums = async () =>{
    try{
        const defaultCreator = "652ecc958a61b83ac4f4afcf";
        const defaultAlbums = await Album.find({creator: defaultCreator}).populate({ path: 'photos', perDocumentLimit: 4 }).exec();
        return defaultAlbums;
    }catch(err){
        console.log("GetDefaultsAlbums error:", err);
        throw err;
    }
}

export const getAlbum = async (albumID) => {
    try{
        const album = await Album.findById(albumID).exec();
        return album;
    }catch(err){
        throw err;
    }
}

export const updateAlbumRemovePhotos = async (albumID, photos) => {
    try {
        const album = await Album.findById(albumID).exec();

        if(!album){
            throw new Error("Album not found")
        }

        const updatedAlbum = await Album.findByIdAndUpdate(
            albumID,
            { $pull: { photos: { $in: photos } } },
            { new: true }
        ).exec();
    } catch (error) {
        console.log("Error deleting photos from album:", error);
        throw error;
    }
}

export const deleteAlbum = async (albumID) => {
    try{
        return Album.findByIdAndDelete(albumID).exec();
    }catch(err){
        throw err;
    }
}