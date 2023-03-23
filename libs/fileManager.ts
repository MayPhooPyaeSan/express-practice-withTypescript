/** @format */

import { S3 } from "@aws-sdk/client-s3";
import { ListObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3({
  endpoint: "https://sgp1.digitaloceanspaces.com",
  region: "asia",
  credentials: {
    accessKeyId: "DO00BP7U9JNXC6LDEM3J",
    secretAccessKey: "N3vZ3itN4GBvEJtZsCR5yac5dwfSWNKQaRwYoWQF5P8",
  },
});

// Specifies a path within your bucket, e.g. example-bucket-name/example-directory.
export const bucketParams = { Bucket: "msquarefdc" };

// Returns a list of objects in your specified path.
const listBucketContents = async () => {
  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export { listBucketContents };
