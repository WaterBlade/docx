import { Func, MathText} from "../../component";
import { Expression, TopPrecedence } from "./expression";
import { wrapperNum } from "./variable";
import { Composite } from "../../component/xml";
//
// Function
//
abstract class FunctionBase extends Expression {
    protected name: string = '';
    protected exps: Expression[];
    constructor(...expressions: Expression[]) {
        super(TopPrecedence);
        this.exps = expressions;
    }
    public toVar() {
        if (this.exps.length > 1) {
            const comp = new Composite(this.exps[0].toVar());
            for(let i = 1; i < this.exps.length; i++){
                comp.push(new MathText(','), this.exps[i].toVar())
            }
            return new Func(this.name, comp);

        } else {
            return new Func(this.name, this.exps[0].toVar());
        }
    }
    public toNum() {
        if (this.exps.length > 1) {
            const comp = new Composite(this.exps[0].toNum());
            for(let i = 1; i < this.exps.length; i++){
                comp.push(new MathText(','), this.exps[i].toNum())
            }
            return new Func(this.name, comp);

        } else {
            return new Func(this.name, this.exps[0].toNum());
        }
    }
}
class Sin extends FunctionBase {
    protected name = 'sin';
    get Value() {
        return Math.sin(this.exps[0].Value);
    }
}
class Cos extends FunctionBase {
    protected name = 'cos';
    get Value() {
        return Math.cos(this.exps[0].Value);
    }
}
class Tan extends FunctionBase {
    protected name = 'tan';
    get Value() {
        return Math.tan(this.exps[0].Value);
    }
}
class Cot extends FunctionBase {
    protected name = 'cot';
    get Value() {
        return 1 / Math.tan(this.exps[0].Value);
    }
}
class ArcSin extends FunctionBase {
    protected name = 'arcsin';
    get Value() {
        return Math.asin(this.exps[0].Value);
    }
}
class ArcCos extends FunctionBase {
    protected name = 'arccos';
    get Value() {
        return Math.acos(this.exps[0].Value);
    }
}
class ArcTan extends FunctionBase {
    protected name = 'arctan';
    get Value() {
        return Math.atan(this.exps[0].Value);
    }
}
class ArcCot extends FunctionBase {
    protected name = 'arccot';
    get Value() {
        return Math.PI / 2 - Math.atan(this.exps[0].Value);
    }
}
class Log extends FunctionBase {
    protected name = 'log';
    get Value() {
        return Math.log10(this.exps[0].Value);
    }
}
class Ln extends FunctionBase {
    protected name = 'ln';
    get Value() {
        return Math.log(this.exps[0].Value);
    }
}
class Max extends FunctionBase{
    protected name = 'max';
    get Value(){
        return Math.max(...this.exps.map(e=>e.Value));
    }
}
class Min extends FunctionBase{
    protected name = 'min';
    get Value(){
        return Math.min(...this.exps.map(e=>e.Value));
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
export function max(...exps: Array<Expression | number>) { return new Max(...exps.map(e=>wrapperNum(e)));}
export function min(...exps: Array<Expression | number>) { return new Min(...exps.map(e=>wrapperNum(e)));}