import {Xml} from "../../xml";
import {Composite} from "./composite";


export class HeadingInContent extends Composite{
    constructor(
        private level: number,
        private id: number,
        private symbol: string
    ){super()}

    public toXml(root: Xml): void{
        const para = new Xml('w:p');
        root.child(para);

        para.child(new Xml('w:pPr').child(new Xml('w:pStyle').attr('w:val', this.level)))
        para.child(new Xml('w:bookmarkStart').attr('w:id', this.id).attr('w:name', this.symbol))
        
        for (const ele of this.components){
            ele.toXml(para);
        }

        para.child(new Xml('w:bookmarkEnd').attr('w:id', this.id))
    }
}