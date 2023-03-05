const getClicksSet = (clicksObj) => {
  let finalResultSet = [];
  let counterObject = {};
  let outputResult = [];
  let resultSetObj = {};
  let prevTimePeriod = -1;
  let prevDatePeriod = -1;

  // iterating over each occurrence of the clicks object
  if (clicksObj && clicksObj.length) {
    clicksObj.map((data) => {
      const timestamp = getTimeStamp(data); // this returns hours and date from the given timestamp
      const time_period = timestamp.periodInHours; // to get the selected item's hours
      const current_datePeriod = timestamp.datePeriod; // to get the selected item's date

      if (prevDatePeriod !== -1 && prevDatePeriod !== current_datePeriod) {
        //check for different dates
        finalResultSet = [...finalResultSet, ...Object.values(resultSetObj)];
        finalResultSet = removeIP(finalResultSet, counterObject);
        outputResult = [...outputResult, ...finalResultSet]; // concat the final result into one array
        finalResultSet = [];
        counterObject = {};
        resultSetObj = {};
        prevTimePeriod = -1;
        prevDatePeriod = -1;
        resultSetObj = getResultObj(resultSetObj, counterObject, data);
      } else {
        if (prevTimePeriod === -1 || time_period === prevTimePeriod) {
          resultSetObj = getResultObj(resultSetObj, counterObject, data);
        } else {
          finalResultSet = [...finalResultSet, ...Object.values(resultSetObj)];
          resultSetObj = {};
          resultSetObj = getResultObj(resultSetObj, counterObject, data);
        }
        prevTimePeriod = time_period;
      }
      prevDatePeriod = current_datePeriod;
    });
  } else {
    return { status: 422, message: "Invalid Arguments" };
  }

  finalResultSet = [...finalResultSet, ...Object.values(resultSetObj)];
  finalResultSet = removeIP(finalResultSet, counterObject);
  outputResult = [...outputResult, ...finalResultSet];
  return { status: 200, data: outputResult }; // the final subset of given input set
};

// function for removing those IPs whose count is greater than 10
removeIP = (finalResultSet, counterObject) => {
  const updatedResult = [];
  for (var i = 0; i < finalResultSet.length; i++) {
    const IP = finalResultSet[i].ip;
    const count = counterObject[IP];
    if (count <= 10) {
      updatedResult.push(finalResultSet[i]);
    }
  }
  return updatedResult;
};

const getResultObj = (resultSetObj, counterObject, data) => {
  const ipExists = counterObject.hasOwnProperty(data.ip);
  if (ipExists) {
    const count = ++counterObject[data.ip];
    counterObject[data.ip] = count;
  } else {
    counterObject[data.ip] = 1;
  }
  if (!resultSetObj.hasOwnProperty(data.ip)) {
    resultSetObj[data.ip] = data;
  } else {
    if (resultSetObj[data.ip].amount < data.amount) {
      resultSetObj[data.ip] = data;
    } else if (resultSetObj[data.ip].amount === data.amount) {
      //checking if the amount is same then the click with earlier timestamp should be recorded.
      if (
        new Date(data.timestamp) < new Date(resultSetObj[data.ip].timestamp)
      ) {
        resultSetObj[data.ip] = data;
      }
    }
  }
  return resultSetObj;
};

// function for returning the hours and time period
const getTimeStamp = (data) => {
  const datePeriod = new Date(data.timestamp).toLocaleDateString();
  const periodInHours = new Date(data.timestamp).getHours();
  return { periodInHours, datePeriod };
};

module.exports = {
  getClicksSet,
};
