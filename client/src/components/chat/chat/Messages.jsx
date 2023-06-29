import { useState, useEffect, useContext, useRef } from "react";
import { Box, styled } from "@mui/material";

import { io } from "socket.io-client";

import { getMessages, newMessages } from "../../../service/api";
import { AccountContext } from "../../../context/AccountProvider";

//components
import Message from "./Message";
import Footer from "./Footer";

const Wrapper = styled(Box)`
  background-image: url(${"https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"});
  background-size: 50%;
`;

const StyledFooter = styled(Box)`
  height: 55px;
  background: #ededed;
  // position: absolute;
  width: 100%;
  // bottom: 0
`;

const Component = styled(Box)`
  height: 80vh;
  overflow-y: scroll;
`;

const Container = styled(Box)`
  padding: 1px 80px;
`;

const Messages = ({ person, conversation }) => {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [value, setValue] = useState();
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  const scrollRef = useRef();

  const { account, socket, newMessageFlag, setNewMessageFlag } =
    useContext(AccountContext);

  // lấy ra tin nhắn đến
  useEffect(() => {
    // nhận message từ io
    socket.current.on("getMessage", (data) => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  // lấy ra chi tiết tin nhắn của đoạn hội thoại
  useEffect(() => {
    const getMessageDetails = async () => {
      let data = await getMessages(conversation?._id);
      setMessages(data);
    };
    getMessageDetails();
  }, [conversation?._id, person._id, newMessageFlag]);

  // tạo hiệu ứng scoll chuột
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ transition: "smooth" });
  }, [messages]);

  useEffect(() => {
    incomingMessage &&
      conversation?.members?.includes(incomingMessage.senderId) &&
      setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage, conversation]);

  const receiverId = conversation?.members?.find(
    (member) => member !== account.sub
  );

  //handle
  // sự kiện gửi tin nhắn
  const sendText = async (e) => {
    console.log(e);
    let code = e.keyCode || e.which;
    if (!value) return;

    if (code === 13) {
      let message = {};
      if (!file) {
        message = {
          senderId: account.sub,
          receiverId: receiverId,
          conversationId: conversation._id,
          type: "text",
          text: value,
        };
      } else {
        message = {
          senderId: account.sub,
          conversationId: conversation._id,
          receiverId: receiverId,
          type: "file",
          text: image,
        };
      }

      // gửi message lên io
      socket.current.emit("sendMessage", message);

      await newMessages(message);

      setValue("");
      setFile();
      setImage("");
      setNewMessageFlag((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      <Component>
        {messages &&
          messages.map((message) => (
            <Container ref={scrollRef}>
              <Message message={message} />
            </Container>
          ))}
      </Component>

      {/* INPUT CHAT */}
      <Footer
        sendText={sendText}
        value={value}
        setValue={setValue}
        setFile={setFile}
        file={file}
        setImage={setImage}
      />
    </Wrapper>
  );
};

export default Messages;
