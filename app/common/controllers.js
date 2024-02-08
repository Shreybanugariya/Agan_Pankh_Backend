const controllers = {}
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const SECRET_KEY = process.env.SECRET_KEY || 'Agan_pankh'
const amount = process.env.PREMINUM_AMOUNT || 499
const crypto = require('crypto')

const Razorpay = require('razorpay')

controllers.createOrder = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    })

    // const { _id, email, username, contactNo, googleId } = req.user
    const options = {
        amount: amount * 100, // rzp format with paise
        currency: 'INR',
        receipt: `123`, //Receipt no that corresponds to this Order,
        payment_capture: true,
        notes: {
         orderType: "Preminum",
         user: 'test',
         userEmail: 'test'
        }
    }
    try {
        const response = await razorpay.orders.create(options)
        console.log('response', response)
        return res.status(200).json({ message: 'Payment Success', order_id: response.id, currency: response.currency, amount: response.amount })
    } catch (err) {
       res.status(400).send('Not able to create order. Please try again!');
    }
}

controllers.paymentCapture = async (req, res) => {
    const data = crypto.createHmac('sha256', SECRET_KEY)
    data.update(JSON.stringify(req.body))
    const digest = data.digest('hex')
    console.log(req.headers['x-razorpay-signature'])
    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
        res.json({
            status: 'ok'
        })
    } else {
        res.status(400).send('Invalid signature');
    }
}

module.exports = controllers