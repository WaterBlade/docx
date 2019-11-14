import { Builder } from "./builder";
import { Procedure } from "../component";
import { DocX } from "../component/docX";
import { Formula } from "./math/formula";
import { Relation } from "./math/relation";

export class MathProcedureBuilder extends Builder {
    protected procedure = new Procedure();

    constructor(protected docx: DocX) {
        super();
        this.docx.content.push(this.procedure);
    }

    public formula(...fmls: Formula[]) {
        for (const fml of fmls) {
            this.procedure.push(fml.toProcedure());
        }

    }

    public equation(...equations: Relation[]) {
        for (const equation of equations) {
            this.procedure.push(equation.toProcedure());
        }

    }

}