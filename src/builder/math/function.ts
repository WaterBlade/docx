import { Func } from "../../component";
import { Expression, TopPrecedence } from "./expression";
import { wrapperNum } from "./variable";
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
export function sin(exp: Expression | number) { return new Sin(wrapperNum(exp)); }
export function cos(exp: Expression | number) { return new Cos(wrapperNum(exp)); }
export function tan(exp: Expression | number) { return new Tan(wrapperNum(exp)); }
export function cot(exp: Expression | number) { return new Cot(wrapperNum(exp)); }
export function asin(exp: Expression | number) { return new ArcSin(wrapperNum(exp)); }
export function acos(exp: Expression | number) { return new ArcCos(wrapperNum(exp)); }
export function atan(exp: Expression | number) { return new ArcTan(wrapperNum(exp)); }
export function acot(exp: Expression | number) { return new ArcCot(wrapperNum(exp)); }
export function log(exp: Expression | number) { return new Log(wrapperNum(exp)); }
export function ln(exp: Expression | number) { return new Ln(wrapperNum(exp)); }
