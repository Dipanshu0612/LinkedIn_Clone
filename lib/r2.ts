import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const getR2Config = () => {
  const r2Endpoint = process.env.R2_ENDPOINT;
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const r2BucketName = process.env.R2_BUCKET_NAME;
  const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName) {
    throw new Error("Cloudflare R2 credentials are missing");
  }

  return {
    r2Endpoint,
    r2AccessKeyId,
    r2SecretAccessKey,
    r2BucketName,
    r2PublicBaseUrl,
  };
};

const guessContentType = (file: File) => {
  if (file.type) return file.type;
  return "application/octet-stream";
};

export const uploadImageToR2 = async (image: File) => {
  const {
    r2Endpoint,
    r2AccessKeyId,
    r2SecretAccessKey,
    r2BucketName,
    r2PublicBaseUrl,
  } = getR2Config();

  const r2Client = new S3Client({
    region: "auto",
    endpoint: r2Endpoint,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
    },
  });

  const buffer = Buffer.from(await image.arrayBuffer());
  const extension = image.name?.split(".").pop() || "png";
  const key = `posts/${randomUUID()}_${Date.now()}.${extension}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: r2BucketName,
      Key: key,
      Body: buffer,
      ContentType: guessContentType(image),
    }),
  );

  if (r2PublicBaseUrl) {
    return `${r2PublicBaseUrl.replace(/\/$/, "")}/${key}`;
  }

  return `${r2Endpoint.replace(/\/$/, "")}/${r2BucketName}/${key}`;
};
