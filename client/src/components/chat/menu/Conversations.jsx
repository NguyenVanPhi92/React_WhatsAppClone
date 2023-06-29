import { useState, useEffect, useContext } from "react";

import { Box, styled, Divider } from "@mui/material";

import { AccountContext } from "../../../context/AccountProvider";

//components
import Conversation from "./Conversation";
import { getUsers } from "../../../service/api";

const Component = styled(Box)`
  overflow: overlay;
  height: 81vh;
`;

const StyledDivider = styled(Divider)`
  margin: 0 0 0 70px;
  background-color: #e9edef;
  opacity: 0.6;
`;

const Conversations = ({ text }) => {
  const [users, setUsers] = useState([]);

  const { account, socket, setActiveUsers } = useContext(AccountContext);

  // search users
  useEffect(() => {
    if (text == null) return;

    const fetchData = async () => {
      let data = await getUsers();
      console.log("user ", data);
      if (data == null) return;
      // search user
      let fiteredData = data.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
      setUsers(fiteredData);
    };
    fetchData();
  }, [text]);

  // connect với phương thức socket
  useEffect(() => {
    // gửi user login xuống io
    socket.current.emit("addUsers", account); //emit gửi thông điệp lên io
    //on nhận thông điệp từ io
    socket.current.on("getUsers", (users) => {
      setActiveUsers(users); // nhận user đã login và set hoạt động
    });
  }, [account, setActiveUsers, socket]);

  return (
    <Component>
      {users &&
        users.map(
          (user, index) =>
            user.sub !== account.sub && (
              <>
                <Conversation user={user} />
                {users.length !== index + 1 && <StyledDivider />}
              </>
            )
        )}
    </Component>
  );
};

export default Conversations;
