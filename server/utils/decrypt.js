import CryptoJS from "crypto-js";

export const decryptMessage = (encrypted = "") => {
  if (!encrypted) {
    return "";
  }

  const bytes = CryptoJS.AES.decrypt(encrypted, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

