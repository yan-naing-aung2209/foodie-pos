import { config } from "@/config";
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import qrcode from "qrcode";

const s3Client = new S3Client({
  endpoint: config.spaceEndPoint,
  region: "sgp1",
  credentials: {
    accessKeyId: config.spaceAccessKeyId,
    secretAccessKey: config.spaceSecretAccessKey,
  },
});

export const assetUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "msquarefdc",
    acl: "public-read",
    key: (request, file, cb) => {
      cb(
        null,
        `foodie-pos/msquarefdc-batch3/yan-naing-aung/${Date.now()}_${
          file.originalname
        }`
      );
    },
  }),
}).single("file");

export const generateImageLinkForQRCode = (tableId: number) => {
  return `${config.orderAppUrl}?tableId=${tableId}`;
};

export const qrCodeImageUpload = async (tableId: number) => {
  try {
    const qrImageData = await qrcode.toDataURL(
      generateImageLinkForQRCode(tableId),
      { scale: 20 }
    );

    const input = {
      Bucket: "msquarefdc",
      Key: `foodie-pos/msquarefdc-batch3/yan-naing-aung/qrcode/tableId-${tableId}`,
      ACL: ObjectCannedACL.public_read,
      Body: Buffer.from(
        qrImageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    };

    const command = new PutObjectCommand(input);
    await s3Client.send(command);

    return `https://msquarefdc.sgp1.cdn.digitaloceanspaces.com/foodie-pos/msquarefdc-batch3/yan-naing-aung/qrcode/tableId-${tableId}`;
  } catch (err) {
    console.log(err);
  }
};
