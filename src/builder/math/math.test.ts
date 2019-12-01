import { V, add, sub, mul, div, root } from ".";
import { sin, cos, ln } from "./function";

const {
    describe,
    it,
} = require('mocha');

const {
    expect
} = require('chai');

describe('simple operator', ()=>{
    const a = V('a').val(10);
    const b = V('b').val(4);
    it('add', ()=>{
        expect(add(a, b).Value).to.equal(14);
    })
    it('sub', ()=>{
        expect(sub(a, b).Value).to.equal(6);
    })
    it('mul', ()=>{
        expect(mul(a, b).Value).to.equal(40);
    })
    it('div', ()=>{
        expect(div(10, 4).Value).to.equal(2.5);
    })
    it('root', ()=>{
        expect(root(b, 2).Value).to.closeTo(2, 0.1);
    })
    it('sin', ()=>{
        expect(sin(Math.PI / 2).Value).to.closeTo(1, 0.1);
    })
    it('cos', ()=>{
        expect(cos(Math.PI / 2).Value).to.closeTo(0, 0.1);
    })
    it('ln', ()=>{
        expect(ln(1).Value).to.closeTo(0, 0.1);
    })
})