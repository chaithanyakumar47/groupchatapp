
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');



const accessKeyId = process.env.IAM_USER_KEY;
const secretAccessKey = process.env.IAM_USER_SECRET;
const bucketName = process.env.BUCKET_NAME
const s3Client = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

exports.uploadToS3 = async (image, filename) => {
    try {
        const uploadParams = {
            Bucket: bucketName,
            Key: filename,
            Body: image,
            ACL: "public-read",
            ContentType: "image/jpeg",
        };
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        const publicUrl = `https://${uploadParams.Bucket}.s3.ap-southeast-2.amazonaws.com/${uploadParams.Key}`;
        return publicUrl;
    } catch (error) {
        console.log('Error uploading file to S3:', error);
        throw error;
    }
}