const validators = {}

validators.addTest = (req, res, next) => {
    if (!req.body.testName) return res.reply(message.required_field('testName'));
    next();
}

validators.addQuestionsToTest = (req, res, next) => {
    if (!req.params.id) return res.reply(message.required_field('id'));
    const { questions } = req.body;
    if (!questions.length) {
        if (!questions.options || questions.options.length < 4) return res.status(400).json({ message: 'Options cannot be less than 4' });
        if (!questions.testSections || !['R', 'QA', 'E', 'G'].includes(questions.testSections)) return res.status(400).json({ message: 'Invalid test section' });
        if (!questions.questionIndex) return res.reply(message.required_field('questionIndex'));
    } else {
        for (const question of questions) {
            if (!question.options || question.options.length < 4) return res.status(400).json({ message: 'Options cannot be less than 4' });
            if (!question.testSections || !['R', 'QA', 'E', 'G'].includes(question.testSections)) return res.status(400).json({ message: 'Invalid test section' });
            if (!question.questionIndex) return res.reply(message.required_field('questionIndex'));
        }
    }
    next();
}

validators.updateQuestion = (req, res, next) => {
    const { question } = req.body
    if (!question) return res.reply(message.required_field('question'));
    if (!req.params.id) return res.reply(message.required_field('id'));
    if (!question.questionIndex) return res.reply(message.required_field('questionIndex'));
    if (!question.options || question.options.length < 4) return res.reply(message.required_field('options'));
    next();
}

validators.addImage = (req, res, next) => {
    const { testId, imageUrl } = req.body;
    if (!testId) return res.reply(message.required_field('testId'));
    if (!imageUrl) return res.reply(message.required_field('imageUrl'));
    next();
}

module.exports = validators