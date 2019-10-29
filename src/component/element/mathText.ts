import {Xml} from "../../xml";
import { IXml } from "../../IXml";

export class MathText implements IXml{
    constructor(
        private text: string|number,
        private options: {sty?:string, align?:boolean, color?: string}={}
    ){}

    public setAlign(align: boolean=true){
        this.options.align = align;
        return this;
    }

    public toXml(root: Xml){
        const run = new Xml('m:r');
        root.child(run);

        const wprop = new Xml('w:rPr');
        wprop.child(new Xml('w:rFonts').attr('w:ascii', 'Cambria Math').attr('w:hAnsi', 'Cambria Math'));
        run.child(wprop);

        if(this.options){
            const {sty, align, color} = this.options;
            
            if (sty || align){
                const mprop = new Xml('m:rPr');
                run.child(mprop);

                if(sty){mprop.child(new Xml('m:sty').attr('m:val', sty));}
                if(align){mprop.child(new Xml('m:aln'));}
            }

            if(color){
                wprop.child(new Xml('w:color').attr('w:val', color));
            }

        }

        run.child(new Xml('m:t').text(this.text));
    }
}