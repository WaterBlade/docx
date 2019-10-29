import {Xml} from "../../xml";
import { IXml } from "../../IXml";


export class Bookmark implements IXml{
    constructor(
        private type: string, 
        private id: number, 
        private symbol: string, 
        private closeSymbol: {left?: string, right?:string}={}
    ){}

    public toXml(root: Xml){
        const {left ,right} = this.closeSymbol;
        if (left){
            root.child(new Xml('w:r').child(new Xml('w:t').text(left)));
        }
        root
        .child(
            new Xml('w:bookmarkStart').attr('w:id', this.id).attr('w:name', this.symbol),
            new Xml('w:r').child(new Xml('w:t').text(this.type)),
            new Xml('w:fldSimple').attr('w:instr', ` STYLEREF 1 \\s`).child(new Xml('w:r').child(new Xml('w:t').text(0))),
            new Xml('w:r').child(new Xml('w:noBreakHyphen')),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'begin')),
            new Xml('w:r').child(new Xml('w:instrText').attr('xml:space', 'preserve').text('SEQ ')),
            new Xml('w:r').child(new Xml('w:instrText').text(this.type)),
            new Xml('w:r').child(new Xml('w:instrText').attr('xml:space', 'preserve').text(` \\* ARABIC \\s 1`)),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'separate')),
            new Xml('w:r').child(new Xml('w:t').text(0)),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'end')),
            new Xml('w:bookmarkEnd').attr('w:id', this.id)
        );
        if(right){
            root.child(new Xml('w:r').child(new Xml('w:t').text(right)));
        }
    }

} 