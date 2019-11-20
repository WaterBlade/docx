import { Builder } from "./builder";
import { DocX } from "../root";
import { Relationship, FigureInline, Title, Paragraph } from "../component";
import { Reference } from "./reference";
import { TitleBuilder } from "./titleBuilder";

export class FigureBuilder extends Builder{
    titleXml = new Title();
    titleBuilder: TitleBuilder;
    constructor(public docx: DocX, ref?: Reference){
        super();
        // 生成标题
        this.titleBuilder = new TitleBuilder(this.docx, this.titleXml);
        // 标题添加引用
        if (ref) {
            this.titleXml.push(ref.generateMark(this.docx));
            ref.Type = '图';
        } else {
            this.titleXml.push(new Reference('图').generateMark(this.docx));
        }
    }
    public title(str: string){
        this.titleBuilder.text(str);
        return this;
    }
    public figure(blobData: Blob, width: number, height: number){
        const figId = this.docx.images.length + 1;
        const figName = `image${figId}.png`
        // image file in docx
        this.docx.images.push(
            {
                path: `media/${figName}`,
                blob: blobData
            }
        );
        // rels
        const relIdSymbol = this.docx.RelationshipId.symbol;
        this.docx.relationships.push(
            new Relationship(
                relIdSymbol,
                'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image',
                `media/${figName}`
            )
        );
        // content in docx
        const p = new Paragraph()
        p.push( new FigureInline(width, height, figId, figName, relIdSymbol));
        p.Justify = 'center';
        p.KeepNext = true;
        this.docx.content.push(p, this.titleXml);
        return this;
    }
}