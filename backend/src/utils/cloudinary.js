import cloudinary from "../config/cloudinary.config.js";

/**
 * Uploads an image to Cloudinary.
 * Accepts either a local file path (req.file.path) or a public image URL.
 * Returns the secure Cloudinary URL.
 */
export const uploadTravelStoryImage = async (imagePathOrUrl) => {
  if (!imagePathOrUrl) {
    throw new Error("No image path or URL provided");
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(imagePathOrUrl, {
      folder: "travel_stories",
      resource_type: "image",
    });

    console.log("Cloudinary upload successful:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    throw err;
  }
};
