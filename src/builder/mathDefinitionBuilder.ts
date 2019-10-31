import {Builder} from "./builder";
import { DocX } from "./docX";
import { Expression, AlignEqualSymbol, Var, Equation} from "./math";
import { MathInline, MathText, EqArr, Definition, Delimeter} from "../component";
import { Reference } from "./reference";
import { Composite } from "../xml";

export class MathDefinitionBuilder extends Builder{
    protected definition: Definition;

    constructor(protected docx: DocX, protected reference?: Reference){
        super();
        if(reference){
            this.definition = new Definition(reference.generateMark(this.docx));
            reference.Type = '式';
        } else {
            this.definition = new Definition(new Reference('式').generateMark(this.docx));
        }
        this.docx.content.push(this.definition);

    }

    public formula(variable: Var, expression: Expression){
        this.definition.push(
            new MathInline(
                variable.toVar(),
                AlignEqualSymbol,
                expression.toVar()
            )
        )
    }

    public conditionFormula(variable: Var, expressions: Expression[], conditions: Equation[]){
        const array = new EqArr();
        for(let i = 0; i < expressions.length; i++){
            const exp = expressions[i];
            const cond = conditions[i];
            array.push(new Composite(exp.toVar(), new MathText(' , '), cond.toVar()));
        }
        this.definition.push(
            new MathInline(
                variable.toVar(),
                AlignEqualSymbol,
                new Delimeter(array)
            )
        )
    }

    public equation(equation: Equation){
        this.definition.push(
            new MathInline(
                equation.Left.toVar(),
                equation.OriginalSymbol.setAlign(),
                equation.Right.toVar()
            )
        )

    }


}