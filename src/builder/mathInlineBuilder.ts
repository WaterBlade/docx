import {MathText, MathInline} from "../component";
import { Expression, } from "./math/expression";
import { Formula } from "./math/formula";
import { Relation } from "./math/relation";
import { Variable } from "./math/variable";
import { Composite } from "../component/xml";


export class MathInlineBuilder{
    private mathInline = new MathInline();
    constructor(private composite: Composite){
        this.composite.push(this.mathInline);
    }

    public equation(equation: Relation){
        this.mathInline.push(equation.toInlineDefinition());
    }

    public formula(fml: Formula){
        this.mathInline.push(
            fml.toInlineProcedure()
        );
    }

    public expression(left: Expression){
        this.mathInline.push(left.toVar());
    }

    public variable(left: Variable){
        this.mathInline.push(left.toVar());
    }

    public equationValue(equation: Relation){ 
        this.mathInline.push(
            equation.toInlineProcedure()
        );

    }

    public formulaValue(fml: Formula){
        this.mathInline.push(
            fml.toInlineProcedure()
        );
    }

    public expressionValue(left: Expression){
        this.mathInline.push(
            left.toVar(),
            new MathText('=', {sty:'p'}),
            left.toNum(),
            new MathText('=', {sty: 'p'}),
            left.toResult()
        )
    }

    public variableValue(left: Variable){
        this.mathInline.push(
            left.toVar(),
            new MathText('=', {sty: 'p'}),
            left.toResult()
        )
    }
}