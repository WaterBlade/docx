import { Builder } from "./builder";
import { Procedure } from "../component";
import { DocX } from "./docX";
import { Formula } from "./math/formula";
import { Equation } from "./math/equation";
import { ProcedureContent } from "./math/content";

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

    public equation(...equations: Equation[]) {
        for (const equation of equations) {
            this.procedure.push(equation.toProcedure());
        }

    }

    public content(...contents: ProcedureContent[]){
        for (const c of contents){
            this.procedure.push(...c.Contents);
        }
    }
}