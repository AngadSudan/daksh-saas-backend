import { S3Client } from "@aws-sdk/client-s3";
class s3Features {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  async createS3Bucket() {}
  async removeS3Bucket() {}
  async uploadToS3() {}
  async deleteFromS3() {}
}

const s3Feature = new s3Features();
export default s3Feature;
