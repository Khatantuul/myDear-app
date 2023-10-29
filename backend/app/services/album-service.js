import Album from "../models/album.js";
import Photo from "../models/photo.js";
 

export const saveAlbum = async (albumInfo) => {
    try{
        const {title, description, tags, creator} = albumInfo;

        const album = new Album({title, description, tags, creator});
        return await album.save();
    }catch(err){
        throw err;
    }
}

// export const generateEtag = async (albumID) => {
//     try{

//     }
// }

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

        console.log('albumsByUser from album service', albumsByUser)
        return albumsByUser;
    }catch(err){
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