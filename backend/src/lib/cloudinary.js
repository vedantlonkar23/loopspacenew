import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

export const uploadCloud = async (buffer, folder = "uploads") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, uploadResult) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return reject({ success: false, link: "" });
                }
                resolve({ success: true, link: uploadResult.secure_url });
            }
        );

        uploadStream.end(buffer);
    });
};
