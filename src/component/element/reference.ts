import {Xml, E, XmlObject} from "../xml";

export class Ref implements XmlObject{
    constructor(private symbol?: string){}

    set Symbol(val: string){
        this.symbol = val;
    }

    public toXml(root: Xml){
        if(!this.symbol){
            return;
        }
        root.push(
            E('w:r').push(E('w:t').text('(')),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'begin')),
            E('w:r').push(E('w:instrText').text(`REF ${this.symbol} \\h`)),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'separate')),
            E('w:r').push(E('w:t').text(0)),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'end')),
            E('w:r').push(E('w:t').text(')'))
        );
    }
}