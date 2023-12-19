import * as albumServices from './../services/album-service.js'
import * as photoServices from './../services/photo-service.js'
import { getPresignedUrls, uploadFile, deletePhotoFromS3 } from "../../s3.js";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const upload = multer({ dest: 'uploads/' }); 


const setSuccessResponse = (obj, res) =>{
    res.status(200);
    res.json(obj);
}

const setErrorResponse = (err,res) =>{
    const status = err.status || 500;
    const message = err.message || "Internal Server Error"
    res.status(status)
    res.json({error:message})
}

export const createAlbum = async (req, res) => {

    const uploadMiddleware = upload.array('files',10); 

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        try{
            const albumInfo = JSON.parse(req.body.albumInfo);
            const photoInfo = JSON.parse(req.body.photoInfo);

            const { title, description, tags, creator } = albumInfo;
            const photos = req.files;
            
            const album = await albumServices.saveAlbum({title, description, tags, creator});
    
            const uploadPromises = photos.map(async (photoFile, idx) => {

                const buffer = fs.readFileSync(photoFile.path);

                const compressedImageBuffer = await sharp(buffer)
                .resize({
                  width: 800,
                  height: 600,
                  fit: sharp.fit.inside, // or sharp.fit.cover depending on your preference
                  withoutEnlargement: true,
                })
                .jpeg({ quality: 90 })
                .toBuffer();
              
              

                if (photoInfo[idx].note || photoInfo[idx].tags){
                    let photo = await photoServices.savePhoto({note: photoInfo[idx].note, tags: photoInfo[idx].tags});
                    const compressed = {...photoFile, buffer: compressedImageBuffer, photoId: photo._id}
                    const s3url = await uploadFile(compressed, creator, album._id);
                    photo = await photoServices.updatePhoto(photo._id, {s3url});
                    albumServices.addAlbumPhotos(album._id, photo._id);
                    return photo;
                }else{
                    let photo = await photoServices.savePhoto({});
                    const compressed = {...photoFile, buffer: compressedImageBuffer, photoId: photo._id}
                    const s3url = await uploadFile(compressed, creator, album._id);
                    photo = await photoServices.updatePhoto(photo._id, {s3url});
                    albumServices.addAlbumPhotos(album._id, photo._id);
                    return photo;
                }    
    
            })
    
            const savedPhotos = await Promise.all(uploadPromises);
            // await album.save();
            setSuccessResponse({album, photos: savedPhotos}, res);
        }catch(err){
            setErrorResponse(err,res);
        }
    })

}

export const fetchAllAlbums = async(req, res) => {
    try{
        const preview = req.headers['preview'];
        const user = req.session.user;
        const albums = await albumServices.getAlbums(user.userID);
        
        let populated = [];
        for (let album of albums){
            const r = await getPresignedUrls(user.userID,album._id,preview)
            populated.push({album, presignedUrls: r})
        }

        setSuccessResponse(populated, res);
    }catch(err){
        setErrorResponse(err,res);
    }
}

export const fetchAllUserPhotos = async(req, res) => {
    const userId = req.headers['user-id'];
    try{
       if (!userId){
        const err = new Error("UserId not received");
        err.status = 400;
        throw err;
       }
       const photoObj = await getPresignedUrls(userId, null, false);
       setSuccessResponse(photoObj, res);
    }catch(err){
        setErrorResponse(err,res);
    }
}

export const fetchAllAlbumPhotos = async(req, res) => {
    const userId = req.headers['user-id'];
    const albumId = req.headers['album-id'];


    try{
       if (!userId || !albumId){
        const err = new Error("UserId or AlbumId not received");
        err.status = 400;
        throw err;
       }
       const album = await albumServices.getAlbum(albumId);
       const photoObj = await getPresignedUrls(userId, albumId, false);
       setSuccessResponse({album,photoObj}, res);
    }catch(err){
        setErrorResponse(err,res);
    }
}

export const deletePhotoFromAlbum = async(req,res) => {
    try {
        const {albumId} = req.params;
        const {photoId} = req.body;
        const updatedAlbum = await albumServices.updateAlbumRemovePhoto(albumId, photoId);
        await photoServices.deletePhoto(photoId);
        await deletePhotoFromS3(req.session.user.userID, albumId, photoId);
        setSuccessResponse(updatedAlbum, res);

    } catch (error) {
        setErrorResponse(error,res);
    }
}

export const deleteAlbum = async(req,res) => {
    const {albumId} = req.params;
    try{
        await albumServices.deleteAlbum(albumId);
        setSuccessResponse({"message": "Successfully deleted"}, res);
    }catch(err){
        setErrorResponse(err,res);
    }
}