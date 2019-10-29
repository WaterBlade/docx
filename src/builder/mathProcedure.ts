import {Builder} from "./builder";
import {MathInline, MathPara} from "../component";
import { DocX } from "./docX";
import { Var, Expression, AlignEqualSymbol, EqualSymbol, Equation, IQuantative } from "./math";

export class MathProcedureBuilder extends Builder{
    protected mathPara = new MathPara();

    constructor(protected docx: DocX){
        super();
        this.docx.content.child(this.mathPara);
    }

    public formula(variable: Var, expression: Expression, isLong: boolean=true){
        if(isLong){
            if(variable)
            this.mathPara.child(
                new MathInline(
                    variable.toVar(),
                    AlignEqualSymbol,
                    expression.toVar()
                ),
                new MathInline(
                    AlignEqualSymbol,
                    expression.toNum()
                ),
                new MathInline(
                    AlignEqualSymbol,
                    variable.toResult()
                )
            )
        } else {
            this.mathPara.child(new MathInline(
                variable.toVar(),
                AlignEqualSymbol,
                expression.toVar(),
                EqualSymbol,
                expression.toNum(),
                EqualSymbol,
                variable.toResult()
            ))
        }

    }

    public equation(equation: Equation, option: IQuantative={}){
        const mathInline = new MathInline();
        this.mathPara.child(mathInline);

        const left = equation.Left;
        const right = equation.Right;
        
        mathInline.child(left.toVar(), EqualSymbol)
        if(!(left instanceof Var)){
            mathInline.child(left.toNum(), EqualSymbol);
        }
        mathInline.child(
            left.toResult(option),
            equation.EqualitySymbol,
            right.toVar(),
            EqualSymbol
        );
        if(!(right instanceof Var)){
            mathInline.child(right.toNum(), EqualSymbol);
        }
        mathInline.child(right.toResult(option));

    }
}