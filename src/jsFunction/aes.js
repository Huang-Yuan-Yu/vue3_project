import CryptoJS from "crypto-js";

// 256位的密钥：
const secretKey = "yGTDM0skK7eAUeSxP872OxjPKrdp/0aK";

export default {
    /**
     * AES-256-ECB对称加密
     * @param text {string} 要加密的明文
     *
     * @returns {string} 加密后的密文，Base64格式
     */
    encrypt(text) {
        var keyHex = CryptoJS.enc.Base64.parse(secretKey);
        var messageHex = CryptoJS.enc.Utf8.parse(text);
        var encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    },
    
    /**
     * AES-256-ECB对称解密
     * @param textBase64 {string} 要解密的密文，Base64格式
     * @returns {string} 解密后的明文
     */
    decrypt(textBase64) {
        var keyHex = CryptoJS.enc.Base64.parse(secretKey);
        var decrypt = CryptoJS.AES.decrypt(textBase64, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        return CryptoJS.enc.Utf8.stringify(decrypt);
    },
};