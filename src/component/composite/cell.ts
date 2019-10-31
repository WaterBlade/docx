import {Xml, E, XmlObjectComposite} from "../../xml";
import { Paragraph } from "./paragraph";

type BorderName = 'top' | 'bottom' | 'left' | 'right';
export {BorderName};

export class Cell extends XmlObjectComposite<Paragraph>{
    private vertAlign: string = 'center';
    private borders?: BorderName[];
    private borderSize: number = 4;

    set VertAlign(val: string){
        this.vertAlign = val;
    }

    set Borders(val: BorderName[]){
        this.borders = val;
    }

    set BorderSize(val: number){
        this.borderSize = val;
    }

    public toXml(root: Xml){
        const cell = root.newChild('w:tc');
        const prop = cell.newChild('w:tcPr');
        if(this.vertAlign){
            prop.push(E('w:vAlign').attr('w:val', this.vertAlign));
        }
        if(this.borders){
            const borders = prop.newChild('w:tcBorders');
            for(const border of this.borders){
                borders.push(
                    E(`w:${border}`)
                    .attr('w:val', 'single')
                    .attr('w:sz', `${this.borderSize}`)
                    .attr('w:space', 0)
                    .attr('w:color', 'auto')
                )
            }
        }
        super.toXml(cell);
    }

}