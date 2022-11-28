const clientId = process.env.clientID
const redirectUri = process.env.redirectUri
const zohoOAuthBaseURL = process.env.zohoOAuthBaseURL
const scopes = ['ZOHOPEOPLE.timetracker.ALL']

module.exports.handle = (event, context, callback) => {
  const response = {
    statusCode: 307,
    headers: {
      Location: `https://${zohoOAuthBaseURL}/oauth/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join(
        ','
      )}&prompt=consent&access_type=offline`,
    },
  }

  return response
}
