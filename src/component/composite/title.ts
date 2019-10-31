import { Xml, E, Composite } from "../../xml";

export class Title extends Composite{
    private keepNext?: boolean

    set KeepNext(val: boolean){
        this.keepNext = val;
    }

    public toXml(root: Xml){
        const para = E('w:p');
        root.push(para);

        const prop = E('w:pPr');
        para.push(prop);

        prop.push(
            E('w:pStyle').attr('w:val', 'a9'),
            E('w:jc').attr('w:val', 'center'),
        )
        if (this.keepNext){
            prop.push(E('w:keepNext'));
        }

        super.toXml(para);
    }
}