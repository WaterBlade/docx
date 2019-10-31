import { Builder } from "./builder";
import { DocX } from "./docX";
import { Row } from "../component/composite/row";
import { ContentInlineBuilder } from "./contentInlineBuilder";
import { Cell, Paragraph } from "../component";
import { Var } from "./math";

export class CellBuilder extends Builder{
    private content: ContentInlineBuilder;
    private cell = new Cell();
    constructor(protected docx: DocX, protected row: Row){
        super();
        const paragraph = new Paragraph();
        this.cell.push(paragraph);
        paragraph.Justify = 'center';
        this.content = new ContentInlineBuilder(this.docx, paragraph);
    }

    public newPara(){
        const para = new Paragraph();
        this.cell.push(para);
        this.content = new ContentInlineBuilder(this.docx, para);
    }

    public text(str: string){
        this.content.text(str);
        return this;
    }

    public variable(variable: Var){
        this.content.variable(variable);
        return this;
    }

    public variableValue(variable: Var){
        this.content.variableValue(variable);
        return this;
    }
}