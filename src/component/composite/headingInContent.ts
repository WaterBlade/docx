import {Xml, Composite} from "../../xml";


export class HeadingInContent extends Composite{
    constructor(
        private level: number,
        private id: number,
        private symbol: string
    ){super()}

    public toXml(root: Xml): void{
        const para = new Xml('w:p');
        root.push(para);

        para.push(new Xml('w:pPr').push(new Xml('w:pStyle').attr('w:val', this.level)))
        para.push(new Xml('w:bookmarkStart').attr('w:id', this.id).attr('w:name', this.symbol))
        
        for (const ele of this.xmlBuilders){
            ele.toXml(para);
        }

        para.push(new Xml('w:bookmarkEnd').attr('w:id', this.id))
    }
}