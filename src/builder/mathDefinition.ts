import {Builder} from "./builder";
import { DocX } from "./docX";
import { Expression, AlignEqualSymbol, Var, Equation, IQuantative} from "./math";
import { MathPara, MathInline, MathText, EqArr, Composite} from "../component";

export class MathDefinitionBuilder extends Builder{
    protected mathPara = new MathPara();

    constructor(protected docx: DocX){
        super();
        this.docx.content.child(this.mathPara);
    }

    public formula(variable: Var, expression: Expression){
        this.mathPara.child(
            new MathInline(
                variable.toVar(),
                AlignEqualSymbol,
                expression.toVar()
            )
        )
    }

    public conditionFormula(variable: Var, expressions: Expression[], conditions: Equation[]){
        const array = new EqArr({left:true});
        for(let i = 0; i < expressions.length; i++){
            const exp = expressions[i];
            const cond = conditions[i];
            array.child(new Composite(exp.toVar(), new MathText(' , '), cond.toVar()));
        }
        this.mathPara.child(
            new MathInline(
                variable.toVar(),
                AlignEqualSymbol,
                array
            )
        )
    }

    public equation(equation: Equation){
        this.mathPara.child(
            new MathInline(
                equation.Left.toVar(),
                equation.OriginalSymbol.setAlign(),
                equation.Right.toVar()
            )
        )

    }


}