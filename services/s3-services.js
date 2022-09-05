const AWS = require("aws-sdk");

let uploadFile = async (data, filename) => {
    let s3bucket = new AWS.S3({
        accessKeyId : process.env.S3_KEY_ID,
        secretAccessKey : process.env.S3_KEY_SECRET
    });
    var params = {
        Bucket : process.env.S3_BUCKET_NAME,
        Key : filename,
        Body : data,
        ACL : "public-read"
    };
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if(err){
                console.log("Something went wrong!",err);
                reject(err);
            }else{
                console.log("success", s3response);
                resolve(s3response);
            }
        })
    })
}

module.exports = {
    uploadFile
}