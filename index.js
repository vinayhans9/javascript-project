const {getClicksSet} = require("./service.js");
const { saveToJSON } = require("./saveToFile.js");
const clicksData = require("./clicks.json");

// for computing clicks result
const result = getClicksSet(clicksData);

// Save the final computed clicks result into a new file
if(result.status === 422){
  console.log(result.message);
}
else{
  saveToJSON(result.data);
}
