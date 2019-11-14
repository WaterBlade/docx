import { Xml, E, XmlObjectComposite} from "../xml";
import { Cell } from "./cell";


export class Row extends XmlObjectComposite<Cell>{
    public toXml(root: Xml){
        const tr = E('w:tr');
        super.toXml(tr);
        root.push(tr);
    }
}