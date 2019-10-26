const fs = require('fs');
const JSZip = require('jszip');

const zip = new JSZip();

zip.file('你好.txt', '你好');

zip.generateNodeStream({type:'nodebuffer', streamFiles: true})
.pipe(fs.createWriteStream('out.zip'))
.on('finish', function(){
    console.log('out.zip. written')
})