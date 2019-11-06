import {Builder} from "./builder";
import {MathInline, Procedure} from "../component";
import { DocX } from "./docX";
import { Var,  AlignEqualSymbol, EqualSymbol, Equation, IQuantative, Formula } from "./math";

export class MathProcedureBuilder extends Builder{
    protected procedure = new Procedure();

    constructor(protected docx: DocX){
        super();
        this.docx.content.push(this.procedure);
    }

    public formula(fml: Formula, isLong: boolean=true){
        if(isLong){
            this.procedure.push(
                new MathInline(
                    fml.Variable.toVar(),
                    AlignEqualSymbol,
                    fml.Expression.toPrdVar()
                ),
                new MathInline(
                    AlignEqualSymbol,
                    fml.Expression.toNum()
                ),
                new MathInline(
                    AlignEqualSymbol,
                    fml.Variable.toResult()
                )
            )
        } else {
            this.procedure.push(new MathInline(
                fml.Variable.toVar(),
                AlignEqualSymbol,
                fml.Expression.toPrdVar(),
                EqualSymbol,
                fml.Expression.toNum(),
                EqualSymbol,
                fml.Variable.toResult()
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