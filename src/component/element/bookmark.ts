import {Xml, XmlObject, E} from "../xml";


export class Bookmark implements XmlObject{
    constructor(
        private type: string, 
        private id: number, 
        private symbol: string, 
        private closeSymbol: {left?: string, right?:string}={}
    ){}

    public toXml(root: Xml){
        const {left ,right} = this.closeSymbol;
        if (left){
            root.push(E('w:r').push(E('w:t').text(left)));
        }
        root.push(
            E('w:bookmarkStart').attr('w:id', this.id).attr('w:name', this.symbol),
            E('w:r').push(E('w:t').text(this.type)),
            E('w:fldSimple').attr('w:instr', ` STYLEREF 1 \\s`).push(new Xml('w:r').push(new Xml('w:t').text(0))),
            E('w:r').push(E('w:noBreakHyphen')),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'begin')),
            E('w:r').push(E('w:instrText').attr('xml:space', 'preserve').text('SEQ ')),
            E('w:r').push(E('w:instrText').text(this.type)),
            E('w:r').push(E('w:instrText').attr('xml:space', 'preserve').text(` \\* ARABIC \\s 1`)),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'separate')),
            E('w:r').push(E('w:t').text(0)),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'end')),
            E('w:bookmarkEnd').attr('w:id', this.id)
        );
        if(right){
            root.push(E('w:r').push(E('w:t').text(right)));
        }
    }

} 