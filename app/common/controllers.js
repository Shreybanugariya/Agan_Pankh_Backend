const User = require('../users/model')
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const SECRET_KEY = process.env.SECRET_KEY || 'Agan_pankh'
const amount = process.env.PREMINUM_AMOUNT || 100
const crypto = require('crypto')

const Razorpay = require('razorpay')

const controllers = {}
controllers.createOrder = async (req, res) => {

    const { hasPreminum, city, contactNo, email } = req.user
    if (hasPreminum) return res.reply(message.no_prefix('You already have hasPreminum'))
    if (!city || !contactNo) return res.reply(message.no_prefix('City or Contact No not provided. Please update user details'))

    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    })

    // const { _id, email, username, contactNo, googleId } = req.user
    const options = {
        amount: amount,
        currency: 'INR',
        receipt: `123`, //Receipt no that corresponds to this Order,
        payment_capture: true,
        notes: {
         orderType: "Preminum",
         user: email,
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
    const { payload } = req.body
    const obj = payload.payment.entity
    if (digest === req.headers['x-razorpay-signature']) {
        const googleId = obj.notes.googleId
        await User.updateOne({ googleId }, { hasPreminum: true })
        res.json({status: 'ok'})
    } else {
        res.status(400).send('Invalid signature');
    }
}

controllers.createUPILink = async (req, res) => {
    try {
        const { hasPreminum, city, contactNo, username, email, googleId } = req.user
        if (hasPreminum) return res.reply(message.no_prefix('You already have hasPreminum'))
        if (!city || !contactNo) return res.reply(message.no_prefix('City or Contact No not provided. Please update user details'))

        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET,
        })

        const upiLinkOptions = {
            amount, //49900
            currency: "INR",
            accept_partial: false,
            description: "Get Preminum for the bright future",
            customer: {
                name: username || '',
                email,
                contact: `${contactNo}`,
            },
            notify: {
                sms: false,
                email: false
            },
            reminder_enable: true,
            notes: {
                googleId: `${googleId}`,
            },
            callback_url: 'https://agan-pankh-frontend.vercel.app/'
        }

        const data = await razorpay.paymentLink.create(upiLinkOptions)
        if (data.short_url) return res.reply(message.success('Payment Link Fetched'),  data)
    } catch (error) {
        console.log(error)
        res.status(400).send('Not able to generate payment link. Please try again!');
     }
}

module.exports = controllers