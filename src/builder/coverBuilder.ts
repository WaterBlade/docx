import { Builder } from "./builder";
import { DocX } from "./docX";
import { Cover, Cell, BorderName, Paragraph, Text } from "../component";
import { Table } from "../component/composite/table";
import { Row } from "../component/composite/row";

export class CoverBuilder extends Builder{
    private cover: Cover = new Cover();

    private project?: string = '**工程';
    private name?: string = '**计算书';
    private designPart?: string = '**专业';
    private designPhase?: string = '**阶段';
    private serialCode?: string;
    private secretType?: string;
    private footer?: string = '湖南省水利水电勘测设计研究总院';

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
        const c11 = this.makeEnclosed('秘密');
        const c12 = this.makeEnclosed(this.secretType);
        const t1 = new Table(new Row(c11, c12));
        t1.ColumnWidthList = [600, 2000];
        t1.TableXSpec = 'left';
        t1.TableYSpec = 'top';
        t1.CellMargin = {top: 0, bottom: 0, left: 0, right: 0}
        
        // 编号
        const c21 = this.makeEnclosed('编号');
        const c22 = this.makeEnclosed(this.serialCode);
        const t2 = new Table(new Row(c21, c22));
        t2.ColumnWidthList = [600, 2000];
        t2.TableXSpec = 'right';
        t2.TableYSpec = 'top';
        t2.CellMargin = {top: 0, bottom: 0, left: 0, right:0}

        // 计算书
        const c3 = this.makeCell({
            text:'计 算 书',
            size: 72,
            hAlign: 'center'
        });
        const t3 = new Table(new Row(c3));
        t3.ColumnWidthList = [5000];
        t3.TableXSpec = 'center';
        t3.TableY = 3000;

        // 标题
        const t4 = new Table();
        t4.ColumnWidthList = [1600, 5000];
        t4.TableXSpec = 'center';
        t4.TableY = 6000;
        t4.CellMargin = {left: 0, right: 10};
        const title = ['工程名称', '专业名称', '设计阶段', '计算书名称'];
        const value = [this.project, this.designPart, this.designPhase, this.name];
        for(let i = 0; i < title.length; i++){
            t4.push(
                new Row(
                    this.makeCell({
                        text: title[i],
                        size: 30,
                        hAlign: 'right',
                        vAlign: 'bottom',
                        space: {before: 200, after: 0}
                    }),
                    this.makeCell({
                        text: value[i],
                        size: 30,
                        font: '楷体',
                        hAlign: 'center',
                        vAlign: 'bottom',
                        borders: ['bottom'],
                        borderSize: 6,
                        space:{before: 200, after: 0}
                    })
                )
            )
        }

        // 签名
        const t5 = new Table();
        t5.ColumnWidthList = [700, 1500, 300, 900, 300, 600, 300, 600, 300]
        t5.TableXSpec = 'center';
        t5.TableY = 10500;
        t5.CellMargin = {left: 0, right: 0};

        const [year, month, day] = ['年', '月', '日'].map(
            m => this.makeCell({text: m, size: 24, vAlign: 'bottom', space: {before: 120, after: 0}})
        );
        const line = this.makeCell({vAlign: 'bottom', size: 24, borders:['bottom'], borderSize: 6, space: {before: 120, after: 0}});
        const [audit, check, calc] = ['审查', '校核', '计算'].map(
            m => this.makeCell({text: m, size: 24, vAlign: 'bottom', space: {before: 120, after: 0}})
        );
        const blank = this.makeCell();

        t5.push(
            new Row(audit, line, blank, line, year, line, month, line, day),
            new Row(check, line, blank, line, year, line, month, line, day),
            new Row(calc, line, blank, line, year, line, month, line, day)
        );

        const t6 = new Table(
            new Row(
                this.makeCell({text: this.footer, hAlign: 'center',size: 24})
            )
        )
        t6.ColumnWidthList = [5000];
        t6.TableXSpec = 'center';
        t6.TableY = 13500;

        this.cover.push(t1, t2, t3, t4, t5, t6);

    }

    private makeCell(option:{
        text?: string,
        size?: number,
        font?: string,
        hAlign?: string,
        vAlign?: string,
        borders?: BorderName[],
        space?: {before?: number, after?: number, line?: number},
        borderSize?: number
    }={}){
        const cell = new Cell();
        const {text, size, font, hAlign, vAlign, borders, space, borderSize} = option;
        if(vAlign){cell.VertAlign = vAlign}
        if(borders){cell.Borders = borders}
        if(borderSize){cell.BorderSize = borderSize}

        const para = new Paragraph();
        cell.push(para);
        if(hAlign){para.Justify = hAlign}
        if(hAlign != 'center'){
            para.NotSnapToGrid = true;
            if(space){para.Spacing = space}
        }

        const run = new Text('');
        para.push(run);

        if(size){ run.Size = size; }
        if(font){ run.Font = font; }
        if(text){ run.Text = text; }

        return cell;

    }

    private makeEnclosed(text?: string){
        return this.makeCell({
            text: text,
            borders: ['top', 'bottom', 'left', 'right']
        })
    }
}