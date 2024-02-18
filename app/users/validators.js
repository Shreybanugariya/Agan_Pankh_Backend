const validators = {}

validators.createUser = (req, res, next) => {
    const { idToken } = req.body
    if (!idToken) return res.reply(messages.required_field('idToken'));
    next();
}

validators.updateUser = (req, res, next) => {
    if (!req.body.contactNo) return res.reply(message.required_field('contactNo'));
    if (!req.body.city) return res.reply(message.required_field('city'));
    if (!req.body.username) return res.reply(message.required_field('username'));   
    next();
}

module.exports = validators