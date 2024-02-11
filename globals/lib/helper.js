const _ = {}

// _.clone = function (data = {}) {
//     const originalData = data.toObject ? data.toObject() : data; // for mongodb result operations
//     const eType = originalData ? originalData.constructor : 'normal';
//     if (eType === Object) return { ...originalData };
//     if (eType === Array) return [...originalData];
//     return data;
//     // return JSON.parse(JSON.stringify(data));
// };

_.pick = function (obj, array) {
    const clonedObj = this.clone(obj);
    return array.reduce((acc, elem) => {
        if (elem in clonedObj) acc[elem] = clonedObj[elem];
        return acc;
    }, {});
};

module.exports = _