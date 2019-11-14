import {Builder} from "./builder";
import {DocX} from "../component/docX";
import { HeadingInCatalog, HeadingInContent, Catalog } from "../component";
import { ContentInlineBuilder } from "./contentInlineBuilder";
import { Variable } from "./math/variable";


export class HeadingBuilder extends Builder{
    private builderCat: ContentInlineBuilder;
    private builderCon: ContentInlineBuilder;
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
        const headingInCatalog = new HeadingInCatalog(this.level, symbol, code, isFirst);
        const headingInContent = new HeadingInContent( this.level, id, symbol);

        // 将标题添加到目录及正文中
        this.docx.catalog.push(headingInCatalog);
        this.docx.content.push(headingInContent);

        // inline内容生成器
        this.builderCat = new ContentInlineBuilder(this.docx, headingInCatalog);
        this.builderCon = new ContentInlineBuilder(this.docx, headingInContent);
        
    }

    public t(str: string): HeadingBuilder{
        this.builderCat.text(str);
        this.builderCon.text(str)
        return this;
    }

    public footnote(str: string){
        this.builderCon.footnote(str);
        return this;
    }

    public footnoteBuilder(){
        return this.builderCon.footnoteBuilder();
    }

    public var(variable: Variable){
        this.builderCat.variable(variable);
        this.builderCon.variable(variable);
        return this;
    }

    public varVal(variable: Variable){
        this.builderCat.variableValue(variable);
        this.builderCon.variableValue(variable);
        return this;
    }

}