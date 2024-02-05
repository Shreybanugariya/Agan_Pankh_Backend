const validators = {}

validators.createUser = (req, res, next) => {
    const { idToken } = req.body
    if (!idToken) return res.reply(messages.required_field('idToken'));
    next();
}

validators.updateUser = (req, res, nex) => {
    if (!req.parms.id) return res.reply(messages.required_field('id'))
    if (!req.bodycontactNo) return res.reply(messages.required_field('contactNo'))
}

module.exports = validators