import {Xml} from "../../xml";
import {Composite} from "./composite";


export class Paragraph extends Composite{
    public toXml(root: Xml){
        const para = new Xml('w:p');
        root.child(para);

        para
        .child(
            new Xml('w:pPr')
            .child(
                new Xml('w:spacing').attr('w:before', 156).attr('w:after', 156),
                new Xml('w:ind').attr('w:firstLine', 420)
            )
        );
        
        for(const item of this.components){
            item.toXml(para);
        }
    }
}