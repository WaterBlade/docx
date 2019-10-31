import {Composite, Xml, E} from "../../xml";


export class Cover extends Composite{

    public toXml(root: Xml){
        super.toXml(root);
        root.push(E('w:p').push(E('w:r').push(E('w:br').attr('w:type', 'page'))))

    }

}