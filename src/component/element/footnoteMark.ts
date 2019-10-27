import {Xml} from "../../xml";
import {IComponent} from "../component";


export class FootnoteMark implements IComponent{
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