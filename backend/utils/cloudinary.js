import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("Cloudinary upload error: Local file path is missing.");
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); 
        }
        
        console.error("Error during Cloudinary upload:", error);
        return null;
    }
}

// Deletes a Cloudinary asset (image, video, raw) by parsing its public URL.
const deleteFromCloudinary = async (fileUrl) => {
    try {
        if (!fileUrl) {
            console.error("File URL is required to delete from Cloudinary");
            return null;
        }

        // Extract the public_id from the URL.
        const urlSegments = fileUrl.split('/');
        const publicIdWithExtension = urlSegments[urlSegments.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];

        if (!publicId) {
            console.log("Could not extract public_id from URL:", fileUrl);
            return null;
        }

        // Dynamically determine the resource type from the URL
        let resourceType = 'image'; // Default to 'image'
        const uploadIndex = urlSegments.indexOf('upload');
        if (uploadIndex > 0) {
            const potentialType = urlSegments[uploadIndex - 1];
            if (['image', 'video', 'raw'].includes(potentialType)) {
                resourceType = potentialType;
            }
        }
        
        // Use the 'destroy' method to delete the asset by its public_id and determined resource_type
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        
        console.log("Asset deletion result from Cloudinary:", result);
        return result;

    } catch (error) {
        console.error("Error deleting asset from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
