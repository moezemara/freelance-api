import AWS from 'aws-sdk';

const wasabiEndpoint = new AWS.Endpoint('s3.wasabisys.com');

const accessKeyId = '8HFGFB5UBIQ1S5ACYFVP'
const secretAccessKey = 'oo8ESYEEC9kgm9YzWRTDCIIcqOj6w7THkMpmANME';

const s3 = new AWS.S3({
  endpoint: wasabiEndpoint,
  region: 'us-east-2',
  accessKeyId,
  secretAccessKey
});

s3.putObject({
    Body: 'Hello World',
    Bucket: "homielancer",
    Key: 'hello.txt'
  }
  , (err, data) => {
    if (err) {
       console.log(err);
    }
    console.log(data);
  });