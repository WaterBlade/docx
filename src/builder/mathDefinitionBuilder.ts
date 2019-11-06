import {Builder} from "./builder";
import { DocX } from "./docX";
import {  AlignEqualSymbol,  Equation, Formula} from "./math";
import { MathInline,   Definition, } from "../component";
import { Reference } from "./reference";

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

    public formula(fml: Formula){
        this.definition.push(
            new MathInline(
                fml.Variable.toVar(),
                AlignEqualSymbol,
                fml.Expression.toVar()
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