import { S3Client } from "@aws-sdk/client-s3";
import { networkInterfaces } from "os";

import { serverEnv } from "@potential/env";

// dynamically work out the endpoint based on the environment or localhost ip
const getS3Endpoint = (): string => {
  const endpointEnv = serverEnv.storage.STORAGE_S3_ENDPOINT;
  if (endpointEnv && endpointEnv.length > 0) {
    console.log("💿 using S3 endpoint from env", { endpointEnv });
    return endpointEnv;
  }

  const localhostIP = () => {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] ?? []) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
    return null;
  };

  const ip = localhostIP();
  if (!ip) {
    console.error(
      "🚨 💿 Failed to get the s3 endpoint from ENV or via local IP",
    );
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  console.log("💿 using S3 endpoint from IP address", { ip });

  return `http://${ip}:3902`;
};

export const s3Client = new S3Client({
  region: serverEnv.storage.STORAGE_S3_REGION,
  endpoint: getS3Endpoint(),
  forcePathStyle: true,
  credentials: {
    accessKeyId: serverEnv.storage.STORAGE_S3_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.storage.STORAGE_S3_SECRET_ACCESS_KEY,
  },
});

export { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
export { getSignedUrl } from "@aws-sdk/s3-request-presigner";

