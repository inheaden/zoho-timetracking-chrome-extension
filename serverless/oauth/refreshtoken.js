const https = require('https')

const clientId = process.env.clientID
const clientSecret = process.env.clientSecret
const zohoOAuthBaseURL = process.env.zohoOAuthBaseURL

module.exports.handle = async (event, context, callback) => {
  const query = event.queryStringParameters

  if (!query.refresh_token) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing refresh_token',
      }),
    }
  }

  const accessTokenResponse = await new Promise((resolve, reject) => {
    let data = ''

    const req = https.request(
      {
        hostname: zohoOAuthBaseURL,
        path: `/oauth/v2/token?client_id=${clientId}&grant_type=refresh_token&client_secret=${clientSecret}&refresh_token=${query.refresh_token}`,
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
    statusCode: 200,
    body: JSON.stringify(accessTokenResponse),
  }

  return response
}
