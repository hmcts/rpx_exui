const fs = require('fs');

const testType = process.env.TEST_TYPE;


class StatsReporter {
    constructor(){
        this.analysisOutputFile = `${__dirname}/../../functional-output/tests/run-analysis-${testType}.txt`;
        this.statLogsDir = `${__dirname}/../../functional-output/tests/featureRunLogs-${testType}`;
        this.stats = {
            features :[]
        }

        this.analysis = [];
    }



    updateScenario(featureName, scenarioName, status, result){
        let feature = this.stats.features.find(f => f.name === featureName)
        if (!feature){
            feature = {
                name: featureName,
                scenarios:[]
            }
            this.stats.features.push(feature)
        }

        let scenario = feature.scenarios.find(scr => scr.name === scenarioName)
        if (!scenario) {
            scenario = {
                name: scenarioName,
                status: status,
            }
            feature.scenarios.push(scenario)
        }

        scenario.status = status
        scenario.result = result

    }

    collectLogs(){
        const dir = fs.readdirSync(this.statLogsDir)
        for(const f of dir){
            
            const fileContent = fs.readFileSync(`${this.statLogsDir}/${f}`,'utf-8')

            for (const line of fileContent.split(/\r?\n/)){
                // console.log(`Line from file: ${line}`);
                if (line.includes('************ Test started')){
                    let testName = line.split('|')[2]
                    testName = testName.endsWith('{') ? testName.replace('{', '') : testName;
                    this.updateScenario(f.replace('.txt',''), testName, 'Started','unknown')

                }
                if (line.includes('************ Test status')) {
                    const testName = line.split('|')[3]
                    const result = line.split('|')[2]
                    this.updateScenario(f.replace('.txt', ''), testName, 'Completed', result)

                }
            }

        }
        
    }

    generateStats(){
        const featureStats = [];

        this.stats.features.forEach(f => {
         
            const scrStarted = f.scenarios.filter(scr => scr.result === 'unknown').length
            const scrCompleted = f.scenarios.filter(scr =>  scr.result !== 'unknown').length

            const inProgress = f.scenarios.filter(scr => scr.result === 'unknown')
            const completed = f.scenarios.filter(scr => scr.result !== 'unknown')


            const passed = f.scenarios.filter(scr => scr.result !== 'unknown' && scr.result.toLowerCase().includes('passed')).length
            const failed = f.scenarios.filter(scr => scr.result !== 'unknown' && scr.result.toLowerCase().includes('failed')).length



            featureStats.push({ name: f.name, startedCount: scrStarted, completedCount: scrCompleted, inProgress: inProgress, completed: completed, passed: passed, failed: failed })
           
        })
        this.analysis = {
            features: featureStats
        }
        

    }

    run(){
        if (!fs.existsSync(this.statLogsDir)) {
            return;
        }
        this.collectLogs();
       
        // console.log(JSON.stringify(this.stats, null, 2))
        this.generateStats();
        this.logsStatsToFile(this.analysis);
        // console.log(JSON.stringify(this.analysis, null, 2))
    }

    logsStatsToFile(analysis){
        fs.writeFileSync(this.analysisOutputFile, ``)

        this.reportStats(analysis, (message) => {
            fs.appendFileSync(this.analysisOutputFile, `\n${message}`)
        })
      
    }

    logsStatsToConsole(analysis) {
        this.reportStats(analysis, (message) => {
            console.log(`${message}`)
        })
       


    }

    reportStats(analysis, callback) {
        const stats = [];
        // fs.writeFileSync(this.analysisOutputFile, JSON.stringify(analysis,null,2))
        callback( '**** Run nalaysis *****')

        callback( `${"Inprogress".padEnd(15, ' ')} ${"Done".padEnd(15, ' ')} ${"passed".padEnd(10, ' ')} ${"failed".padEnd(10, ' ')}  Feature `)

        analysis.features.forEach(f => {
            callback( `${f.startedCount.toString().padEnd(15, ' ')} ${f.completedCount.toString().padEnd(15, ' ')} ${f.passed.toString().padEnd(10, ' ')} ${f.failed.toString().padEnd(10, ' ')} ${f.name}`)
            
            const inprogress = f.inProgress.map(scr => scr.name)
            const completed = f.completed.map(scr => scr.name)

            if (inprogress.length > 0){
                for (const scr of inprogress){
                    callback( `     - ${scr}`)
                }
                // fs.appendFileSync(this.analysisOutputFile, `\n${JSON.stringify(completed, null, 2)}`)
            }

        })
        return stats;
    }


}
const instance = new StatsReporter();
module.exports = instance;

