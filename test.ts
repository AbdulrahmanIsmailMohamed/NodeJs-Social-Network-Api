import dotenv from "dotenv";
dotenv.config();

import cloudinary from "./src/config/coludinaryConfig";

// cloudinary.uploader.destroy(`uploads/marketplace/1687050117296-marketplace`)
//     .then((res) => console.log("then: ", res))
//     .catch((re) => console.log("catcj: ", re));


const imageUrl = 'http://res.cloudinary.com/dqm9gatsb/image/upload/v1687050118/uploads/marketplace/1687050117296-marketplace.jpg';

// Extract the path from the image URL
const pathMatch = imageUrl.match(/\/v\d+\/([^/]+\/[^/]+\/[^/.]+)/);
const path = pathMatch ? pathMatch[1] : null;

console.log('Path:', path);
