
const jsonpath = require('jsonpath')
const reportLogger = require('../../codeceptCommon/reportLogger')
const fs = require('fs')
class JSONUtil{


getJsonFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath,'utf-8');
  const fileContentJson = JSON.parse(fileContent)
  reportLogger.AddJson(fileContentJson)
  return fileContentJson
}


  updateJsonWithJsonPath(updatePaths, updateJson){
    for (const row of updatePaths) {
      const actualVal = jsonpath.query(updateJson, row.jsonpath);

      let val = row.value;

      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.replace('[', '').replace(']', '')
        val = val !== "" ? val.split(','): []
      } else if (val.includes('true') || val.includes('false')){
        val = val.includes('true');
      }
      const updatedValue = jsonpath.value(updateJson, row.jsonpath, val);

      reportLogger.AddMessage(`Updated ${row.jsonpath} =>${actualVal} to  ${updatedValue}`);
    }

  }

}

module.exports = new JSONUtil()
