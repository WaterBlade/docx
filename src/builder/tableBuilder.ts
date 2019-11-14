import { Builder } from "./builder";
import { DocX } from "../component/docX";
import { Table } from "../component/composite/table";
import { Row } from "../component/composite/row";
import { Text, Cell, Title, Paragraph } from "../component";
import { Reference } from "./reference";
import { TitleBuilder } from "./titleBuilder";


const PAGE_WIDTH = 8200;
const MIN_TABLE_CELL_WIDTH = 1800;

export class TableBuilder extends Builder {
    protected table: Table = new Table();
    protected titleBuilder: TitleBuilder;

    constructor(protected docx: DocX, protected columnCount: number, ref?: Reference) {
        super();

        // 生成标题
        const title = new Title();
        this.titleBuilder = new TitleBuilder(this.docx, title);
        this.docx.content.push(title);
        // 标题添加引用
        if (ref) {
            title.push(ref.generateMark(this.docx));
            ref.Type = '表';
        } else {
            title.push(new Reference('表').generateMark(this.docx));
        }


        // 设置表格特性
        this.docx.content.push(this.table);
        const width = Math.min(MIN_TABLE_CELL_WIDTH, Math.round(PAGE_WIDTH / this.columnCount))
        this.table.Style = 'ab';
        this.table.ColumnWidthList = (new Array(this.columnCount)).fill(width);
    }

    public title(str: string){
        this.titleBuilder.text(str);
        return this;
    }


    public rowData(...items: string[]) {
        if (this.columnCount !== items.length) {
            throw Error('Table columns dont match!')
        }
        const r = new Row();
        for (const item of items) {
            const p = new Paragraph(new Text(item));
            p.Justify = 'center';
            r.push(new Cell(p));
        }
        this.table.push(r);
        return this;
    }

    public rowCell(){
        const row: Cell[] = [];
        for(let i = 0; i < this.columnCount; i++){
            row.push(new Cell());
        }
        this.table.push(new Row(...row));
        return row;
    }
}