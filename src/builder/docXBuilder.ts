import {ParagraphBuilder} from "./paragraphBuilder";
import {HeadingBuilder} from "./headingBuilder";
import {DocX} from "./docX";
import { MathDefinitionBuilder } from "./mathDefinitionBuilder";
import { MathProcedureBuilder } from "./mathProcedureBuilder";
import { MathDeclarationBuilder } from "./mathDeclarationBuilder";
import { TableBuilder } from "./tableBuilder";
import { Reference } from "./reference";


export class DocXBuilder{
    private docx: DocX = new DocX();

    public async saveBlob(path: string='example.docx'){

        return await this.docx.saveBlob(path);
    }

    public paragraphBuilder(){
        return new ParagraphBuilder(this.docx);
    }

    public headingBuilder(level: number=1){
        return new HeadingBuilder(this.docx, level);
    }

    public tableBuilder(colCount: number, ref?: Reference){
        return new TableBuilder(this.docx, colCount, ref);
    }

    public mathDefinitionBuilder(ref?: Reference){
        return new MathDefinitionBuilder(this.docx, ref);
    }

    public mathDeclarationBuilder(){
        return new MathDeclarationBuilder(this.docx);
    }

    public mathProcedureBuilder(){
        return new MathProcedureBuilder(this.docx);
    }

    public paragraph(text: string) {
        new ParagraphBuilder(this.docx).text(text);
        return this; 
    }

    public heading(level : number = 1, text: string){
        new HeadingBuilder(this.docx, level).text(text);
        return this;
    }

}