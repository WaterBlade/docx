
import {describe, it} from "mocha";

import {expect} from "chai";

import { variable } from "../builder";
import { fractionVariable } from "../builder";


describe('simple calc', ()=>{
    it('sub and mul', ()=>{
        const a = variable('a');
        const b = variable('b');
        const c = variable('c');

        a.Value = 1;
        b.Value = 2;
        c.Value = 3;

        expect(a.mul(c.sub(b)).Value).to.equal(1);

    });
    describe('fraction variable', ()=>{
        const a = fractionVariable('a');
        a.Den = 2;

        it('test value', ()=>{
            expect(a.Value).to.closeTo(0.5, 0.01);
        });

        it('test den', ()=>{
            expect(a.Den).to.equal(2);
        })

        it('test value to den', ()=>{
            a.Value = 0.5;
            expect(a.Den).to.equal(2);
        })
        
    })
})