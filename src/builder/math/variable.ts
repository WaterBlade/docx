import { MathText, SubSript, Div as DivComp } from "../../component";
import { Declaration } from "../../component/composite/declaration";
import { XmlObject, Composite } from "../../xml";
import { Expression, TopPrecedence } from "./expression";
import { DeclarationContent } from "./content";
//
// Variable
// 
export class Variable extends Expression {
    protected value: number = NaN;
    protected subscript: string = '';
    protected inform?: string;
    protected precision: number = 3;
    protected unit_?: Expression;
    constructor(protected name: string) { super(TopPrecedence); }
    set Value(value: number) {
        this.value = value;
    }
    get Value(){
        return this.value;
    }
    public val(value: number){
        this.Value = value;
        return this;
    }
    public subs(subscript: string | number | undefined) {
        if (subscript !== undefined) {
            this.subscript = `${subscript}`;
        }
        return this;
    }
    public info(inform: string) {
        this.inform = inform;
        return this;
    }
    public prec(precision: number) {
        this.precision = precision;
        return this;
    }
    public unit(unit: Expression) {
        this.unit_ = unit;
        return this;
    }
    public toDeclaration() {
        if (this.unit_) {
            return new Declaration(this.toVar(), this.inform, this.unit_.toVar());
        }
        return new Declaration(this.toVar(), this.inform);
    }
    public toDclCnt(){
        return new DeclarationContent(this.toDeclaration());
    }
    public toVar(): XmlObject {
        if (this.subscript !== '') {
            return new SubSript(new MathText(this.name), new MathText(this.subscript));
        }
        return new MathText(this.name);
    }
    public toNum(): XmlObject {
        if (!this.value) {
            throw Error(`Variable ${this.name} has not been assigned.`);
        }
        if (Math.abs(this.value) < 1e-9) {
            return new MathText(0);
        }
        if (Math.abs(this.value) > 10000 || Math.abs(this.value) < 0.0001 && this.value !== 0) {
            const sup = Math.floor(Math.log10(Math.abs(this.value)));
            const base = this.value / Math.pow(10, sup);
            return new Composite(new MathText(Number(base).toFixed(this.precision)), new MathText('×', { sty: 'p' }), new SubSript(new MathText(10), new MathText(sup)));
        }
        return new MathText(Number(this.value).toFixed(this.precision));
    }
    public toResult() {
        if (this.unit_) {
            return new Composite(this.toNum(), new MathText(' '), this.unit_.toVar());
        }
        else {
            return this.toNum();
        }
    }
}
export class FractionVariable extends Variable {
    protected den_ = 1;
    public den(val: number){
        this.Den = val;
        return this;
    }
    set Den(val: number) {
        this.den_ = val;
        this.value = 1 / val;
    }
    get Den(){
        return this.den_;
    }
    set Value(val: number) {
        this.value = val;
        this.den_ = 1 / val;
    }
    get Value(){
        return this.value;
    }
    public toNum() {
        if (!this.value) {
            throw Error(`Variable ${this.name} has not been assigned.`);
        }
        return new DivComp(new MathText(1), new MathText(this.den_));
    }
}
export class Num extends Variable {
    constructor(num: number) {
        super(`${num}`);
        this.value = num;
    }
    get number() {
        return this.value;
    }
    public toVar() {
        return this.toNum();
    }
    public toNum() {
        return new MathText(this.name);
    }
}
export class Unit extends Variable {
    constructor(name: string) {
        super(name);
    }
    public toVar() {
        return new MathText(this.name, { sty: 'p' });
    }
    public toNum() {
        return this.toVar();
    }
}
export function V(name: string) { return new Variable(name); }
export function FV(name: string) { return new FractionVariable(name); }
export function num(n: number): Num { return new Num(n); }
export function unit(name: string): Unit { return new Unit(name); }
