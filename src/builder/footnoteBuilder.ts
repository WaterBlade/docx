import {Builder} from "./builder";
import {DocX} from "./docX";
import { Footnote, FootnoteMark, Composite, Text } from "../component";


export class FootnoteBuilder extends Builder{
    private footnote: Footnote;
    constructor(private docx: DocX, private composite: Composite){
        super();
        const id = this.docx.FootnoteId.id;
        this.composite.child(new FootnoteMark(id));
        
        this.footnote = new Footnote(id);
        this.docx.footnotes.child(this.footnote);
    }

    public text(str: string){
        this.footnote.child(new Text(str));
    }
}

