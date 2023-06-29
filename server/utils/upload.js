import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

import dotenv from "dotenv";

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// tạo kho chứa file and image
const storage = new GridFsStorage({
  url: `mongodb+srv://patrickDev:4YZhfjLLoq0jUtWn@cluster0.kuzft.mongodb.net/whatsApp-clone?retryWrites=true&w=majority`,
  options: { useNewUrlParser: true },
  file: (request, file) => {
    const match = ["image/png", "image/jpg"];

    if (match.indexOf(file.memeType) === -1)
      return `${Date.now()}-file-${file.originalname}`;

    return {
      bucketName: "photos",
      filename: `${Date.now()}-file-${file.originalname}`,
    };
  },
});

export default multer({ storage });
