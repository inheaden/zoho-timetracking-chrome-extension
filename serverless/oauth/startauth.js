const https = require('https')

const clientId = process.env.clientID
const clientSecret = process.env.clientSecret
const redirectUri = process.env.redirectUri
const zohoOAuthBaseURL = process.env.zohoOAuthBaseURL
const scopes = ['ZOHOPEOPLE.timetracker.ALL']

const redirectCookieKey = 'zoho-oauth-redirect'

module.exports.handle = (event, context, callback) => {
  const query = event.queryStringParameters

  if (query && query.code) {
    return handleCallback(event, context, callback)
  } else {
    return handleStart(event, context, callback)
  }
}

function handleStart(event, context, callback) {
  const query = event.queryStringParameters

  const redirect = query.redirect_uri

  if (!redirect) {
    return {
      statusCode: 400,
      body: 'Missing redirect_uri',
    }
  }

  const response = {
    statusCode: 307,
    headers: {
      Location: `https://${zohoOAuthBaseURL}/oauth/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join(
        ','
      )}&prompt=consent&access_type=offline`,
      'Set-Cookie': `${redirectCookieKey}=${redirect}`,
    },
  }

  return response
}

async function handleCallback(event, context, callback) {
  const query = event.queryStringParameters
  const headers = event.headers

  if (!query.code) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing code',
      }),
    }
  }

  const redirect = headers.Cookie?.split(';')
    ?.find((cookie) => cookie.startsWith(redirectCookieKey))
    ?.split('=')[1]

  if (!redirect) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing redirect cookie',
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
      Location: `${redirect}?access_token=${accessTokenResponse.access_token}&refresh_token=${accessTokenResponse.refresh_token}&expires_in=${accessTokenResponse.expires_in}`,
    },
  }

  // either return cb(undefined, response) or return response
  return response
}
