import {DocXBuilder} from '../src';

const builder = new DocXBuilder();
builder.p().t('hello');
builder.saveFile('demo.docx');