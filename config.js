//declare all the keys and tokens that are being pulled from .env
var config = {
    port: process.env.PORT,
	db: {
	  url: process.env.DB_URL
	},
	slack: {
	  username: process.env.SLACK_USERNAME,
      token: process.env.SLACK_TOKEN,
      webhook: process.env.SLACK_WEBHOOK
	},
	secret: process.env.SECRET
  };
module.exports = config;