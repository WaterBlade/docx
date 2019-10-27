import {Builder} from "./builder";
import {Xml} from "../xml";
import {DocX} from "./docX";

import {Paragraph, Text, FootnoteMark, Footnote} from "../component";
import { FootnoteBuilder } from "./footnoteBuilder";

export class ParagraphBuilder extends Builder{
    private paragraph = new Paragraph();

    constructor(private docx : DocX){
        super();
        this.docx.content.child(this.paragraph);
    }

    public text(str: string): ParagraphBuilder{
        this.paragraph.child(new Text(str))
        return this;
    }

    public footnote(str: string){
        const b = new FootnoteBuilder(this.docx, this.paragraph);
        b.text(str);
        return this;
    }

    public footnoteBuilder(){
        return new FootnoteBuilder(this.docx, this.paragraph);
    }
}