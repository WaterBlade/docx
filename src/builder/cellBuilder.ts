import { Builder } from "./builder";
import { DocX } from "../root/docX";
import { Row } from "../component/composite/row";
import { ContentInlineBuilder } from "./contentInlineBuilder";
import { Cell, Paragraph } from "../component";
import { Variable } from "./math/variable";

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

    public variable(variable: Variable){
        this.content.variable(variable);
        return this;
    }

    public variableValue(variable: Variable){
        this.content.variableValue(variable);
        return this;
    }
}