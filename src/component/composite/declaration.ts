import {Xml, E, XmlObject, Composite} from "../../xml";


export class Declaration extends Composite{
    constructor(private variable: XmlObject, private inform?: string, private unit?: XmlObject){
        super();
    }

    public toXml(root: Xml){
        const variable = E('m:oMath');
        this.variable.toXml(variable);

        const para = E('w:p');

        root.push(
            para.push(
                E('w:pPr').push(
                    E('w:tabs').push(
                        E('w:tab').attr('w:val', 'right').attr('w:pos', 600),
                        E('w:tab').attr('w:val', 'center').attr('w:pos', 700),
                        E('w:tab').attr('w:val', 'left').attr('w:pos', 800)
                    )
                ),
                E('w:r').push(E('w:tab')),
                variable,
                E('w:r').push(E('w:t').text('―')),
                E('w:r').push(E('w:tab')),
            )
        )
        if(this.inform){
            para.push(E('w:r').push(E('w:t').text(this.inform)));
        }
        if(this.unit){
            para.push(E('w:r').push(E('w:t').text('，')));
            const unit = E('m:oMath');
            this.unit.toXml(unit);
            para.push(unit);
        }
    }
}