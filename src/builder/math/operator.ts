import { MathText, SubSript, SupSript, Rad, Delimeter, Div as DivComp } from "../../component";
import { Composite } from "../../xml";
import { Num, num } from "./variable";
import { Expression, Level1Precedence, Level2Precedence, Level3Precedence, TopPrecedence } from "./expression";
//
// Operator
// 
export abstract class Operator extends Expression {
    protected numOperator: string;
    constructor(protected left: Expression, protected right: Expression, protected precedence: number, protected operator: string, numOperator?: string) {
        super(precedence);
        if (left.Precedence < this.precedence) {
            this.left = new Parenthesis(this.left);
        }
        if (right.Precedence < this.precedence) {
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
    get Value(){
        return  - this.expression.Value;
    }
    public toVar() {
        return new Composite(new MathText('-', { sty: 'p' }), this.expression.toVar());
    }
    public toNum() {
        return new Composite(new MathText('-', { sty: 'p' }), this.expression.toNum());
    }
}
class Add extends Operator {
    constructor(left: Expression, right: Expression) {
        super(left, right, Level1Precedence, '+');
    }
    get Value(){
        return this.left.Value + this.right.Value;
    }
}
class Sub extends Operator {
    constructor(left: Expression, right: Expression) {
        super(left, right, Level1Precedence, '-');
    }
    get Value(){
        return this.left.Value - this.right.Value;
    }
}
class Mul extends Operator {
    constructor(left: Expression, right: Expression) {
        super(left, right, Level2Precedence, '⋅', '×');
    }
    get Value(){
        return this.left.Value * this.right.Value;
    }
}
class Div extends Expression {
    constructor(protected left: Expression, protected right: Expression) {
        super(Level2Precedence);
    }
    get Value(){
        return this.left.Value / this.right.Value;
    }
    public toVar() {
        return new DivComp(this.left.toVar(), this.right.toVar());
    }
    public toNum() {
        return new DivComp(this.left.toNum(), this.right.toNum());
    }
}
class FlatDiv extends Expression {
    constructor(protected left: Expression, protected right: Expression) {
        super(Level2Precedence);
        if (left.Precedence < this.precedence) {
            this.left = new Parenthesis(this.left);
        }
        if (right.Precedence < this.precedence) {
            this.right = new Parenthesis(this.right);
        }
    }
    get Value(){
        return this.left.Value / this.right.Value;
    }
    public toVar() {
        return new DivComp(this.left.toVar(), this.right.toVar(), 'lin');
    }
    public toNum() {
        return new DivComp(this.left.toNum(), this.right.toNum(), 'lin');
    }
}
class Pow extends Expression {
    constructor(protected expression: Expression, protected index: Expression) {
        super(Level3Precedence);
    }
    get Value(){
        return Math.pow(this.expression.Value, this.index.Value);
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
}
class Radical extends Expression {
    constructor(protected expression: Expression, protected index: Expression) {
        super(Level3Precedence);
    }
    get Value(){
        return Math.pow(this.expression.Value, 1 / this.index.Value);
    }
    public toVar() {
        let hasIndex = true;
        if (this.index instanceof Num && this.index.Value === 2) {
            hasIndex = false;
        }
        return new Rad(this.index.toVar(), this.expression.toVar(), hasIndex);
    }
    public toNum() {
        let hasIndex = true;
        if (this.index instanceof Num && this.index.number === 2) {
            hasIndex = false;
        }
        return new Rad(this.index.toNum(), this.expression.toNum(), hasIndex);
    }
}
class Abs extends Expression{
    constructor(protected expression: Expression){super(TopPrecedence)}
    get Value(){
        return Math.abs(this.expression.Value);
    }
    public toVar(){
        return new Delimeter(this.expression.toVar(), {left: '|', right: '|'});
    }
    public toNum(){
        return new Delimeter(this.expression.toNum(), {left: '|', right: '|'});
    }
}
class Parenthesis extends Expression {
    constructor(protected expression: Expression) { super(TopPrecedence); }
    get Value(){
        return this.expression.Value;
    }
    public toVar() {
        return new Delimeter(this.expression.toVar(), { left: '(', right: ')' });
    }
    public toNum() {
        return new Delimeter(this.expression.toNum(), { left: '(', right: ')' });
    }
}
class Minus extends Expression{
    constructor(public expression: Expression){super(TopPrecedence);}
    get Value(){
        return -this.expression.Value;
    }
    public toVar(){
        return new Neg(this.expression).toVar();
    }
    public toNum(){
        return new Neg(this.expression).toNum();
    }
}
class Inverse extends Expression{
    constructor(public expression: Expression){super(TopPrecedence);}
    get Value(){
        return 1 / this.expression.Value;
    }
    public toVar(){
        return new Div(new Num(1), this.expression).toVar();
    }
    public toNum(){
        return new Div(new Num(1), this.expression).toNum();
    }
}
function wrapperNum(item: Expression | number){
    return item instanceof Expression ? item : num(item);
}
export function neg(exp: Expression) { return new Neg(exp); }
export function add(...exps: Array<Expression|number>) {
    let left = wrapperNum(exps[0]);
    for (let i = 1; i < exps.length; i++) {
        const right = wrapperNum(exps[i]);
        if(right instanceof Minus){
            left = new Sub(left, right.expression);
        }else{
            left = new Add(left, right);
        }
    }
    return left;
}
export function sub(...exps: Array<Expression|number>){
    let left = wrapperNum(exps[0]);
    for(let i = 1; i < exps.length; i++){
        left = new Sub(left, wrapperNum(exps[i]));
    }
    return left;
}
export function mul(...exps: Array<Expression|number>) {
    let left = wrapperNum(exps[0]);
    for (let i = 1; i < exps.length; i++) {
        const right = wrapperNum(exps[i]);
        if(right instanceof Inverse){
            left = new Div(left, right.expression);
        }else{
            left =new Mul(left, right);
        }
    }
    return left;
}
export function div(...exps: Array<Expression|number>){
    let left = wrapperNum(exps[0]) 
    for(let i = 1; i<exps.length; i++){
        left = new Div(left, wrapperNum(exps[i]));
    }
    return left;
}
export function abs(exp: Expression){
    return new Abs(exp);
}
export function minus(exp: Expression | number){
    return new Minus(wrapperNum(exp));
}
export function inv(exp: Expression | number){
    return new Inverse(wrapperNum(exp));
}
export function fdiv(left: Expression | number, right: Expression | number){
    return new FlatDiv(wrapperNum(left), wrapperNum(right));
}
export function pow(base: Expression | number, index: number | Expression){
    return new Pow(wrapperNum(base), wrapperNum(index))
}
export function root(base: Expression | number, index: number | Expression){
    return new Radical(wrapperNum(base), wrapperNum(index));
}