import * as searchServices from "../services/search-service.js";
import { getPresignedUrls, getAlbumImageKeys } from "../../s3.js";

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

export const searchAlbums = async (req, res) => {
    const searchTerms = req.query.searchTerms.split(" ");
    const user = req.session.user;
    try{
        const albums = await searchServices.searchByTerms(searchTerms);
        let populated = []

        for(let album of albums){
            const imageKeys = await getAlbumImageKeys(user.userID, album._id, true);
            const r = await getPresignedUrls(imageKeys);
            populated.push({album, presignedUrls: r})
        }

        setSuccessResponse(populated, res);
    }catch(err){
        setErrorResponse(err, res);
    }
}