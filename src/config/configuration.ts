/* eslint-disable prettier/prettier */
export default () => ({
  port:
    process.env.NODE_ENV == 'production'
      ? process.env.PROD_PORT
      : process.env.DEV_PORT,
  dbUrl:
    process.env.NODE_ENV == 'production'
      ? process.env.PROD_DB_URL
      : process.env.DEV_DB_URL,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  promobileSmsUrl: process.env.PROMOBILE_SMS_URL,
  promobileSmsAccessKey:process.env.PROMOBILE_SMS_ACCESS_KEY
});
