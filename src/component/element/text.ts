import {Xml, E, XmlObject} from "../xml";

export class Text implements XmlObject{
    private font?: string;
    private size?: number;
    private italic?: boolean;
    private bold?: boolean;

    set Font(val: string){
        this.font = val;
    }

    set Size(val: number){
        this.size = val;
    }

    set Italic(val: boolean){
        this.italic = val;
    }

    set Bold(val: boolean){
        this.bold = val;
    }

    set Text(val: string){
        this.text = val;
    }

    constructor( private text: string){}

    public toXml(root: Xml){
        const run = root.newChild('w:r');
        
        const prop = run.newChild('w:rPr');

        if (this.font) {
            prop.push(E('w:rFonts').attr('w:eastAsia', this.font))
        }
        if (this.size) {
            prop.push(E('w:sz').attr('w:val', this.size))
        }
        if (this.italic) {
            prop.push(E('w:i'))
        }
        if (this.bold) {
            prop.push(E('w:b'))
        }

        run.push(E('w:t').text(this.text));
        
    }
    
}