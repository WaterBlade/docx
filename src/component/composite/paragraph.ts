import {Xml, E, Composite,} from "../../xml";

export class Paragraph extends Composite{
    private spacing?: {before?: number, after?: number, line?: number};
    private indentChar?: number;
    private justify?: string;
    private notSnapToGrid: boolean = false;

    set Spacing(val: {before?: number; after?: number; line?: number}){
        this.spacing = val;
    }

    set IndentChar(val: number){
        this.indentChar = val;
    }

    set Justify(val: string){
        this.justify = val;
    }

    set NotSnapToGrid(val: boolean){
        this.notSnapToGrid = val;
    }

    public toXml(root: Xml){
        const para = root.newChild('w:p');
        const prop = para.newChild('w:pPr');

        if(this.spacing){
            const{before, after, line} = this.spacing;
            const spacing = prop.newChild('w:spacing');
            if(before !== undefined){spacing.attr('w:before', before)}
            if(after !== undefined){spacing.attr('w:after', after)}
            if(line !== undefined){spacing.attr('w:line', line)}
        }
        if(this.indentChar){
            prop.push(E('w:ind').attr('w:firstLineChars', this.indentChar * 100))
        }
        if(this.justify){
            prop.push(E('w:jc').attr('w:val', this.justify));
        }
        if(this.notSnapToGrid){
            prop.push(E('w:snapToGrid').attr('w:val', !this.notSnapToGrid))
        }
        
        for(const item of this.xmlBuilders){
            item.toXml(para);
        }
    }
}