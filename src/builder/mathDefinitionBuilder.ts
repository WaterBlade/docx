import { Builder } from "./builder";
import { DocX } from "../root/docX";
import { Formula } from "./math/formula";
import { Relation } from "./math/relation";
import { Definition, } from "../component";
import { Reference } from "./reference";

export class MathDefinitionBuilder extends Builder {
    protected definition: Definition;

    constructor(protected docx: DocX, protected reference?: Reference) {
        super();
        if (reference) {
            this.definition = new Definition(reference.generateMark(this.docx));
            reference.Type = '式';
        } else {
            this.definition = new Definition(new Reference('式').generateMark(this.docx));
        }
        this.docx.content.push(this.definition);

    }

    public formula(...fmls: Formula[]) {
        for (const fml of fmls) {
            this.definition.push(fml.toDefinition());
        }
    }

    public equation(...equations: Relation[]) {
        for (const equation of equations) {
            this.definition.push(equation.toDefinition());
        }

    }


}