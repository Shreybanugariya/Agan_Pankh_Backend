const common = {}
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

common.verifyGoogleToken = async (token) => {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    return payload;
  }

module.exports = common