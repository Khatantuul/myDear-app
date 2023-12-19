import Photo from "../models/photo.js";
import Album from "../models/album.js";
 

export const savePhoto = async (photoInfo) => {
    try{
        const {note, tags, s3url} = photoInfo;

        const photo = new Photo({note, tags, url: s3url});
        return await photo.save();
    }catch(err){
        throw err;
    }
}

export const updatePhoto = async (photoId, photoInfo) => {
    try{
        const {s3url} = photoInfo;
        const photo = await Photo.findById(photoId).exec();
        photo.url = s3url;
        return await photo.save();
    }catch(err){
        throw err;
    }
}

export const deletePhoto = async (photoId) => {
    try {
        return await Photo.findByIdAndDelete(photoId).exec();
    } catch (error) {
        throw error;
    }
}

