import {Ref, Bookmark} from "../component";
import { DocX } from "../root/docX";

export class Reference {
    private reference: Ref = new Ref();
    constructor(private type: string='') { }

    get Ref(){
        return this.reference;
    }

    set Type(val: string){
        this.type = val;
    }

    public generateMark(docx: DocX){
        const {id, symbol} = docx.markId;
        this.reference.Symbol = symbol;
        return new Bookmark(this.type, id, symbol, {left: '(', right:')'});
    }
}
