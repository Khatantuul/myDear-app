import Album from "../models/album.js";

export const searchByTerms = async (searchTerms) => {
    const searchQuery = searchTerms.join(" ");
    try{
        const albums = await Album.aggregate([
            {
                $search: {
                    index: "albums",
                    text: {
                        query: searchQuery,
                        path: "description",
                        fuzzy: {
                            maxEdits: 1
                        }
                    }
                }
            },
            {
                $unionWith: {
                    coll: "albums",
                    pipeline: [
                        {
                            $match: {tags: {$in: searchTerms}}
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: "$_id",
                    doc: {$first: "$$ROOT"}
                }
            },
            {
                $replaceRoot: { newRoot: "$doc" }, //this replaced the root of the document with the doc field
                //removed doc field
            }
        ]);
        
        return albums;
    }catch(err){
        console.log("Error searching by tags:", err);
        throw err;
    }
}