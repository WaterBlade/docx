import {Xml} from "../../xml";
import { IXml } from "../../IXml";

export class Text implements IXml{

    constructor(
        private text: string,
        private font?: string,
        private size?: number,
        private italic?: boolean,
        private bold?: boolean,
        private underline?: boolean
    ){}

    public toXml(root: Xml){
        const run = new Xml('w:r');
        root.child(run);

        if(this.font || this.size || this.italic || this.bold || this.underline){
            const prop = new Xml('w:rPr');
            run.child(prop);

            if(this.font){
                prop.child(new Xml('w:rFonts').attr('w:eastAsia', this.font))
            }
            if(this.size){
                prop.child(new Xml('w:sz').attr('w:val', this.size))
            }
            if(this.italic){
                prop.child(new Xml('w:i'))
            }
            if(this.bold){
                prop.child(new Xml('w:b'))
            }
        }

        run.child(new Xml('w:t').text(this.text));
    }
    
}