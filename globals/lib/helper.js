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

// ********************** To Adjust the test questions order **************************
// ;(async() => {
    // const Test = require('./app/tests/model')

    // const test2 = await Test.findById('65ca378690e5a8fa6d9b0656')
    // const newQuestions = []
    // for (const [index, q] of test2.questions.entries()) {
    //     q.questionIndex = index + 1
    //     if (q.questionIndex < 41) q.testSections = 'R'
    //     if (q.questionIndex > 40 && q.questionIndex < 71) q.testSections = 'QA'
    //     if (q.questionIndex > 70  && q.questionIndex < 86) q.testSections = 'E'
    //     if (q.questionIndex > 85) q.testSections = 'G'
    //     newQuestions.push(q)
    // }
    // const update = await Test.updateOne({ _id: '65ca378690e5a8fa6d9b0656' }, { questions: newQuestions })
    // console.log(update)

// })()

// ************************* To Add Users ****************************

// const csvtojson = require('csvtojson');
// const fs = require('fs');

// // Initialize an empty array to store data from all sheets
// let allData = [];
// const csvFilePath = 'your_file.csv';
// csvtojson()
//   .fromFile(csvFilePath)
//   .then((jsonObj) => {
//     jsonObj.forEach((entry) => {
//     //   entry.name = `${entry['Sur Name']} ${entry['First Name']} ${entry['Last Name']}`;
//       delete entry['Sur Name'];
//       delete entry['First Name'];
//       delete entry['Last Name'];
//     });

//     // Push the modified data to the allData array
//     allData = allData.concat(jsonObj);

//     // Convert the JavaScript object to JSON format
//     const jsonData = JSON.stringify(allData, null, 2);

//     console.log(jsonData);
//     fs.writeFileSync('output.json', jsonData);
//   })
//   .catch((err) => {
//     console.error('Error converting CSV to JSON:', err);
//   });


module.exports = _