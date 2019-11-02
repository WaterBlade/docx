import { Xml, E,  XmlObjectComposite } from "../../xml";
import { Row } from "./row";

export class Table extends XmlObjectComposite<Row>{
    private style?: string;
    private justify?: string = 'center';
    private layout?: string = 'fixed';
    private columnWidthList?: number[];
    private tableX?: number;
    private tableXSpec?: string;
    private tableY?: number;
    private tableYSpec?: string;
    private cellMargin: {
        top?: number,
        bottom?: number,
        left? : number,
        right? : number
    } = {};

    set Style(val: string){
        this.style = val;
    }

    set Justify(val: string){
        this.justify = val;
    }

    set Layout(val: string){
        this.layout = val;
    }

    set ColumnWidthList(val: number[] ){
        this.columnWidthList = val;
    }

    set TableX(val: number ){
        this.tableX = val;
        this.tableXSpec = undefined;
        this.justify = undefined;
    }

    set TableXSpec(val:string){
        this.tableXSpec = val;
        this.tableX =undefined;
        this.justify = undefined;
    }

    set TableY(val: number ){
        this.tableY = val;
        this.tableYSpec = undefined;
        this.justify = undefined;
    }

    set TableYSpec(val: string){
        this.tableYSpec = val;
        this.tableY = undefined;
        this.justify = undefined;
    }

    set CellMargin(val: {top?: number, bottom?: number, left?: number, right?: number} ){
        this.cellMargin = val;
    }


    public toXml(root: Xml){
        const table = root.newChild('w:tbl');

        if(this.columnWidthList){
            table.push(
                E('w:tblGrid').push(
                    ...this.columnWidthList.map(m=>E('w:gridCol').attr('w:w', m))
                )
            )
        }

        const prop = table.newChild('w:tblPr');
        
        if(this.style){
            prop.push(E('w:tblStyle').attr('w:val', this.style));
        }
        if(this.justify){
            prop.push(E('w:jc').attr('w:val', this.justify));
        }
        if(this.layout){
            prop.push(E('w:tblLayout').attr('w:type', this.layout));
        }
        if(this.tableX || this.tableXSpec || this.tableY || this.tableYSpec){
            const pos = prop.newChild('w:tblpPr');
            if (this.tableX || this.tableXSpec) {
                pos.attr('w:horizonAnchor', 'margin')
                if (this.tableX) { pos.attr('w:tblpX', this.tableX) }
                if (this.tableXSpec) { pos.attr('w:tblpXSpec', this.tableXSpec) }
            }
            if (this.tableY || this.tableYSpec) {
                pos.attr('w:vertAnchor', 'margin')
                if (this.tableY) { pos.attr('w:tblpY', this.tableY) }
                if (this.tableYSpec) { pos.attr('w:tblpYSpec', this.tableYSpec) }
            }
        }
        if(this.cellMargin){
            const margin = prop.newChild('w:tblCellMar');
            const {top, bottom, left, right} = this.cellMargin;
            if(top !== undefined){margin.push(E('w:top').attr('w:w', top).attr('w:type', 'dxa'))}
            if(bottom !== undefined){margin.push(E('w:bottom').attr('w:w', bottom).attr('w:type', 'dxa'))}
            if(left !== undefined){margin.push(E('w:left').attr('w:w', left).attr('w:type', 'dxa'))}
            if(right !== undefined){margin.push(E('w:right').attr('w:w', right).attr('w:type', 'dxa'))}
        }

        super.toXml(table);
    }
}