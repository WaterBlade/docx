import {Xml} from "../../xml";
import {Composite} from "./composite";


export class Footnote extends Composite{
    constructor(private id: number){
        super();
    }

    public toXml(root: Xml){
        const para = new Xml('w:p');
        para
        .child(
            new Xml('w:pPr').child(new Xml('w:pStyle').attr('w:val', 'a9')),
            new Xml('w:r')
            .child(
                new Xml('w:rPr').child(new Xml('w:rStyle').attr('w:val', 'aa')),
                new Xml('w:footnoteRef')
            ),
            new Xml('w:r').attr('xml:space', 'preserve').text(' ')
        )
        for (const item of this.components){
            item.toXml(para);
        }

        root.child( new Xml('w:footnote').attr('w:id', this.id).child(para))
    }
}