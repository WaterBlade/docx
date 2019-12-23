import { Expression, TopPrecedence } from "./expression";
import { Variable } from "./variable";
import { NArray, MathText } from "../../component";
import { Composite } from "../../component/xml";

class Integrate extends Expression{
    constructor(public exp: Expression, public variable: Variable, public sub?: Expression, public sup?:Expression){
        super(TopPrecedence);
    }

    get Value(){
        return NaN;
    }
    toVar(){
        const nary = new NArray(new Composite(this.exp.toVar(), new MathText('d'), this.variable.toVar()));
        if(this.sub) nary.sub(this.sub.toVar());
        if(this.sup) nary.sup(this.sup.toVar());
        return nary;
    }
    toNum(){
        return this.toVar();
    }
}

export function integrate(exp: Expression, variable: Variable, sub?: Expression, sup?: Expression){
    return new Integrate(exp, variable, sub, sup);
}