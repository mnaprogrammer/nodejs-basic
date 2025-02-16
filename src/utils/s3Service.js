const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3Config");

const uploadToS3 = async (file) => {
    const fileName = `profilepics/${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    // Generate the public file URL
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

const deleteFileFromS3 = async (fileKey) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey, // Example: "uploads/user123/profile.jpg"
        };
        await s3.send(new DeleteObjectCommand(params));
        console.log("File deleted from S3:", fileKey);
    } catch (error) {
        console.error("Error deleting file from S3:", error.message);
    }
};

module.exports = { uploadToS3, deleteFileFromS3 };