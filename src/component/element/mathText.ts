import {Xml, XmlObject, E} from "../../xml";

export class MathText implements XmlObject{
    constructor(
        private text: string|number,
        private option: {sty?:string, align?:boolean, color?: string}={}
    ){}

    public setAlign(align: boolean=true){
        this.option.align = align;
        return this;
    }

    public toXml(root: Xml){
        const run = root.newChild('m:r');

        const wprop = run.newChild('w:rPr');
        wprop.push(new Xml('w:rFonts').attr('w:ascii', 'Cambria Math').attr('w:hAnsi', 'Cambria Math'));

        if(this.option){
            const {sty, align, color} = this.option;
            
            if (sty || align){
                const mprop = run.newChild('m:rPr');

                if(sty){mprop.push(new Xml('m:sty').attr('m:val', sty));}
                if(align){mprop.push(new Xml('m:aln'));}
            }

            if(color){
                wprop.push(new Xml('w:color').attr('w:val', color));
            }
        }

        run.push(E('m:t').text(this.text));
    }
}