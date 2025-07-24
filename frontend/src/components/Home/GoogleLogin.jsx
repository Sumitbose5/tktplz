
export const handleGoogleLogin = async (hideModal) => {
  hideModal();
  window.open("http://localhost:3000/api/auth/google", "_self");
};
