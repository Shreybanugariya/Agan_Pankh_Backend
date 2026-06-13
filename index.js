require('dotenv').config()
require('./globals')
const { mongodb } = require('./utils')

require('./app/app')
mongodb.initialize();

// (() => {
//     const csvtojson = require('csvtojson');
//     const fs = require('fs');

//     // Initialize an empty array to store data from all sheets
//     let allData = [];
//     const csvFilePath = 'sheet.csv';
//     csvtojson()
//     .fromFile(csvFilePath)
//     .then((jsonObj) => {
//         jsonObj.forEach((entry) => {
//         entry.username = `${entry['username']}`;
//         entry.contactNo = `${entry['contactNo']}`;
//         entry.email = `${entry['email']}`;
//         entry.city = `Patan`;
//         delete entry.NO
//         entry.hasPreminum = true;
//         });

//         allData = allData.concat(jsonObj);

//         // Convert the JavaScript object to JSON format
//         const jsonData = JSON.stringify(allData, null, 2);

//         console.log(jsonData);
//         fs.writeFileSync('students.json', jsonData);
//     })
//     .catch((err) => {
//         console.error('Error converting CSV to JSON:', err);
//     });
// })()