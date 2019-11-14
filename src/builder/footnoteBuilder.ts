import {Builder} from "./builder";
import {DocX} from "../root/docX";
import { Footnote, FootnoteMark, Text } from "../component";
import { Composite } from "../component/xml";


export class FootnoteBuilder extends Builder{
    private footnote: Footnote;
    constructor(private docx: DocX, private composite: Composite){
        super();
        const id = this.docx.FootnoteId.id;
        this.composite.push(new FootnoteMark(id));
        
        this.footnote = new Footnote(id);
        this.docx.footnotes.child(this.footnote);
    }

    public text(str: string){
        this.footnote.push(new Text(str));
    }
}

