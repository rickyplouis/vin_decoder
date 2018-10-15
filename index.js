const fs = require('fs');
const csv = require("fast-csv");
const vindec = require('vindec');

const ws = fs.createWriteStream("validated.csv");

const decodedVins = []

const createBlankVin = (vin) => {
  return {
    vin,
    valid: false,
    wmi: '',
    checkDigit: '',
    vis: '',
    region: '',
    make: '',
    year: '',
    sequence_id: ''
  };
}

const cleanVin = (vinObj) => {
  Object.keys(vinObj).forEach(function(key,index) {
    if (typeof vinObj[key] === 'undefined') {
      vinObj[key] = false;
    }
    // key: the name of the object key
    // index: the ordinal position of the key within the object
  });
  return vinObj;
}

csv
  .fromPath('./vin.csv')
  .on("data", function(data){
    const decodedVin = cleanVin(vindec.decode(data[0]));
    if (decodedVin.valid) {
      decodedVins.push(decodedVin);
    } else {
      decodedVins.push(createBlankVin(decodedVin.vin))
    }
  })
  .on("end", function(){
    console.log('decodedVins', decodedVins);
    csv.writeToPath("validated.csv", decodedVins, { headers: true })
   console.log("done");
  });
