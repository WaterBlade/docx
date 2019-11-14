import {Xml} from '../component/xml';

const {
    describe,
    it,
} = require('mocha');

const {
    expect
} = require('chai');

describe('simple xml', ()=>{
    const xml = new Xml('w:run');
    it('should return <w:run/>', ()=>{
        expect(xml.toString()).to.equal('<w:run/>');
    });
    it('should return <w:run w:i="true"/>', ()=>{
        xml.attr('w:i', true);
        expect(xml.toString()).to.equal('<w:run w:i="true"/>');
    });
    it('should return <w:run w:i=true>Hello World</w:run>', ()=>{
        xml.text('Hello world');
        expect(xml.toString()).to.equal('<w:run w:i="true">Hello world</w:run>');
    });
    it('test change attribute', ()=>{
        xml.attr('w:i', false);
        expect(xml.toString()).to.equal('<w:run w:i="false">Hello world</w:run>');
    });
    it('test number text', ()=>{
        xml.text(1);
        expect(xml.toString()).to.equal('<w:run w:i="false">1</w:run>');
    })
});

describe('nested xml', ()=>{
    const xml = new Xml('a');
    it('should return <a><b/></a>', ()=>{
        xml.push(new Xml('b'));
        expect(xml.toString()).to.equal('<a><b/></a>');
    });
    it('should return <a><b/><c>Hello</c></a>', ()=>{
        xml.push(new Xml('c').text('Hello'));
        expect(xml.toString()).to.equal('<a><b/><c>Hello</c></a>');
    });
});

describe('escape character xml', ()=>{
    const xml = new Xml('a');
    it('should return <a>&lt;</a>', ()=>{
        xml.text('<');
        expect(xml.toString()).to.equal('<a>&lt;</a>');
    });
});
