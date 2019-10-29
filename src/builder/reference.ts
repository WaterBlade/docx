import {Ref, Bookmark, Composite} from "../component";
import { DocX } from "./docX";

export class Reference {
    private reference: Ref = new Ref();
    constructor(private type: string) { }

    public ref(root: Composite){
        root.child(this.reference);
    }

    public mark(docx: DocX, root: Composite){
        const {id, symbol} = docx.markId;
        root.child(new Bookmark(this.type, id, symbol, {left: '(', right: ')'}))
        this.reference.Symbol = symbol;
    }
}
