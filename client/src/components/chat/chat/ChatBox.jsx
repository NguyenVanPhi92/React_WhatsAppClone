import { useContext, useState, useEffect } from "react";

import { Box } from "@mui/material";

import { UserContext } from "../../../context/UserProvider";
import { AccountContext } from "../../../context/AccountProvider";
import { getConversation } from "../../../service/api";

//components
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";

const ChatBox = () => {
  //lấy ra person
  const { person } = useContext(UserContext);
  // lấy ra account đã login
  const { account } = useContext(AccountContext);
  // lấy ra đoạn hội thoại của user với user
  const [conversation, setConversation] = useState({});

  useEffect(() => {
    const getConversationDetails = async () => {
      // lấy ra đoạn hội thoại
      let data = await getConversation({
        senderId: account.sub,
        receiverId: person.sub,
      });
      setConversation(data);
    };
    getConversationDetails();
  }, [account.sub, person.sub]);

  return (
    <Box style={{ height: "75%" }}>
      <ChatHeader person={person} />
      <Messages person={person} conversation={conversation} />
    </Box>
  );
};

export default ChatBox;
