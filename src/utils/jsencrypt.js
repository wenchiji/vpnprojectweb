import JSEncrypt from 'jsencrypt/bin/jsencrypt'


// 加密
export function encrypt(publicKey, data) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(data) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(privateKey,data) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(data)
}
