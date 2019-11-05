import {Builder} from "./builder";
import {MathInline, Procedure} from "../component";
import { DocX } from "./docX";
import { Var, Expression, AlignEqualSymbol, EqualSymbol, Equation, IQuantative } from "./math";

export class MathProcedureBuilder extends Builder{
    protected procedure = new Procedure();

    constructor(protected docx: DocX){
        super();
        this.docx.content.push(this.procedure);
    }

    public formula(variable: Var, expression: Expression, isLong: boolean=true){
        if(isLong){
            if(variable)
            this.procedure.push(
                new MathInline(
                    variable.toVar(),
                    AlignEqualSymbol,
                    expression.toPrdVar()
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
            this.procedure.push(new MathInline(
                variable.toVar(),
                AlignEqualSymbol,
                expression.toPrdVar(),
                EqualSymbol,
                expression.toNum(),
                EqualSymbol,
                variable.toResult()
            ))
        }

    }

    public equation(equation: Equation, option: IQuantative={}){
        const mathInline = new MathInline();
        this.procedure.push(mathInline);

        const left = equation.Left;
        const right = equation.Right;
        
        mathInline.push(left.toVar(), EqualSymbol)
        if(!(left instanceof Var)){
            mathInline.push(left.toNum(), EqualSymbol);
        }
        mathInline.push(
            left.toResult(option),
            equation.EqualitySymbol,
            right.toVar(),
            EqualSymbol
        );
        if(!(right instanceof Var)){
            mathInline.push(right.toNum(), EqualSymbol);
        }
        mathInline.push(right.toResult(option));

    }
}