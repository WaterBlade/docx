import {Xml} from "../../xml";
import { IXml } from "../../IXml";

export class Ref implements IXml{
    constructor(private symbol?: string){}

    set Symbol(val: string){
        this.symbol = val;
    }

    public toXml(root: Xml){
        if(!this.symbol){
            return;
        }
        root.child(
            new Xml('w:r').child(new Xml('w:t').text('(')),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'begin')),
            new Xml('w:r').child(new Xml('w:instrText').text(`REF ${this.symbol} \\h`)),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'separate')),
            new Xml('w:r').child(new Xml('w:t').text(0)),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'end')),
            new Xml('w:r').child(new Xml('w:t').text(')'))
        );
    }
}