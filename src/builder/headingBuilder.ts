import {Builder} from "./builder";
import {DocX} from "./docX";
import { HeadingInCatalog, HeadingInContent, Text, Catalog } from "../component";
import { FootnoteBuilder } from "./footnoteBuilder";


export class HeadingBuilder extends Builder{
    private headingInCatalog: HeadingInCatalog;
    private headingInContent: HeadingInContent;
    constructor(private docx : DocX, private level: number){
        super();
        let isFirst = false;
        if(!this.docx.catalog){
            isFirst = true;
            this.docx.catalog = new Catalog();
        }

        // 获取标题编号及关联号
        const {id, symbol} = this.docx.markId;
        const code = this.docx.computeCatalogCode(this.level);

        // 生成目录里和正文力的标题
        this.headingInCatalog = new HeadingInCatalog(this.level, id, symbol, code, isFirst);
        this.headingInContent = new HeadingInContent( this.level, id, symbol);

        // 将标题添加到目录及正文中
        this.docx.catalog.child(this.headingInCatalog);
        this.docx.content.child(this.headingInContent);
    }

    public text(str: string): HeadingBuilder{
        const text = new Text(str);
        this.headingInCatalog.child(text);
        this.headingInContent.child(text);
        return this;
    }

    public footnote(str: string){
        const b = new FootnoteBuilder(this.docx, this.headingInContent);
        b.text(str);
        return this;
    }

    public footnoteBuilder(){
        return new FootnoteBuilder(this.docx, this.headingInContent);
    }

}