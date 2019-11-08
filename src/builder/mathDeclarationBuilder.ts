import { Builder } from "./builder";
import { DocX } from "./docX";
import { Variable } from "./math/variable";
import { Paragraph, Text } from "../component";
import { DeclarationContent } from "./math/content";

export class MathDeclarationBuilder extends Builder {
    constructor(protected docx: DocX) {
        super();
        this.docx.content.push(new Paragraph().push(new Text('式中：')));
    }

    public declare(...variables: Variable[]) {
        for (const variable of variables) {
            this.docx.content.push(variable.toDeclaration())
        }
    }
    
    public content(...contents: DeclarationContent[]){
        for(const c of contents){
            this.docx.content.push(...c.Contents);
        }
    }
}