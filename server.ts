/** @format */

import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import { listBucketContents } from "./libs/fileManager";
import http from "http";
import fs from "fs";

const app = express();
const port = 3000;

const spacesEndpoint = new aws.Endpoint("sgp1.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const upload = multer({
  storage: multerS3({
    // @ts-ignore
    s3,
    bucket: "msquarefdc",
    acl: "public-read",
    key: function (request: any, file: any, cb: any) {
      console.log(file);
      cb(null, "mpps-summer" + file.originalname);
    },
  }),
}).array("files", 1);

app.use(express.static("public"));

app.post("/upload", (request, response) => {
  upload(request, response, async (error: any) => {
    if (error) {
      console.log(error);
      return response.send({ error: "Error occurred." });
    }
    console.log("File uploaded successfully.");
    const bucketContents: any = await listBucketContents();

    response.send({
      message: "File uploaded successfully.",
      data: bucketContents.Contents,
    });
  });
});

app.delete("/file/:key", async (req, res) => {
  try {
    const { key } = req.params;
    await s3
      .deleteObject({
        Bucket: "msquarefdc",
        Key: key,
      })
      .promise();
    console.log(`File ${key} deleted successfully.`);
    res.sendStatus(200);
  } catch (error) {
    console.log(`Error deleting file: ${error}`);
    res.sendStatus(500);
  }
});

// const server = http.createServer((req, res) => {
//   if (req.method === "DELETE" && req.url.startsWith("/file/")) {
//     // If the request method is DELETE and the URL starts with /file/
//     // then extract the file path from the URL
//     const filePath = req.url.slice(6); // remove the /file/ prefix
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         // If there is an error, send an error response
//         res.statusCode = 500;
//         res.end(`Error deleting file: ${err}`);
//       } else {
//         // If the file is deleted successfully, send a success response
//         res.statusCode = 200;
//         res.end("File deleted successfully");
//       }
//     });
//   } else {
//     // If the request method or URL is incorrect, send a 404 response
//     res.statusCode = 404;
//     res.end("Not found");
//   }
// });

app.listen(port, () => {
  console.log(`Example app started listening at ${port}`);
});
