const env = process.env

const oEnv = {}

oEnv.dev = {
    DB_URL:'mongodb+srv://shreyb:z5LbNHwhtQL29oLQ@cluster0.fy8km95.mongodb.net/Agan_Pankh',
    GOOGLE_CLIENT_ID:'551543918721-pa8bnj7h29bl5bs984cjr9f1snflqf7l.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET:'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',
    JWT_SECRET_KEY:'AGANPANKH_Spread_Your_Wings',
    RAZORPAY_KEY_ID:'rzp_test_KPdlAvWgCLNC76',
    RAZORPAY_KEY_SECRET:'y7oeNKWXSHtstLufBndxW4vB',
    PORT:3000,
}

process.env.NODE_ENV = 'dev'
process.env.DB_URL = oEnv[env].DB_URL
process.env.JWT_SECRET_KEY = oEnv[env].JWT_SECRET_KEY
process.env.PORT = oEnv[env].PORT
process.env.GOOGLE_CLIENT_ID = oEnv[env].GOOGLE_CLIENT_ID
process.env.GOOGLE_CLIENT_SECRET = oEnv[env].GOOGLE_CLIENT_SECRET
process.env.RAZORPAY_KEY_ID = oEnv[env].RAZORPAY_KEY_ID
process.env.RAZORPAY_KEY_SECRET = oEnv[env].RAZORPAY_KEY_SECRET