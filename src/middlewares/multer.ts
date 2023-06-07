import multer from "multer";
import { Request } from "express";
import APIError from '../utils/apiError';

const storage = multer.diskStorage({
    filename(req, file, callback) {
        callback(null, file.originalname)
    }
});

const fileFilter = (req: Request, file: any, cb: any) => {
    if (
        file.mimetype.startsWith("image") ||
        file.mimetype.startsWith("video") ||
        file.mimetype.startsWith("application/pdf")
    ) cb(null, true);
    else cb(new APIError("Add Only image or videos", 400), null);
}

export const upload = multer({ fileFilter, storage });
export const uploadSingleImage = (fileName: string) => upload.single(fileName);
export const uploadMultiImages = (fileName: string) => upload.array(fileName);