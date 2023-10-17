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

