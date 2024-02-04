const validators = {}

validators.createUser = (req, res, next) => {
    const { idToken } = req.body
    if (!idToken) return res.reply(messages.required_field('idToken'));
    next();
}

validators.updateUser = (req, res, nex) => {
    if (!req.parms.id) return res.reply(messages.required_field('id'))
    const {} = req.body
    // if (!req.parms.i) return res.reply(messages.required_field('id'))
    // if (!req.parms.id) return res.reply(messages.required_field('id'))
}

module.exports = validators