import {ParagraphBuilder} from "./paragraphBuilder";
import {HeadingBuilder} from "./headingBuilder";
import { MathDefinitionBuilder } from "./mathDefinitionBuilder";
import { MathProcedureBuilder } from "./mathProcedureBuilder";
import { MathDeclarationBuilder } from "./mathDeclarationBuilder";
import { TableBuilder } from "./tableBuilder";
import { Reference } from "./reference";
import { CoverBuilder } from "./coverBuilder";
import { PageBreak } from "../component";
import { DocX } from "@/root";
import { FigureBuilder } from "./figureBuilder";


export class DocXBuilder{
    private docx: DocX = new DocX();
    private cov: CoverBuilder;

    public async saveBlob(path: string='example.docx'){
        this.cov.build();

        return await this.docx.saveBlob(path);
    }

    public cover(){
        this.cov = new CoverBuilder(this.docx);
        return this.cov;
    }

    public p(){
        return new ParagraphBuilder(this.docx);
    }

    public h(level: number=1){
        return new HeadingBuilder(this.docx, level);
    }

    public pageBreak(){
        this.docx.content.push(new PageBreak());
    }

    public figure(ref?: Reference){
        return new FigureBuilder(this.docx, ref);
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

export function demo(){

}