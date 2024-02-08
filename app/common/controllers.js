const controllers = {}
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const amount = process.env.PREMINUM_AMOUNT || 499

controllers.createPayment = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    })

    const { _id, email, username, contactNo, googleId } = req.user
    const options = {
        amount: amount * 100, // rzp format with paise
        currency: 'INR',
        receipt: `${googleId}`, //Receipt no that corresponds to this Order,
        payment_capture: true,
        notes: {
         orderType: "Preminum",
         user: _id,
         userEmail: email
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

module.exports = controllers