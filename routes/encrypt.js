const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = 'wqk04rdanielpenenorme';
const secretKey = Buffer.alloc(32); 
secretKey.write(key);
const iv = crypto.randomBytes(16); 

const encrypt = (text) => {
  let cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), content: encrypted.toString('hex') };
};

const decrypt = (hash) => {
  let decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(hash.content, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };