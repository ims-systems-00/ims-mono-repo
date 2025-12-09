const { S3Client } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
  region: "eu-west-2",
});
module.exports = { s3Client };
