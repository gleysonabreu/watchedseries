const crypto = {
  hashSaltRounds: 10,
  jwt: {
    duration: String(process.env.JWT_DURATION || '1h'),
    publicKey: String(process.env.JWT_PUBLIC_KEY).replace(/\\n/gm, '\n'),
    privateKey: String(process.env.JWT_PRIVATE_KEY).replace(/\\n/gm, '\n'),
  },
};

export default crypto;
