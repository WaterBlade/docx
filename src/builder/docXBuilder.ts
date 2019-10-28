import {ParagraphBuilder} from "./paragraphBuilder";
import {HeadingBuilder} from "./headingBuilder";
import {DocX} from "./docX";


export class DocXBuilder{
    private docx: DocX = new DocX();

    public async buildBlob(){

        return await this.docx.buildBlob();
    }

    public paragraph(text: string) {
        const b = new ParagraphBuilder(this.docx);
        if(text){
            b.text(text);
        }

        return this; 
    }

    public paragraphBuilder(){
        return new ParagraphBuilder(this.docx);
    }

    public heading(level : number = 1, text: string){

        const b = new HeadingBuilder(this.docx, level);

        if(text){
            b.text(text);
        }
        return this;
    }

    public headingBuilder(level: number=1){
        return new HeadingBuilder(this.docx, level);
    }
}