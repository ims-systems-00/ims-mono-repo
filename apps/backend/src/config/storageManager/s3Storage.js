const AWS = require("aws-sdk");
const { logger } = require("@ims-systems-00/ims-core/lib/logger");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  signatureVersion: "v4",
  region: "eu-west-2",
});

async function upto_s3_storage(bucketName, file, path) {
  try {
    let namesplited = file.name.split(".");
    let filetype = namesplited[namesplited.length - 1];
    const params = {
      Bucket: bucketName + path,
      Key: file.name,
      Body: file.data,
    };
    return await s3.upload(params).promise();
  } catch (err) {
    logger.info(err);
  }
}

exports.createBucket = async (config) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!config) reject("Please provide configuaration.");
      let create = await s3
        .createBucket({
          Bucket: config.bucket,
        })
        .promise();
      let enableVersiong = await s3
        .putBucketVersioning({
          Bucket: config.bucket,
          VersioningConfiguration: {
            MFADelete: "Disabled",
            Status: "Enabled",
          },
        })
        .promise();
      let blockePublicaccess = await s3
        .putPublicAccessBlock({
          Bucket: config.bucket,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
          },
        })
        .promise();
      logger.info("Bucket created successfully");
      resolve("Bucet created success fully.");
    } catch (err) {
      logger.info(err);
      reject("File creating bucket");
    }
  });
};

exports.fileUploadToS3 = async (bucketName, files, path) => {
  return new Promise((resolve, reject) => {
    files = Array.isArray(files) ? files : [files];
    if (!files.length) return reject("No files found");
    if (files.length > 20)
      return reject("Too many files. Maximum 20 files  are allowed");
    let uploaded = [];
    files.forEach(async (file) => {
      try {
        let uploadDetail = await upto_s3_storage(bucketName, file, path);
        uploaded.push(uploadDetail);
        logger.info(uploadDetail);
        if (uploaded.length == files.length) return resolve(uploaded);
      } catch (err) {
        logger.info(err);
        reject("File Uplaod failed");
      }
    });
  });
};

exports.fileDownloadFromS3 = async (bucketName, fileKey, fileVersion, res) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    VersionId: fileVersion == "undefined" ? undefined : fileVersion,
  };
  try {
    let data = await s3.getObject(params).promise();
    res.status(200).send(data.Body);
  } catch (ex) {
    logger.info(ex);
  }
};
exports.getFileFromS3 = async (bucketName, fileKey, fileVersion) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      VersionId: fileVersion == "undefined" ? undefined : fileVersion,
    };
    try {
      let data = await s3.getObject(params).promise();
      resolve(data);
    } catch (ex) {
      logger.info(ex);
      reject(ex);
    }
  });
};
exports.fileDeleteFromS3 = (bucketName, fileKey, VersionId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        VersionId,
      };
      let data = await s3.deleteObject(params).promise();
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};
exports.getSignedLink = (
  bucketName,
  fileKey,
  filename,
  signedUrlExpireSeconds = 300
) => {
  const responseconfig = filename
    ? { ResponseContentDisposition: 'attachment; filename ="' + filename + '"' }
    : {};
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Expires: signedUrlExpireSeconds,
    ...responseconfig,
  };
  return s3.getSignedUrlPromise("getObject", params);
};
exports.getUploadLink = (bucketName, fileKey, signedUrlExpireSeconds = 300) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Expires: signedUrlExpireSeconds,
  };
  return s3.getSignedUrlPromise("putObject", params);
};
