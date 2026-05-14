import CryptoJS from "crypto-js";

export const encryptMessage = (text = "") => {
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

