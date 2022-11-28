const https = require('https')

const clientId = process.env.clientID
const clientSecret = process.env.clientSecret
const zohoOAuthBaseURL = process.env.zohoOAuthBaseURL
const redirectUri = process.env.redirectUri
const extensionUri = process.env.extensionUri

module.exports.handle = async (event, context, callback) => {
  const query = event.queryStringParameters

  if (!query.code) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing code',
      }),
    }
  }

  const accessTokenResponse = await new Promise((resolve, reject) => {
    let data = ''

    const req = https.request(
      {
        hostname: zohoOAuthBaseURL,
        path: `/oauth/v2/token?client_id=${clientId}&grant_type=authorization_code&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${query.code}`,
        method: 'POST',
      },
      (res) => {
        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          resolve(JSON.parse(data))
        })

        res.on('error', (error) => {
          reject(error)
        })
      }
    )

    req.end()
  })

  const response = {
    statusCode: 307,
    headers: {
      Location: `${extensionUri}?access_token=${accessTokenResponse.access_token}&refresh_token=${accessTokenResponse.refresh_token}&expires_in=${accessTokenResponse.expires_in}`,
    },
  }

  // either return cb(undefined, response) or return response
  return response
}
