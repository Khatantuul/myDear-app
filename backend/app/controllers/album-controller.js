import * as albumServices from './../services/album-service.js'
import * as photoServices from './../services/photo-service.js'
import { getPresignedUrls, uploadFile, deletePhotosFromS3, getAlbumImageKeys, deleteAlbumFromS3 } from "../../s3.js";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import crypto from "crypto";

const upload = multer({ storage: multer.memoryStorage() }); 


const setSuccessResponse = (obj, res) =>{
    res.status(200);
    res.json(obj);
    // res.headers = {
    //     'Cache-Control': 'private'
    // }
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
  
                const compressedImageBuffer = await sharp(photoFile.buffer)
                .resize({
                  width: 800,
                  height: 600,
                  fit: sharp.fit.inside,
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

export const addPhotosToAlbum = async (req, res) => {
    const uploadMiddleware = upload.array('files',10); 

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        try{
            const albumInfo = JSON.parse(req.body.albumInfo);
            const photoInfo = JSON.parse(req.body.photoInfo);

            const { albumId, creator } = albumInfo;
            const photos = req.files;
                
            const uploadPromises = photos.map(async (photoFile, idx) => {
  

                const compressedImageBuffer = await sharp(photoFile.buffer)
                .resize({
                  width: 800,
                  height: 600,
                  fit: sharp.fit.inside,
                  withoutEnlargement: true,
                })
                .jpeg({ quality: 90 })
                .toBuffer();
              
              

                if (photoInfo[idx].note || photoInfo[idx].tags){
                    let photo = await photoServices.savePhoto({note: photoInfo[idx].note, tags: photoInfo[idx].tags});
                    const compressed = {...photoFile, buffer: compressedImageBuffer, photoId: photo._id}
                    const s3url = await uploadFile(compressed, creator, albumId);
                    photo = await photoServices.updatePhoto(photo._id, {s3url});
                    albumServices.addAlbumPhotos(albumId, photo._id);
                
                    return photo;
                }else{
                    let photo = await photoServices.savePhoto({});
                    const compressed = {...photoFile, buffer: compressedImageBuffer, photoId: photo._id}
                    const s3url = await uploadFile(compressed, creator, albumId);
                    photo = await photoServices.updatePhoto(photo._id, {s3url});
                    albumServices.addAlbumPhotos(albumId, photo._id);
                    return photo;
                }    
    
            })
    
            const savedPhotos = await Promise.all(uploadPromises);
            // await album.save();
            setSuccessResponse("success", res);
        }catch(err){
            setErrorResponse(err,res);
        }
    })

}



const generateEtag = (data) => {
    return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

export const fetchAllAlbums = async(req, res) => {
    try{
        const preview = req.headers['preview'];
        const user = req.session.user;
        let albums = await albumServices.getAlbums(user.userID);
            
        let populated = [];
        if(albums.length === 0){
            albums = await albumServices.getDefaultAlbums();
            for (let album of albums){
                const imageKeys = await getAlbumImageKeys("652ecc958a61b83ac4f4afcf", album._id, preview);
                const r = await getPresignedUrls(imageKeys);
                populated.push({album, presignedUrls: r})
            }
            setSuccessResponse(populated, res);
        }
   
        // let currentEtag = "";
        for (let album of albums){
            const imageKeys = await getAlbumImageKeys(user.userID, album._id, preview);
            // currentEtag = generateEtag(imageKeys);
            const r = await getPresignedUrls(imageKeys);
            populated.push({album, presignedUrls: r})
        }

        // const previousEtag = req.headers['if-none-match'];
       
        // if(previousEtag === currentEtag){
        //     console.log("so same");
        //     return res.status(304).end();
        // }
        // res.set("ETag", currentEtag);
        // res.set("Cache-Control", "private, max-age=900, must-revalidate");
        // res.status(200).json(populated);
        setSuccessResponse(populated, res);
    }catch(err){
        console.log("Error in fetching all albums for user", err);
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

    const albumId = req.params.albumId;
    const {limit, offset=0} = req.query;
    const userId = req.session.user.userID;


    try{
       if (!userId || !albumId){
        const err = new Error("UserId or AlbumId not received");
        err.status = 400;
        throw err;
       }
       const album = await albumServices.getAlbum(albumId);
       const imageKeys = await getAlbumImageKeys(userId, albumId, false);
    //    const imgKeys = imageKeys.slice(offset, offset+limit);
       
       const photoObj = await getPresignedUrls(imageKeys);
       setSuccessResponse({album,photoObj}, res);
    }catch(err){
        setErrorResponse(err,res);
    }
}

export const deletePhotosFromAlbum = async(req,res) => {
    try {
        const albumId = req.params.albumId;
        const {photos} = req.body;
        const updatedAlbum = await albumServices.updateAlbumRemovePhotos(albumId, photos);
        await deletePhotosFromS3(req.session.user.userID, albumId, photos);
        setSuccessResponse(updatedAlbum, res);

    } catch (error) {
        setErrorResponse(error,res);
    }
}

export const deleteAlbum = async(req,res) => {
    const {albumId} = req.params;
    try{
        await albumServices.deleteAlbum(albumId);
        await deleteAlbumFromS3(req.session.user.userID, albumId);
        setSuccessResponse({"message": "Successfully deleted"}, res);
    }catch(err){
        setErrorResponse(err,res);
    }
}
