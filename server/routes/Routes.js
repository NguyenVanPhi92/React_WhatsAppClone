import express from "express";

import {
  newConversation,
  getConversation,
} from "../controller/conversation-controller.js";
import { addUser, getUser } from "../controller/user-controller.js";
import { newMessage, getMessage } from "../controller/message-controller.js";
import { uploadImage, getImage } from "../controller/image-controller.js";

import upload from "../utils/upload.js";

const route = express.Router();

route.post("/add", addUser);
route.get("/users", getUser); // et all user

// thêm và lấy ra đoạn hội thoại
route.post("/conversation/add", newConversation);
route.post("/conversation/get", getConversation);

// thêm và lấy ra tin nhắn
route.post("/message/add", newMessage);
route.get("/message/get/:id", getMessage);

// gửi file
route.post("/file/upload", upload.single("file"), uploadImage);
route.get("/file/:filename", getImage);

export default route;
