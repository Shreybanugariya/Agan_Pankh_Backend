const env = process.env.NODE_ENV || 'dev'

const oEnv = {}

oEnv.dev = {}

process.env.NODE_ENV = 'dev'
process.env.DB_URL = oEnv[env].DB_URL
process.env.JWT_SECRET_KEY = oEnv[env].JWT_SECRET_KEY
process.env.PORT = oEnv[env].PORT
process.env.GOOGLE_CLIENT_ID = oEnv[env].GOOGLE_CLIENT_ID
process.env.GOOGLE_CLIENT_SECRET = oEnv[env].GOOGLE_CLIENT_SECRET
process.env.RAZORPAY_KEY_ID = oEnv[env].RAZORPAY_KEY_ID
process.env.RAZORPAY_KEY_SECRET = oEnv[env].RAZORPAY_KEY_SECRET