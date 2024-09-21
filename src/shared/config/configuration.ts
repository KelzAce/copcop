const isTest = () => (process.env.NODE_ENV === 'test' ? true : false);
const dbPort = isTest()
  ? process.env.DATABASE_PORT_TEST
  : process.env.DATABASE_PORT;

export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    username: isTest()
      ? process.env.DATABASE_USERNAME_TEST
      : process.env.DATABASE_USERNAME,
    password: isTest()
      ? process.env.DATABASE_PASSWORD_TEST
      : process.env.DATABASE_PASSWORD,
    database: isTest()
      ? process.env.DATABASE_NAME_TEST
      : process.env.DATABASE_NAME,
    host: isTest() ? process.env.DATABASE_HOST_TEST : process.env.DATABASE_HOST,
    port: Number(dbPort),
  },
  serverAppUrl: process.env.SERVER_APP_URL,
  reactAppUrl: process.env.REACT_APP_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
//   smartSmsToken: process.env.SMARTSMS_TOKEN,
//   smartSmsSenderId: process.env.SMARTSMS_SENDERID,
//   smartSmsRouting: process.env.SMARTSMS_ROUTING,
//   smartSmsType: process.env.SMARTSMS_TYPE,
//   smartSmsApiEndpoint: process.env.SMARTSMS_API_ENDPOINT,
  hashTokenSecret: process.env.HASH_TOKEN_SECRET,
//   subbsMailSenderAddress: process.env.SUBBS_MAIL_SENDERADDRESS,
//   mailjetApiKey: process.env.MAILJET_API_KEY,
//   mailjetApiSecret: process.env.MAILJET_API_SECRET,
//   twilioAccountSSID: process.env.TWILIO_ACCOUNT_SSID,
//   twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
//   twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  timeZone: process.env.TZ,
//   identityPassPrivateKey: process.env.IDENTITYPASS_PRIVATE_KEY,
//   identityPassAppId: process.env.IDENTITYPASS_APP_ID,
});
