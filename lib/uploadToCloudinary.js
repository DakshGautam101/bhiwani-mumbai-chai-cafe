export const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing. Make sure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET are set in your .env.local file and that you have restarted the development server.");
    }

    console.log("Cloud Name:", cloudName);
    console.log("Upload Preset:", uploadPreset);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary Error:", errorText);
        throw new Error("Failed to upload image to Cloudinary");
    }

    const result = await res.json();
    return result.secure_url;
};
