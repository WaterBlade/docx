import { Xml } from "../../xml";
import { MathPara } from "./math";
export class Procedure extends MathPara {
    public toXml(root: Xml) {
        const p = new Xml('w:p');
        root.push(p);
        super.toXml(p);
    }
}
