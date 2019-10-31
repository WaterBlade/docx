import { Builder } from "./builder";
import { DocX } from "./docX";
import { Cover, Cell, BorderName } from "../component";
import { Table } from "../component/composite/table";

export class CoverBuilder extends Builder{
    private cover: Cover = new Cover();

    private project?: string;
    private name?: string;
    private designPart?: string;
    private designPhase?: string;
    private serialCode?: string;
    private secretType?: string;
    private footer?: string;

    set Project(val: string){
        this.project = val;
    }

    set Name(val: string){
        this.name = val;
    }

    set DesignPart(val: string){
        this.designPart = val;
    }

    set DesignPhase(val: string){
        this.designPhase = val;
    }

    set SerialCode(val: string){
        this.serialCode = val;
    }

    set SecretType(val: string){
        this.secretType = val;
    }

    set Footer(val: string){
        this.footer = val;
    }

    constructor(private docx: DocX){
        super();
        this.docx.cover = this.cover;
    }

    public build(){
        // 秘密
        const table = new Table();


    }

    private makeTable(option: {
        columnWidthList?: number[],
        tableX?: number;
        tableY?: number,
        tableXSpec?: number,
        tableYSpec?: number,
        cellMargin?:{top:number, bottom: number, left: number, right: number}
    }={}){
        const table = new Table();
        const {columnWidthList, tableX, tableY, tableXSpec, tableYSpec, cellMargin} = option;
        columnWidthList? table.ColumnWidthList = columnWidthList : null;
        tableX? table.TableX = tableX: null;
        tableY? table.TableY = tableY: null;
        tableXSpec ? table.TableXSpec = tableXSpec: null;
        tableYSpec ? table.TableYSpec = tableYSpec: null;
        cellMargin ? table.CellMargin = cellMargin: null;
        return table;

    }

    private makeCell(option:{
        text?: string,
        size?: number,
        font?: string,
        hAlign?: string,
        vAlign?: string,
        borders?: BorderName[],
        space?: [number, number],
        borderSize?: number
    }={}){
        const cell = new Cell();
        const {text, size, font, hAlign, vAlign, borders, space, borderSize} = option;
        if(vAlign){cell.VertAlign = vAlign}
        if(borders){cell.Borders = borders}
        
        // TODO: Finish the rest part

    }
}