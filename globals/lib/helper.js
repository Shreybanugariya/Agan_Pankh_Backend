const crypto = require('crypto');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const _ = {}

_.clone = function (data = {}) {
    const originalData = data.toObject ? data.toObject() : data; // for mongodb result operations
    const eType = originalData ? originalData.constructor : 'normal';
    if (eType === Object) return { ...originalData };
    if (eType === Array) return [...originalData];
    return data;
    // return JSON.parse(JSON.stringify(data));
};

_.pick = function (obj, array) {
    const clonedObj = this.clone(obj);
    return array.reduce((acc, elem) => {
        if (elem in clonedObj) acc[elem] = clonedObj[elem];
        return acc;
    }, {});
};

_.checkPromo = (code) =>{
    const codes = ['SPCF2024', 'KDVS2024', 'SD2024', 'JM2024', 'AGANPANKH2024']
    if (codes.includes(code)) return true
    return false
}

_.encryptPassword = function (password) {
    return crypto.createHmac('sha256', JWT_SECRET_KEY).update(password).digest('hex');
};

module.exports = _