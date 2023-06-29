import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(); // acount khi login
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  // user có hoạt động ?
  const [activeUsers, setActiveUsers] = useState([]);

  const [newMessageFlag, setNewMessageFlag] = useState(false);

  const socket = useRef();

  // connect với socket
  useEffect(() => {
    socket.current = io("ws://localhost:9000");
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        showloginButton,
        setShowloginButton,
        showlogoutButton,
        setShowlogoutButton,
        socket,
        activeUsers,
        setActiveUsers,
        newMessageFlag,
        setNewMessageFlag,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
