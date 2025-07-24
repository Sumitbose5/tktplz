import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null); // 'login' | 'register' | null
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  

  const showLoginModal = () => setModalType("login");
  const showRegisterModal = () => setModalType("register");
  const hideModal = () => setModalType(null);
  const showOTPModal = () => setModalType("otp");

  return (
    <ModalContext.Provider value={{ modalType, showLoginModal, showRegisterModal, isSidebarOpen, setSidebarOpen, hideModal, showOTPModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);