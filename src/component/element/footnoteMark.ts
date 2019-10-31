import {Xml, XmlObject, E} from "../../xml";


export class FootnoteMark implements XmlObject{
    constructor(
        private id: number
    ){}

    public toXml(root: Xml){
        root.push(
            E('w:r').push(
                E('w:rPr').push(E('w:rStyle').attr('w:val', 'aa')),
                E('w:footnoteReference').attr('w:id', this.id)
            )
        );
    }
}