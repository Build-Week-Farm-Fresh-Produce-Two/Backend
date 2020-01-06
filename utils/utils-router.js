const router = require("express").Router();
const request = require("request");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const db = require("../data/db-config");


//add pictures
async function addPictures(tableName, images, insert) {
    const uploads = [];
    try {
        for (let key in images) {
            const file = images[key];
            uploads.push(
                cloudinary.uploader.upload(
                    file.tempFilePath,
                    (err, result) => {}
                )
            );
        }
        const results = await axios.all(uploads);

        const imgs = results.map(result => {
            console.log("Adding Picture to :", tableName, result);
            return {
                id: result.id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
                filename: result.original_filename
            };
        });

        const inserts = [];

        for (img of imgs) {
            inserts.push(db(tableName).insert({ ...insert, ...img }));
        }
        await Promise.all(inserts);
        return imgs;
    } catch (err) {
        throw err;
    }
}

//add videos
async function addVideo(tableName, video, insert) {
    try {
        return await cloudinary.uploader.upload(
            video.tempFilePath,
            { resource_type: "video" },
            async (err, result) => {
                await db(tableName).insert({ ...insert, url: result.url });
            }
        );
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//upload profile pictures to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/user/picture', (req, res) => {
    console.log(req.files);
    const file = req.files.image;
    
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        try{
            const image = await userDb.addProfilePic({
                user_id: req.user.id, 
                url: result.url, 
                width: result.width,
                height: result.height,
                filename: result.original_filename,
            });
            if(image){
                res.status(201).json({profile_picture: result.url});
            }else{
                throw 'Image could not be added'
            }
        }catch(err){
            console.log(err);
            res.status(500).json({message: 'Error adding profile picture'});
        }
    });
});
