/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://authentication_owner:npg_RPzlg90otuvJ@ep-young-dust-a4g6zpin-pooler.us-east-1.aws.neon.tech/authentication?sslmode=require&channel_binding=require',
    }
  };