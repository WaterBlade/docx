import { Expression, TopPrecedence } from "./expression";


abstract class Conversion extends Expression{
    constructor(protected expression: Expression){
        super(TopPrecedence);
    }
    abstract get Value();
    toVar(){
        return this.expression.toVar();
    }
    toNum(){
        return this.expression.toNum();
    }
}

class ToRadian extends Conversion{
    get Value(){
        return Math.PI * this.expression.Value / 180;
    }
}
class ToDegree extends Conversion{
    get Value(){
        return 180 * this.expression.Value / Math.PI;
    }
}

export function toRadian(exp: Expression){return new ToRadian(exp);}
export function toDegree(exp: Expression){return new ToDegree(exp);}