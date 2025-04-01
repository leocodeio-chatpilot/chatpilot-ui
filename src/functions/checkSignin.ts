export const checkSignin = () => {
  try {
    const cookies = document.cookie;
    console.log(cookies);
    if (cookies) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking signin status:", error);
    return false;
  }
};
