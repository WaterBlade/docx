import { Func } from "../../component";
import { Expression, TopPrecedence } from "./expression";
//
// Function
//
abstract class FunctionBase extends Expression {
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
    get Value(){
        return Math.sin(this.expression.Value);
    }
}
class Cos extends FunctionBase {
    protected name = 'cos';
    get Value(){
        return Math.cos(this.expression.Value);
    }
}
class Tan extends FunctionBase {
    protected name = 'tan';
    get Value(){
        return Math.tan(this.expression.Value);
    }
}
class Cot extends FunctionBase {
    protected name = 'cot';
    get Value(){
        return 1 / Math.tan(this.expression.Value);
    }
}
class ArcSin extends FunctionBase {
    protected name = 'arcsin';
    get Value(){
        return Math.asin(this.expression.Value);
    }
}
class ArcCos extends FunctionBase {
    protected name = 'arccos';
    get Value(){
        return Math.acos(this.expression.Value);
    }
}
class ArcTan extends FunctionBase {
    protected name = 'arctan';
    get Value(){
        return Math.atan(this.expression.Value);
    }
}
class ArcCot extends FunctionBase {
    protected name = 'arccot';
    get Value(){
        return Math.PI / 2 - Math.atan(this.expression.Value);
    }
}
class Log extends FunctionBase {
    protected name = 'log';
    get Value(){
        return Math.log10(this.expression.Value);
    }
}
class Ln extends FunctionBase {
    protected name = 'ln';
    get Value(){
        return Math.log(this.expression.Value);
    }
}
export function sin(exp: Expression) { return new Sin(exp); }
export function cos(exp: Expression) { return new Cos(exp); }
export function tan(exp: Expression) { return new Tan(exp); }
export function cot(exp: Expression) { return new Cot(exp); }
export function asin(exp: Expression) { return new ArcSin(exp); }
export function acos(exp: Expression) { return new ArcCos(exp); }
export function atan(exp: Expression) { return new ArcTan(exp); }
export function acot(exp: Expression) { return new ArcCot(exp); }
export function log(exp: Expression) { return new Log(exp); }
export function ln(exp: Expression) { return new Ln(exp); }
