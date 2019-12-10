import { DocXBuilder } from '../src';

const builder = new DocXBuilder();
builder.p().t('hello');
const zip = builder.generateZip();

const fs = require('fs');

zip.generateNodeStream({
    type: 'nodebuffer',
    streamFiles: true,
    compression: "DEFLATE"
}).pipe(fs.createWriteStream('exmple.docx'));

