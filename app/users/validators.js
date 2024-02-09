const validators = {}

validators.createUser = (req, res, next) => {
    const { idToken } = req.body
    if (!idToken) return res.reply(messages.required_field('idToken'));
    next();
}

validators.updateUser = (req, res, next) => {
    if (!req.params.id) return res.reply(messages.required_field('id'));
    if (!req.body.contactNo) return res.reply(messages.required_field('contactNo'));
    if (!req.body.city) return res.reply(messages.required_field('city'));
    next();
}

module.exports = validators