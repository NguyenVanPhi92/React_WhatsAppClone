import Conversation from "../modal/Conversation.js";

export const newConversation = async (request, response) => {
  let senderId = request.body.senderId; // id người gửi
  let receiverId = request.body.receiverId; //id người nhận

  const exist = await Conversation.findOne({
    members: { $all: [receiverId, senderId] },
  });

  if (exist) {
    response.status(200).json("conversation already exists");
    return;
  }
  const newConversation = new Conversation({
    members: [senderId, receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    response.status(200).json(savedConversation);
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getConversation = async (request, response) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [request.body.senderId, request.body.receiverId] },
    });
    response.status(200).json(conversation);
  } catch (error) {
    response.status(500).json(error);
  }
};
