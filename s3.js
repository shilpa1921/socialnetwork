const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("req.file is not there");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!

            console.log("amazon put object complete");
            next();

            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log("Error in put upload object s3.js", err);
            res.sendStatus(500);
        });
};

exports.delete = (picArr, next) => {
    if (!picArr) {
        console.log("no pics");
        return res.sendStatus(500);
    }

    const promise = s3
        .deleteObjects({
            Bucket: "spicedling",
            Delete: {
                Objects: picArr,
                Quiet: false,
            },
        })
        .promise();

    promise
        .then((data) => {
            console.log("data in s3.js", data);
            console.log("s3.js deleteObject fired");
            next();
        })
        .catch((err) => {
            console.log("s3.js: error in delete object", err);
            res.sendStatus(500);
        });
};
