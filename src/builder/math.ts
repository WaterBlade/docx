import {MathText, SubSript, Composite, SupSript, Rad, Delimeter, Func, Div as DivComp} from "../component";
import {IXml} from "../IXml";

export const Level1Precedence = 1;
export const Level2Precedence = 2;
export const Level3Precedence = 3
export const TopPrecedence = 10;

export interface IQuantative{
    unit?: Unit,
    format?: (num: number)=>string
}

export const EqualSymbol = new MathText('=', {sty:'p'});
export const AlignEqualSymbol = new MathText('=', {sty:'p', align:true});

export abstract class Expression{
    constructor(protected precedence: number){}

    get Precedence(){
        return this.precedence;
    }

    get Value(){
        return NaN;
    }

    public toResult(option: IQuantative={}): IXml{
        const {unit, format} = option;
        const num = format ? format(this.Value) : this.Value
        if(unit){
            return new Composite(new MathText(num), unit.toVar());
        }
        return new MathText(num);
    }

    public abstract toVar(): IXml;

    public abstract toNum(): IXml;

    public add(right: Expression){
        return new Add(this, right);
    }

    public sub(right: Expression){
        return new Sub(this, right);
    }

    public mul(right: Expression){
        return new Mul(this, right);
    }

    public div(right: Expression){
        return new Div(this, right);
    }

    public flatDiv(right: Expression){
        return new FlatDiv(this, right);
    }

    public pow(index: Expression | number): Expression{
        index = (index instanceof Expression) ?  index : new Num(index)
        return new Pow(this, index)
    }

    public rad(index: Expression | number): Expression{
        index = (index instanceof Expression) ?  index : new Num(index)
        return new Radical(index, this)
    }
}

//
// Variable
// 
export class Var extends Expression {
    public value: number = NaN;
    constructor(protected name: string, protected feature?: {
        sub?: string;
        inform?: string;
        unit?: Expression;
        format?: {
            (num: number): string;
        };
    }) { super(TopPrecedence); }
    get Value() {
        return this.value;
    }
    set Value(val: number){
        this.value = val;
    }
    public toVar() {
        if (this.feature && this.feature.sub) {
            return new SubSript(new MathText(this.name), new MathText(this.feature.sub));
        }
        return new MathText(this.name);
    }
    public toNum() {
        if (!this.value) {
            throw Error(`Variable ${this.name} has not been assigned.`);
        }
        let num: string | number = this.value;
        if (this.feature && this.feature.format) {
            num = this.feature.format(this.value);
        }
        return new MathText(num);
    }
    public toResult() {
        if (this.feature && this.feature.unit) {
            return new Composite(this.toNum(), new MathText(' '), this.feature.unit.toVar());
        }
        else {
            return this.toNum();
        }
    }
}

export class Num extends Var {
    constructor(num: number) {
        super(`${num}`);
        this.value = num;
    }
    public toVar() {
        return this.toNum();
    }
    public toNum() {
        return new MathText(this.name);
    }
}

export class Unit extends Var {
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

//
// Operator
// 
 

export class Operator extends Expression {
    protected numOperator: string;
    constructor(protected left: Expression, protected right: Expression, protected precedence: number, protected operator: string, numOperator?: string) {
        super(precedence);
        if (left.Precedence < this.precedence) {
            this.left = new Parenthesis(this.left);
        }
        if (right.Precedence < this.Precedence) {
            this.right = new Parenthesis(this.right);
        }
        this.numOperator = this.operator;
        if (numOperator) {
            this.numOperator = numOperator;
        }
    }
    public toVar() {
        return new Composite(this.left.toVar(), new MathText(this.operator, { sty: 'p' }), this.right.toVar());
    }
    public toNum() {
        return new Composite(this.left.toNum(), new MathText(this.numOperator, { sty: 'p' }), this.right.toNum());
    }
}

class Neg extends Expression {
    constructor(protected expression: Expression) {
        super(Level1Precedence);
    }
    public toVar() {
        return new Composite(new MathText('-', { sty: 'p' }), this.expression.toVar());
    }
    public toNum() {
        return new Composite(new MathText('-', { sty: 'p' }), this.expression.toNum());
    }
    get Value() {
        return -this.expression.Value;
    }
}

class Add extends Operator {
    constructor(left: Expression, right: Expression) {
        super(left, right, Level1Precedence, '+');
    }
    get Value() {
        return this.left.Value + this.right.Value;
    }
}

class Sub extends Operator {
    constructor(left: Expression, right: Expression) {
        super(left, right, Level1Precedence, '-');
    }
    get Value() {
        return this.left.Value - this.right.Value;
    }
}

class Mul extends Operator {
    constructor(left: Expression, right: Expression) {
        super(left, right, Level2Precedence, '⋅', '×');
    }
    get Value() {
        return this.left.Value * this.right.Value;
    }
}

class Div extends Expression {
    constructor(protected left: Expression, protected right: Expression) {
        super(Level2Precedence);
    }
    public toVar() {
        return new DivComp(this.left.toVar(), this.right.toVar());
    }
    public toNum() {
        return new DivComp(this.left.toNum(), this.right.toNum());
    }
    get Value() {
        return this.left.Value / this.right.Value;
    }
}

class FlatDiv extends Expression {
    constructor(protected left: Expression, protected right: Expression) {
        super(Level2Precedence);
        if (left.Precedence < this.precedence) {
            this.left = new Parenthesis(this.left);
        }
        if (right.Precedence < this.Precedence) {
            this.right = new Parenthesis(this.right);
        }
    }
    public toVar() {
        return new DivComp(this.left.toVar(), this.right.toVar(), 'lin');
    }
    public toNum() {
        return new DivComp(this.left.toNum(), this.right.toNum(), 'lin');
    }
    get Value() {
        return this.left.Value / this.right.Value;
    }
}

class Pow extends Expression {
    constructor(protected expression: Expression, protected index: Expression) {
        super(Level3Precedence);
    }
    public toVar() {
        let base = this.expression.toVar();
        if (base instanceof SubSript) {
            return base.toSubSup(this.index.toVar());
        }
        return new SupSript(base, this.index.toVar());
    }
    public toNum() {
        return new SupSript(this.expression.toNum(), this.index.toNum());
    }
    get Value() {
        return Math.pow(this.expression.Value, this.index.Value);
    }
}

class Radical extends Expression {
    constructor(protected index: Expression, protected expression: Expression) {
        super(Level3Precedence);
    }
    public toVar() {
        let hasIndex = true;
        if (this.index instanceof Num && this.index.value === 2) {
            hasIndex = false;
        }
        return new Rad(this.index.toVar(), this.expression.toVar(), hasIndex);
    }
    public toNum() {
        let hasIndex = true;
        if (this.index instanceof Num && this.index.value === 2) {
            hasIndex = false;
        }
        return new Rad(this.index.toNum(), this.expression.toNum(), hasIndex);
    }
    get Value() {
        return Math.pow(this.expression.Value, 1 / this.index.Value);
    }
}

class Parenthesis extends Expression {
    constructor(protected expression: Expression) { super(TopPrecedence); }
    public toVar() {
        return new Delimeter(this.expression.toVar(), { left: '(', right: ')' });
    }
    public toNum() {
        return new Delimeter(this.expression.toNum(), { left: '(', right: ')' });
    }
    get Value() {
        return this.expression.Value;
    }
}

export function neg(exp: Expression){return new Neg(exp);}

//
// Function
//

class FunctionBase extends Expression {
    protected name: string = '';
    constructor(protected expression: Expression) {
        super(TopPrecedence);
    }
    public toVar() {
        return new Func(this.name, this.expression.toVar());
    }
    public toNum() {
        return new Func(this.name, this.expression.toNum());
    }
}
class Sin extends FunctionBase {
    protected name = 'sin';
    get Value() {
        return Math.sin(this.expression.Value);
    }
}
class Cos extends FunctionBase {
    protected name = 'cos';
    get Value() {
        return Math.cos(this.expression.Value);
    }
}
class Tan extends FunctionBase {
    protected name = 'tan';
    get Value() {
        return Math.tan(this.expression.Value);
    }
}
class Cot extends FunctionBase {
    protected name = 'cot';
    get Value() {
        return 1 / Math.tan(this.expression.Value);
    }
}
class ArcSin extends FunctionBase {
    protected name = 'arcsin';
    get Value() {
        return Math.asin(this.expression.Value);
    }
}
class ArcCos extends FunctionBase {
    protected name = 'arccos';
    get Value() {
        return Math.acos(this.expression.Value);
    }
}
class ArcTan extends FunctionBase {
    protected name = 'arctan';
    get Value() {
        return Math.atan(this.expression.Value);
    }
}
class ArcCot extends FunctionBase {
    protected name = 'arccot';
    get Value() {
        return Math.atan(1 / this.expression.Value);
    }
}
class Log extends FunctionBase {
    protected name = 'log';
    get Value() {
        return Math.log10(this.expression.Value);
    }
}
class Ln extends FunctionBase {
    protected name = 'ln';
    get Value() {
        return Math.log(this.expression.Value);
    }
}

export function sin(exp: Expression){return new Sin(exp);}
export function cos(exp: Expression){return new Cos(exp);}
export function tan(exp: Expression){return new Tan(exp);}
export function cot(exp: Expression){return new Cot(exp);}
export function asin(exp: Expression){return new ArcSin(exp);}
export function acos(exp: Expression){return new ArcCos(exp);}
export function atan(exp: Expression){return new ArcTan(exp);}
export function acot(exp: Expression){return new ArcCot(exp);}
export function log(exp: Expression){return new Log(exp);}
export function ln(exp: Expression){return new Ln(exp);}

//
// Equation
// 

export class Equation {
    constructor(protected left: Expression, protected right: Expression, protected tolerance: number = 0.001) {
    }
    get Value() {
        return false;
    }
    get OriginalSymbol() {
        return new MathText('=', {sty:'p'});
    }
    get ReverseSymbol() {
        return new MathText('=', {sty:'p'});
    }
    get EqualitySymbol() {
        return this.Value ? this.OriginalSymbol : this.ReverseSymbol;
    }
    get Left() {
        return this.left;
    }
    get Right() {
        return this.right;
    }
    public toVar(){
        return new Composite(this.left.toVar(), this.OriginalSymbol, this.right.toVar());
    }
}
class Equal extends Equation {
    get Value() {
        return Math.abs(this.left.Value - this.right.Value) < this.tolerance;
    }
    get OriginalSymbol() {
        return new MathText('=', {sty: 'p'});
    }
    get ReverseSymbol() {
        return new MathText('≠', {sty:'p'});
    }
}
class NotEqual extends Equation {
    get Value() {
        return Math.abs(this.left.Value - this.right.Value) > this.tolerance;
    }
    get ReverseSymbol() {
        return new MathText('=', {sty: 'p'});
    }
    get OriginalSymbol() {
        return new MathText('≠', {sty:'p'});
    }
}
class Greater extends Equation {
    get Value() {
        return this.left > this.right;
    }
    get OriginalSymbol() {
        return new MathText('>', {sty: 'p'});
    }
    get ReverseSymbol() {
        return new MathText('≤', {sty: 'p'});
    }
}
class GreaterOrEqual extends Equation {
    get Value() {
        return this.left >= this.right;
    }
    get OriginalSymbol() {
        return new MathText('≥', {sty: 'p'});
    }
    get ReverseSymbol() {
        return new MathText('<', {sty: 'p'});
    }
}
class Lesser extends Equation {
    get Value() {
        return this.left < this.right;
    }
    get OriginalSymbol() {
        return new MathText('<', {sty: 'p'});
    }
    get ReverseSymbol() {
        return new MathText('≥', {sty: 'p'});
    }
}
class LesserOrEqual extends Equation {
    get Value() {
        return this.left <= this.right;
    }
    get OriginalSymbol() {
        return new MathText('≤', {sty: 'p'});
    }
    get ReverseSymbol() {
        return new MathText('>', {sty: 'p'});
    }
}

export function greater(left: Expression, right: Expression){
    return new Greater(left, right);
}

export function greaterEqual(left: Expression, right: Expression){
    return new GreaterOrEqual(left, right);
}

export function equal(left: Expression, right: Expression){
    return new Equal(left, right);
}

export function notEqual(left: Expression, right: Expression){
    return new NotEqual(left, right);
}

export function less(left: Expression, right:Expression){
    return new Lesser(left, right);
}

export function lessEqual(left: Expression, right: Expression){
    return new LesserOrEqual(left, right);
}