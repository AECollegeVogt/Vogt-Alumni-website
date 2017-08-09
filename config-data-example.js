var config = {
  port: PORT,
  db: {
  	url: DB_URL
  },
  slack: {
  	username: USER_NAME,
  	token: SLACK_TOKEN,
  	webhookUri: WEBHOOK_URI
  }
};

module.exports = config;