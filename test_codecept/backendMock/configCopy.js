const fs = require('fs')
const path = require('path')

const files = fs.readdirSync(path.resolve(__dirname, '../../config'))
// console.log(files)

const mockConfig = files.find(file => file === 'local-mock.json')

if (mockConfig === undefined){
    fs.copyFileSync(path.resolve(__dirname, 'local-mock.json'), path.resolve(__dirname, '../../config/local-mock.json') )
}