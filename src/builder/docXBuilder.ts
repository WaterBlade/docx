import {ParagraphBuilder} from "./paragraphBuilder";
import {HeadingBuilder} from "./headingBuilder";
import {DocX} from "./docX";
import { MathDefinitionBuilder } from "./mathDefinitionBuilder";
import { MathProcedureBuilder } from "./mathProcedureBuilder";
import { MathDeclarationBuilder } from "./mathDeclarationBuilder";
import { TableBuilder } from "./tableBuilder";
import { Reference } from "./reference";
import { CoverBuilder } from "./coverBuilder";


export class DocXBuilder{
    private docx: DocX = new DocX();

    public async saveBlob(path: string='example.docx'){

        return await this.docx.saveBlob(path);
    }

    public cover(){
        return new CoverBuilder(this.docx);
    }

    public paragraph(){
        return new ParagraphBuilder(this.docx);
    }

    public heading(level: number=1){
        return new HeadingBuilder(this.docx, level);
    }

    public table(colCount: number, ref?: Reference){
        return new TableBuilder(this.docx, colCount, ref);
    }

    public definition(ref?: Reference){
        return new MathDefinitionBuilder(this.docx, ref);
    }

    public declaration(){
        return new MathDeclarationBuilder(this.docx);
    }

    public procedure(){
        return new MathProcedureBuilder(this.docx);
    }

}