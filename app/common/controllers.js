const controllers = {}
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const amount = process.env.PREMINUM_AMOUNT || 100

controllers.createPayment = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
        amount: amount * 100, // rzp format with paise
        currency: 'INR',
        receipt: "receipt#1", //Receipt no that corresponds to this Order,
        payment_capture: true,
        notes: {
         orderType: "Preminum"
        }
       })
    try {
        const response = await razorpay.orders.create(options)
        return res.json({ order_id: response.id, currency: response.currency, amount: response.amount,
        })
    } catch (err) {
       res.status(400).send('Not able to create order. Please try again!');
    }
}

module.exports = controllers