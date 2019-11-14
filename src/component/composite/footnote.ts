import {Xml, Composite} from "../xml";


export class Footnote extends Composite{
    constructor(private id: number){
        super();
    }

    public toXml(root: Xml){
        const para = new Xml('w:p');
        para
        .push(
            new Xml('w:pPr').push(new Xml('w:pStyle').attr('w:val', 'a9')),
            new Xml('w:r')
            .push(
                new Xml('w:rPr').push(new Xml('w:rStyle').attr('w:val', 'aa')),
                new Xml('w:footnoteRef')
            ),
            new Xml('w:r').attr('xml:space', 'preserve').text(' ')
        )
        for (const item of this.xmlBuilders){
            item.toXml(para);
        }

        root.push( new Xml('w:footnote').attr('w:id', this.id).push(para))
    }
}