const browser = require('./browser')
const fs = require('fs')
// const I = getActor();

class CodeceptMochawesomeLog{

    constructor(){
        this.featureLogFilePath = null;
    }

    getDate(){
        const d = new Date();
        const hh = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
        const mm = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        const ss = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();

        return `[${hh}:${mm }:${ss}]`
    }

    FormatPrintJson(jsonObj,basePad){
        basePad = basePad ? basePad : 0;
        const keys = Object.keys(jsonObj);

        let maxSize = 0;
        for(let key of keys){
            maxSize = key.length > maxSize ? key.length : maxSize;
        }

        let startPadding = basePad + maxSize + 1;
        for (let key of keys) {
            try {
                browser.get_I().addMochawesomeContext(`${key.padEnd(startPadding)} : ${jsonObj[key]}`);
            }
            catch (err) {
                console.log("Error occured adding message to report. " + err.stack);
            }
            console.log(`${key.padEnd(startPadding)} : ${jsonObj[key]}`)
        }

    }

    LogTestDataInput(message){
        try{
            browser.get_I().addMochawesomeContext(`>>>>>>> [ Test data input ]: ${message}`);
            // fs.appendFileSync(this.featureLogFilePath, '\n'+message)


        } catch (err) {
            console.log("Error occured adding message to report. " + err.stack);
        }
        console.log(message)
    }

    AddMessage(message, logLevel){
        // if (!this._isLevelEnabled(logLevel)) return;

        try{
            // browser.get_I().addMochawesomeContext(this.getDate() + message);
            message = "=> " + message
            var buf = message.toString("binary")
            browser.get_I().say( buf)
            // fs.appendFileSync(this.featureLogFilePath, '\n' + message)
        }
        catch(err){
            console.log("Error occured adding message to report. "+err.message+' \n '+err.stack);
            // fs.appendFileSync(this.featureLogFilePath, '\n' + err.message + ' \n ' + err.stack)

        }
        console.log( message)
    }

    AddMessageToReportOnly(message, logLevel) {
        // if (!this._isLevelEnabled(logLevel)) return;
        try{
            // browser.get_I().addMochawesomeContext(this.getDate() + message);
            browser.get_I().say( message)

        } catch (err) {
            console.log("Error occured adding message to report. " + err.stack);
        }
        console.log(message)
        // browser.get_I().say(this.getDate() + message)

    }

    AddJson(json, logLevel){
        // if (!this._isLevelEnabled(logLevel)) return;

        try {
            // browser.get_I().addMochawesomeContext(JSON.stringify(json, null, 2));
            browser.get_I().say(JSON.stringify(json, null, 2))

        }
        catch(err) {
             console.log("Error occured adding message to report. " + err.stack);
        }
        console.log(JSON.stringify(json, null, 2));
    }

    AddJsonToReportOnly(json, logLevel) {
        // if (!this._isLevelEnabled(logLevel)) return;
        try{
            I.addMochawesomeContext(JSON.stringify(json, null, 2));
                
        } catch (err) {
            console.log("Error occured adding message to report. " + err.stack);
        }
        console.log(JSON.stringify(json, null, 2));

    }

    async AddScreenshot(onbrowser, logLevel){
        // if (!this._isLevelEnabled(logLevel)) return;

        // const decodedImage = await this.getScreenshot(onbrowser);
        // await browser.get_I().addMochawesomeContext(decodedImage, 'image/png');
        // I.saveScreenshot('debug.png', true)
        this.AddMessage(`!!! Add screenshot not implemented !!!`)

        
    }

    async getScreenshot(onbrowser){
        const scrrenshotBrowser = onbrowser ? onbrowser : browser;
        const stream = await scrrenshotBrowser.takeScreenshot();
        const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        return decodedImage; 
    }


    reportDatatable(datatable){

        const rows =  datatable.parse().raw();
        const topRow = rows[0]
        const rowsCount = rows.length;
        const columnsCount = topRow.length;
        
        const columnSizes = [];

        for (let i = 0; i < columnsCount; i++){
            const columnValues = rows.map(row => row[i])
            
            let columnSize = columnValues.sort((a,b) => a.length < b.length ? 1:-1)[0].length
            columnSize = columnSize + 3;
            columnSizes[i] = columnSize;

        }

        let totalTableLength  = 0;

        
        columnSizes.forEach(colLength => totalTableLength += colLength )
        this.AddMessage('=== BDD)    ' + ''.padEnd(totalTableLength+1,'-') )
        for (let row = 0; row < rowsCount; row++){
            let tableRow = ""
            for (let col = 0; col < columnsCount ; col++){
                tableRow += rows[row][col].padEnd(columnSizes[col], ' ')
            }
            this.AddMessage('=== BDD)    |'+tableRow+'|')
           
        }
        this.AddMessage('=== BDD)    ' + ''.padEnd(totalTableLength+1, '-'))

    }

    // _isLevelEnabled(msgLoglevel)`=== BDD)
    //     msgLoglevel = msgLoglevel !== undefined ? msgLoglevel : LOG_LEVELS.Info;  
    //     return msgLoglevel >= this.logLevel; 
    // }

}



module.exports = new CodeceptMochawesomeLog();