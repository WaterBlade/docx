import {ParagraphBuilder} from "./paragraphBuilder";
import {HeadingBuilder} from "./headingBuilder";
import {DocX} from "./docX";
import { MathDefinitionBuilder } from "./mathDefinition";
import { MathProcedureBuilder } from "./mathProcedure";


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

    public mathDefinitionBuilder(){
        return new MathDefinitionBuilder(this.docx);
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