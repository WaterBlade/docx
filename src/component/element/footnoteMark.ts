import {Xml} from "../../xml";
import { IXml } from "../../IXml";


export class FootnoteMark implements IXml{
    constructor(
        private id: number
    ){}

    public toXml(root: Xml){
        root
        .child(
            new Xml('w:r')
            .child(
                new Xml('w:rPr').child(new Xml('w:rStyle').attr('w:val', 'aa')),
                new Xml('w:footnoteReference').attr('w:id', this.id)
            )
        );
    }
}