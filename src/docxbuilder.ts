import {Xml} from "./xmlbuilder";
import JSZip from "jszip";

interface IFile{
    path: string,
    content: string
}

export class DocXBuilder{
    private _docx: DocX = new DocX();
    private _currentBuilder?: Builder;

    private colseCurrentBuilder(){
        if(this._currentBuilder){
            this._currentBuilder.close();
        }
    }

    private switchBuilder(newBuilder: Builder){
        this.colseCurrentBuilder();
        this._currentBuilder = newBuilder;
    }

    public async buildBlob(){
        this.colseCurrentBuilder();

        return await this._docx.buildBlob();
    }

    public paragraph(text?: string): ParagraphBuilder{
        const b = new ParagraphBuilder(this._docx);
        this.switchBuilder(b);

        if(text){
            b.text(text);
        }

        return b
    }

    public heading(level : number = 1, text?: string){

        const b = new HeadingBuilder(this._docx, level);
        this.switchBuilder(b);

        if(text){
            b.text(text);
        }
        return b;
    }
}

class Builder{
    public close(){}
}

class ParagraphBuilder extends Builder{
    private _paragraph: Xml = new Xml('w:p');

    constructor(private _docx : DocX){
        super();
        this._docx.content.push(this._paragraph);
    }

    public text(str: string): ParagraphBuilder{

        this._paragraph.child(
            new Xml('w:r')
                .child(new Xml('w:t')
                    .text(str))
        );
        return this;
    }
}

class HeadingBuilder extends Builder{
    private _contentHeading: Xml = new Xml('w:p');
    private _catalogHeading: Xml = new Xml('w:hyperlink');
    private _markId: number;
    private _mark: string;

    constructor(private _docx: DocX, private _level: number){
        super();
        const cnt = this._contentHeading;
        const cat = new Xml('w:p');
        this._docx.content.push(cnt);
        this._docx.catalog.push(cat);

        this._markId = this._docx.markId;
        this._mark = `_Mark${this._markId}`

        cnt
        .child(
            new Xml('w:pPr')
            .child(
                new Xml('w:pStyle')
                .attr('w:val', this._level)
            ),
            new Xml('w:bookmarkStart')
            .attr('w:id', this._markId)
            .attr('w:name', this._mark)
        );

        if(this._level <= 3){
            cat
            .child(
                new Xml('w:pPr')
                .child(
                    new Xml('w:pStyle')
                    .attr('w:val', this._level*10),
                    new Xml('w:tabs')
                    .child(
                        new Xml('w:tab')
                        .attr('w:val', 'left')
                        .attr('w:pos', 420+630*(this._level-1)),
                        new Xml('w:tab')
                        .attr('w:val', 'right')
                        .attr('w:leader', 'dot')
                        .attr('w:pos', 7486)
                    ),
                    new Xml('w:rPr')
                    .child(
                        new Xml('w:noProof'),
                        new Xml('w:rStyle')
                        .attr('w:val', 'a3')
                    )
                )
            )

            if(this._docx.catalog.length === 1){
                cat
                .child(
                    new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'begin')),
                    new Xml('w:r').child(new Xml('w:instrText').text('TOC \\o "1-3" \\h \\z \\u')),
                    new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'separate'))
                )
            }

            cat
            .child(
                this._catalogHeading
                .attr('w:anchor', this._mark)
                .attr('w:history', 1)
                .child(
                    new Xml('w:r')
                    .child(
                        new Xml('w:t')
                        .text(this._docx.computeCatalogCode(this._level))
                    ),
                    new Xml('w:r').child(new Xml('w:tab'))
                )
            );
        }
    }

    public close(){
        const cnt = this._contentHeading;
        const cat = this._catalogHeading;

        cnt
        .child(
            new Xml('w:bookmarkEnd')
            .attr('w:id', this._markId)
        );

        if(this._level <= 3){
            cat
            .child(
                new Xml('w:r').child(new Xml('w:tab')),
                new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'begin')),
                new Xml('w:r').child(new Xml('w:instrText').attr('xml:space', 'preserve').text(` PAGEREF ${this._mark} \\h `)),
                new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'separate')),
                new Xml('w:r').child(new Xml('w:t').text(0)),
                new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'end'))
            );
        }
    }

    public text(str: string): HeadingBuilder{
        for (const h of [this._contentHeading, this._catalogHeading])
        {
            h
            .child(
                new Xml('w:r')
                .child(
                    new Xml('w:t').text(str)
                )
            )
        }
        return this;
    }
}

class DocX{

    public cover: Xml[]=[];
    public catalog: Xml[]=[];
    public content: Xml[] = [];

    public relationships = new Xml('Relationships');
    public body = new Xml('w:body');
    public document = new Xml('w:document');
    public footnotes = new Xml('w:footnotes');
    public header = new Xml('w:hdr');

    private _markId = 1;
    private _catalogCode: number[] = []

    public get markId(){
        const id = this._markId;
        this._markId += 1;
        return id;
    }

    public computeCatalogCode(level: number): string{
        const code = this._catalogCode;
        if(level > code.length){
            code.push(1);
        } else {
            code.splice(level-1, code.length-level+1);
            code[level-1] += 1;
        }
        return code.join('.');

    }

    public async buildBlob(){

        this.process_roots();
        const files = this.generate_files();

        const zip = new JSZip();
        for (let file of files){
            zip.file(file.path, file.content);
        }
        
        const blob = await zip.generateAsync({
            type:"blob",
            mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE"
        })

        return blob;
    }

    private process_roots(): void{

        //处理节点
        this.relationships
        .attr('xmlns', 'http://schemas.openxmlformats.org/package/2006/relationships')
        .child(new Xml('Relationship')
            .attr('Id', 'rId1')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme')
            .attr('Target', 'theme/theme1.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId2')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings')
            .attr('Target', 'webSettings.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId3')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable')
            .attr('Target', 'fontTable.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId4')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings')
            .attr('Target', 'settings.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId5')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles')
            .attr('Target', 'styles.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId6')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes')
            .attr('Target', 'endnotes.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId7')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes')
            .attr('Target', 'footnotes.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId8')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml')
            .attr('Target', '../customXml/item1.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId9')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering')
            .attr('Target', 'numbering.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId10')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer')
            .attr('Target', 'footer1.xml'))
        .child(new Xml('Relationship')
            .attr('Id', 'rId11')
            .attr('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header')
            .attr('Target', 'header1.xml'))
        

        this.document
        .child(this.body)
        .attr('xmlns:ve', 'http://schemas.openxmlformats.org/markup_compatibility/2006')
        .attr('xmlns:o', 'urn:schemas-microsoft-com:office:office')
        .attr('xmlns:r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        .attr('xmlns:m', 'http://schemas.openxmlformats.org/officeDocument/2006/math')
        .attr('xmlns:v', 'urn:schemas-microsoft-com:vml')
        .attr('xmlns:wp', 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing')
        .attr('xmlns:w10', 'urn:schemas-microsoft-com:office:word')
        .attr('xmlns:w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        .attr('xmlns:wne', 'http://schemas.microsoft.com/office/word/2006/wordml');

        this.footnotes
        .attr('xmlns:ve', 'http://schemas.openxmlformats.org/markup_compatibility/2006')
        .attr('xmlns:o', 'urn:schemas-microsoft-com:office:office')
        .attr('xmlns:r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        .attr('xmlns:m', 'http://schemas.openxmlformats.org/officeDocument/2006/math')
        .attr('xmlns:v', 'urn:schemas-microsoft-com:vml')
        .attr('xmlns:wp', 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing')
        .attr('xmlns:w10', 'urn:schemas-microsoft-com:office:word')
        .attr('xmlns:w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        .attr('xmlns:wne', 'http://schemas.microsoft.com/office/word/2006/wordml')
        .child(new Xml('w:footnote')
            .attr('w:type', 'separator')
            .attr('w:id', '0')
            .child(new Xml('w:p')
                .child(new Xml('w:r')
                    .child(new Xml('w:separator')))))
        .child(new Xml('w:footnote')
            .attr('w:type', 'continuationSeparator')
            .attr('w:id', '1')
            .child(new Xml('w:p')
                .child(new Xml('w:r')
                    .child(new Xml('w:continuationSeparator')))));
        

        this.header
        .attr('xmlns:ve', 'http://schemas.openxmlformats.org/markup_compatibility/2006')
        .attr('xmlns:o', 'urn:schemas-microsoft-com:office:office')
        .attr('xmlns:r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        .attr('xmlns:m', 'http://schemas.openxmlformats.org/officeDocument/2006/math')
        .attr('xmlns:v', 'urn:schemas-microsoft-com:vml')
        .attr('xmlns:wp', 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing')
        .attr('xmlns:w10', 'urn:schemas-microsoft-com:office:word')
        .attr('xmlns:w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        .attr('xmlns:wne', 'http://schemas.microsoft.com/office/word/2006/wordml');

        for(const item of this.cover){
            this.body.child(item);
        }
        // 目录部分
        if (this.catalog.length > 0){
            // 目录首部
            this.body
            .child(
                new Xml('w:p')
                .child(
                    new Xml('w:pPr').child(new Xml('w:jc').attr('w:val', 'center'))
                )
                .child(
                    new Xml('w:r')
                    .child(
                        new Xml('w:rPr').child(
                            new Xml('w:b'),
                            new Xml('w:sz').attr('w:val', 32)
                        )
                    )
                    .child(
                        new Xml('w:t').text('目录')
                    )
                )
            )
            // 目录中部
            for(const xml of this.catalog){
                this.body.child(xml);
            }
            // 目录尾部
            this.body
            .child(
                new Xml('w:p').child(new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'end')))
            )
            .child(
                new Xml('w:p')
                .child(
                    new Xml('w:pPr')
                    .child(
                        new Xml('w:sectPr')
                        .child(
                            new Xml('w:pgSz').attr('w:w', 11096).attr('w:h', 16838),
                            new Xml('w:pgMar')
                            .attr('w:top', 1440)
                            .attr('w:right', 1800)
                            .attr('w:bottom', 1440)
                            .attr('w:left', 1800)
                            .attr('w:footer', 992)
                            .attr('w:gutter', 0),
                            new Xml('w:cols').attr('w:space', 425),
                            new Xml('w:docGrid')
                            .attr('w:type', 'lines')
                            .attr('w:linePitch', 312)
                        )
                    )
                )
            )
        }
        // 正文部分
        for(const item of this.content){
            this.body.child(item);
            // 文档尾部
        }
        this.body
        .child(
            new Xml('w:sectPr')
            .child(
                new Xml('w:headerReference').attr('w:type', 'default').attr('r:id', 'rId11'),
                new Xml('w:footerReference').attr('w:type', 'default').attr('r:id', 'rId10'),
                new Xml('w:pgSz').attr('w:w', 11906).attr('w:h', 16838),
                new Xml('w:pgMar')
                .attr('w:top', 1440)
                .attr('w:right', 1800)
                .attr('w:bottom', 1440)
                .attr('w:left', 1800)
                .attr('w:footer', 992)
                .attr('w:gutter', 0),
                new Xml('w:pgNumType').attr('w:start', 1),
                new Xml('w:cols').attr('w:space', 425),
                new Xml('w:docGrid').attr('w:type', 'lines').attr('w:linePitch', 312) 
            )
        )

    }

    private generate_files(): IFile[]{

        // 生成文件
        return[{
            path: '[Content_Types].xml',
            content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Override PartName="/word/footnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml"/><Override PartName="/customXml/itemProps1.xml" ContentType="application/vnd.openxmlformats-officedocument.customXmlProperties+xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/endnotes.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/><Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`
        },
        {
            path: '_rels/.rels',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`
        },
        {
            path:'customXml/_rels/item1.xml.rels',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps" Target="itemProps1.xml"/></Relationships>`
        },
        {
            path:'customXml/item1.xml',
            content:`<b:Sources xmlns:b="http://schemas.openxmlformats.org/officeDocument/2006/bibliography" xmlns="http://schemas.openxmlformats.org/officeDocument/2006/bibliography" SelectedStyle="\\APA.XSL" StyleName="APA"/>`
        },
        {
            path:'customXml/itemProps1.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<ds:datastoreItem xmlns:ds="http://schemas.openxmlformats.org/officeDocument/2006/customXml" ds:itemID="{16CE1163-3A16-4C5A-834F-C1E16F9680D6}"><ds:schemaRefs><ds:schemaRef ds:uri="http://schemas.openxmlformats.org/officeDocument/2006/bibliography"/></ds:schemaRefs></ds:datastoreItem>`
        },
        {
            path:'docProps/app.xml',
            content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal.dotm</Template><TotalTime>0</TotalTime><Pages>1</Pages><Words>1</Words><Characters>12</Characters><Application>Microsoft Office Word</Application><DocSecurity>0</DocSecurity><Lines>1</Lines><Paragraphs>1</Paragraphs><ScaleCrop>false</ScaleCrop><Company></Company><LinksUpToDate>false</LinksUpToDate><CharactersWithSpaces>12</CharactersWithSpaces><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>12.0000</AppVersion></Properties>`
        },
        {
            path:'docProps/core.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Tao</dc:creator><cp:lastModifiedBy>HHPDI</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">2019-01-01T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2019-01-01T00:00:00Z</dcterms:modified></cp:coreProperties>`
        },
        {
            path:'word/_rels/document.xml.rels',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${this.relationships.toString()}`
        },
        {
            path:'word/theme/theme1.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office 主题"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ 明朝"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`
        },
        {
            path:'word/document.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${this.document.toString()}`
        },
        {
            path:'word/endnotes.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:endnotes xmlns:ve="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"><w:endnote w:type="separator" w:id="0"><w:p w:rsidR="00E93427" w:rsidRDefault="00E93427" w:rsidP="00C825F3"><w:r><w:separator/></w:r></w:p></w:endnote><w:endnote w:type="continuationSeparator" w:id="1"><w:p w:rsidR="00E93427" w:rsidRDefault="00E93427" w:rsidP="00C825F3"><w:r><w:continuationSeparator/></w:r></w:p></w:endnote></w:endnotes>`
        },
        {
            path:'word/fontTable.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:fonts xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/><w:sig w:usb0="E10002FF" w:usb1="4000ACFF" w:usb2="00000009" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="宋体"><w:altName w:val="SimSun"/><w:panose1 w:val="02010600030101010101"/><w:charset w:val="86"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="00000003" w:usb1="288F0000" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/></w:font><w:font w:name="Times New Roman"><w:panose1 w:val="02020603050405020304"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002AFF" w:usb1="C0007841" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Cambria"><w:panose1 w:val="02040503050406030204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="400004FF" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="楷体"><w:panose1 w:val="02010609060101010101"/><w:charset w:val="86"/><w:family w:val="modern"/><w:pitch w:val="fixed"/><w:sig w:usb0="800002BF" w:usb1="38CF7CFA" w:usb2="00000016" w:usb3="00000000" w:csb0="00040001" w:csb1="00000000"/></w:font><w:font w:name="Cambria Math"><w:panose1 w:val="02040503050406030204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="420024FF" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font></w:fonts>`
        },
        {
            path:'word/footer1.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:ftr xmlns:ve="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"><w:sdt><w:sdtPr><w:id w:val="23625823"/><w:docPartObj><w:docPartGallery w:val="Page Numbers (Bottom of Page)"/><w:docPartUnique/></w:docPartObj></w:sdtPr><w:sdtContent><w:p w:rsidR="003221F4" w:rsidRDefault="00A805B6"><w:pPr><w:pStyle w:val="a5"/><w:jc w:val="center"/></w:pPr><w:fldSimple w:instr=" PAGE   \* MERGEFORMAT "><w:r w:rsidR="006E593F" w:rsidRPr="006E593F"><w:rPr><w:noProof/><w:lang w:val="zh-CN"/></w:rPr><w:t>2</w:t></w:r></w:fldSimple></w:p></w:sdtContent></w:sdt><w:p w:rsidR="003221F4" w:rsidRDefault="003221F4"><w:pPr><w:pStyle w:val="a5"/></w:pPr></w:p></w:ftr>`
        },
        {
            path:'word/footnotes.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${this.footnotes.toString()}`
        },
        {
            path:'word/header1.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${this.header.toString()}`
        },
        {
            path:'word/numbering.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:numbering xmlns:ve="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"><w:abstractNum w:abstractNumId="0"><w:nsid w:val="5D861EAE"/><w:multiLevelType w:val="multilevel"/><w:tmpl w:val="04090025"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="1"/><w:lvlText w:val="%1"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="432" w:hanging="432"/></w:pPr></w:lvl><w:lvl w:ilvl="1"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="2"/><w:lvlText w:val="%1.%2"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="576" w:hanging="576"/></w:pPr></w:lvl><w:lvl w:ilvl="2"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="3"/><w:lvlText w:val="%1.%2.%3"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="720"/></w:pPr></w:lvl><w:lvl w:ilvl="3"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="4"/><w:lvlText w:val="%1.%2.%3.%4"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="864" w:hanging="864"/></w:pPr></w:lvl><w:lvl w:ilvl="4"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="5"/><w:lvlText w:val="%1.%2.%3.%4.%5"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="1008" w:hanging="1008"/></w:pPr></w:lvl><w:lvl w:ilvl="5"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="6"/><w:lvlText w:val="%1.%2.%3.%4.%5.%6"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="1152" w:hanging="1152"/></w:pPr></w:lvl><w:lvl w:ilvl="6"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="7"/><w:lvlText w:val="%1.%2.%3.%4.%5.%6.%7"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="1296" w:hanging="1296"/></w:pPr></w:lvl><w:lvl w:ilvl="7"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="8"/><w:lvlText w:val="%1.%2.%3.%4.%5.%6.%7.%8"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="1440" w:hanging="1440"/></w:pPr></w:lvl><w:lvl w:ilvl="8"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:pStyle w:val="9"/><w:lvlText w:val="%1.%2.%3.%4.%5.%6.%7.%8.%9"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="1584" w:hanging="1584"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`
        },
        {
            path:'word/settings.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:settings xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main"><w:zoom w:percent="160"/><w:bordersDoNotSurroundHeader/><w:bordersDoNotSurroundFooter/><w:defaultTabStop w:val="420"/><w:drawingGridVerticalSpacing w:val="156"/><w:displayHorizontalDrawingGridEvery w:val="0"/><w:displayVerticalDrawingGridEvery w:val="2"/><w:characterSpacingControl w:val="compressPunctuation"/><w:hdrShapeDefaults><o:shapedefaults v:ext="edit" spidmax="10242"/></w:hdrShapeDefaults><w:footnotePr><w:footnote w:id="0"/><w:footnote w:id="1"/></w:footnotePr><w:endnotePr><w:endnote w:id="0"/><w:endnote w:id="1"/></w:endnotePr><w:compat><w:spaceForUL/><w:balanceSingleByteDoubleByteWidth/><w:doNotLeaveBackslashAlone/><w:ulTrailSpace/><w:doNotExpandShiftReturn/><w:adjustLineHeightInTable/><w:useFELayout/></w:compat><w:rsids><w:rsidRoot w:val="003221F4"/><w:rsid w:val="0023729F"/><w:rsid w:val="003221F4"/><w:rsid w:val="00581F8C"/><w:rsid w:val="005B06A3"/><w:rsid w:val="00626EC2"/><w:rsid w:val="006A65DB"/><w:rsid w:val="006E593F"/><w:rsid w:val="00926F4A"/><w:rsid w:val="00971FF4"/><w:rsid w:val="00A805B6"/><w:rsid w:val="00C501FC"/><w:rsid w:val="00D637A7"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="600"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US" w:eastAsia="zh-CN"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/><w:shapeDefaults><o:shapedefaults v:ext="edit" spidmax="10242"/><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val="."/><w:listSeparator w:val=","/></w:settings>`
        },
        {
            path:'word/styles.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:styles xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorEastAsia" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:kern w:val="2"/><w:sz w:val="21"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="zh-CN" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault/></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="1" w:defUnhideWhenUsed="1" w:defQFormat="0" w:count="267"><w:lsdException w:name="Normal" w:semiHidden="0" w:uiPriority="0" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:semiHidden="0" w:uiPriority="9" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 2" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 3" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 4" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 5" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 6" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 7" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 8" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 9" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="toc 1" w:uiPriority="39"/><w:lsdException w:name="toc 2" w:uiPriority="39"/><w:lsdException w:name="toc 3" w:uiPriority="39"/><w:lsdException w:name="toc 4" w:uiPriority="39"/><w:lsdException w:name="toc 5" w:uiPriority="39"/><w:lsdException w:name="toc 6" w:uiPriority="39"/><w:lsdException w:name="toc 7" w:uiPriority="39"/><w:lsdException w:name="toc 8" w:uiPriority="39"/><w:lsdException w:name="toc 9" w:uiPriority="39"/><w:lsdException w:name="caption" w:uiPriority="35" w:qFormat="1"/><w:lsdException w:name="Title" w:semiHidden="0" w:uiPriority="10" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Default Paragraph Font" w:uiPriority="1"/><w:lsdException w:name="Subtitle" w:semiHidden="0" w:uiPriority="11" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Strong" w:semiHidden="0" w:uiPriority="22" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:semiHidden="0" w:uiPriority="20" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Table Grid" w:semiHidden="0" w:uiPriority="59" w:unhideWhenUsed="0"/><w:lsdException w:name="Placeholder Text" w:unhideWhenUsed="0"/><w:lsdException w:name="No Spacing" w:semiHidden="0" w:uiPriority="1" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/>
        <w:lsdException w:name="Medium Grid 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 1" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 1" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 1" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Revision" w:unhideWhenUsed="0"/><w:lsdException w:name="List Paragraph" w:semiHidden="0" w:uiPriority="34" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Quote" w:semiHidden="0" w:uiPriority="29" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:semiHidden="0" w:uiPriority="30" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 1" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 1" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 1" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 1" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 2" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 2" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 2" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 2" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/>
        <w:lsdException w:name="Dark List Accent 2" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 2" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 2" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 2" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 3" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 3" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 3" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 3" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 3" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 3" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 3" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 3" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 3" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 4" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 4" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 4" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 4" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 4" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 4" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 4" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 4" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 4" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 5" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/>
        <w:lsdException w:name="Light List Accent 5" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 5" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 5" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 5" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 5" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 5" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 5" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 5" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 6" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 6" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 6" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 6" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 6" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 6" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 6" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 6" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 6" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Emphasis" w:semiHidden="0" w:uiPriority="19" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:semiHidden="0" w:uiPriority="21" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:semiHidden="0" w:uiPriority="31" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:semiHidden="0" w:uiPriority="32" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Book Title" w:semiHidden="0" w:uiPriority="33" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:uiPriority="37"/>
        <w:lsdException w:name="TOC Heading" w:uiPriority="39" w:qFormat="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="a"><w:name w:val="Normal"/><w:qFormat/><w:rsid w:val="00971FF4"/><w:pPr><w:widowControl w:val="0"/><w:jc w:val="both"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="1"><w:name w:val="heading 1"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="1Char"/><w:uiPriority w:val="9"/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:numId w:val="1"/></w:numPr><w:spacing w:before="340" w:after="330" w:line="578" w:lineRule="auto"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:bCs/><w:kern w:val="44"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="2"><w:name w:val="heading 2"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="2Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="1"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="260" w:after="260" w:line="416" w:lineRule="auto"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="3"><w:name w:val="heading 3"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="3Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="2"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="260" w:after="260" w:line="416" w:lineRule="auto"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="4"><w:name w:val="heading 4"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="4Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="3"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="280" w:after="290" w:line="376" w:lineRule="auto"/><w:outlineLvl w:val="3"/></w:pPr><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="5"><w:name w:val="heading 5"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="5Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="4"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="280" w:after="290" w:line="376" w:lineRule="auto"/><w:outlineLvl w:val="4"/></w:pPr><w:rPr><w:b/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="6"><w:name w:val="heading 6"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="6Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="5"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="240" w:after="64" w:line="320" w:lineRule="auto"/><w:outlineLvl w:val="5"/></w:pPr><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/>
        <w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="7"><w:name w:val="heading 7"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="7Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="6"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="240" w:after="64" w:line="320" w:lineRule="auto"/><w:outlineLvl w:val="6"/></w:pPr><w:rPr><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="8"><w:name w:val="heading 8"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="8Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="7"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="240" w:after="64" w:line="320" w:lineRule="auto"/><w:outlineLvl w:val="7"/></w:pPr><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="9"><w:name w:val="heading 9"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="9Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:rsid w:val="003221F4"/><w:pPr><w:keepNext/><w:keepLines/><w:numPr><w:ilvl w:val="8"/><w:numId w:val="1"/></w:numPr><w:spacing w:before="240" w:after="64" w:line="320" w:lineRule="auto"/><w:outlineLvl w:val="8"/></w:pPr><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:szCs w:val="21"/></w:rPr></w:style><w:style w:type="character" w:default="1" w:styleId="a0"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="a1"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:qFormat/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="a2"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="character" w:customStyle="1" w:styleId="1Char"><w:name w:val="标题 1 Char"/><w:basedOn w:val="a0"/><w:link w:val="1"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:b/><w:bCs/><w:kern w:val="44"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="2Char"><w:name w:val="标题 2 Char"/><w:basedOn w:val="a0"/><w:link w:val="2"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="3Char"><w:name w:val="标题 3 Char"/><w:basedOn w:val="a0"/><w:link w:val="3"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="4Char"><w:name w:val="标题 4 Char"/><w:basedOn w:val="a0"/><w:link w:val="4"/>
        <w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="5Char"><w:name w:val="标题 5 Char"/><w:basedOn w:val="a0"/><w:link w:val="5"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:b/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="6Char"><w:name w:val="标题 6 Char"/><w:basedOn w:val="a0"/><w:link w:val="6"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="7Char"><w:name w:val="标题 7 Char"/><w:basedOn w:val="a0"/><w:link w:val="7"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:b/><w:bCs/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="8Char"><w:name w:val="标题 8 Char"/><w:basedOn w:val="a0"/><w:link w:val="8"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="9Char"><w:name w:val="标题 9 Char"/><w:basedOn w:val="a0"/><w:link w:val="9"/><w:uiPriority w:val="9"/><w:rsid w:val="003221F4"/><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsiaTheme="majorEastAsia" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:szCs w:val="21"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="10"><w:name w:val="toc 1"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:autoRedefine/><w:uiPriority w:val="39"/><w:unhideWhenUsed/><w:rsid w:val="003221F4"/></w:style><w:style w:type="paragraph" w:styleId="20"><w:name w:val="toc 2"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:autoRedefine/><w:uiPriority w:val="39"/><w:unhideWhenUsed/><w:rsid w:val="003221F4"/><w:pPr><w:ind w:leftChars="200" w:left="420"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="30"><w:name w:val="toc 3"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:autoRedefine/><w:uiPriority w:val="39"/><w:unhideWhenUsed/><w:rsid w:val="003221F4"/><w:pPr><w:ind w:leftChars="400" w:left="840"/></w:pPr></w:style><w:style w:type="character" w:styleId="a3"><w:name w:val="Hyperlink"/><w:basedOn w:val="a0"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="003221F4"/><w:rPr><w:color w:val="0000FF" w:themeColor="hyperlink"/><w:u w:val="single"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="a4"><w:name w:val="header"/><w:basedOn w:val="a"/><w:link w:val="Char"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:rsid w:val="003221F4"/><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="auto"/></w:pBdr><w:tabs><w:tab w:val="center" w:pos="4153"/><w:tab w:val="right" w:pos="8306"/></w:tabs><w:snapToGrid w:val="0"/><w:jc w:val="center"/></w:pPr><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Char"><w:name w:val="页眉 Char"/><w:basedOn w:val="a0"/><w:link w:val="a4"/>
        <w:uiPriority w:val="99"/><w:semiHidden/><w:rsid w:val="003221F4"/><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="a5"><w:name w:val="footer"/><w:basedOn w:val="a"/><w:link w:val="Char0"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rsid w:val="003221F4"/><w:pPr><w:tabs><w:tab w:val="center" w:pos="4153"/><w:tab w:val="right" w:pos="8306"/></w:tabs><w:snapToGrid w:val="0"/><w:jc w:val="left"/></w:pPr><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Char0"><w:name w:val="页脚 Char"/><w:basedOn w:val="a0"/><w:link w:val="a5"/><w:uiPriority w:val="99"/><w:rsid w:val="003221F4"/><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="a6"><w:name w:val="Title"/><w:basedOn w:val="a"/><w:next w:val="a"/><w:link w:val="Char1"/><w:uiPriority w:val="10"/><w:qFormat/><w:rsid w:val="00C501FC"/><w:pPr><w:spacing w:before="240" w:after="60"/><w:jc w:val="center"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsia="宋体" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Char1"><w:name w:val="标题 Char"/><w:basedOn w:val="a0"/><w:link w:val="a6"/><w:uiPriority w:val="10"/><w:rsid w:val="00C501FC"/><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:eastAsia="宋体" w:hAnsiTheme="majorHAnsi" w:cstheme="majorBidi"/><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="a7"><w:name w:val="Document Map"/><w:basedOn w:val="a"/><w:link w:val="Char2"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:rsid w:val="00581F8C"/><w:rPr><w:rFonts w:ascii="宋体" w:eastAsia="宋体"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Char2"><w:name w:val="文档结构图 Char"/><w:basedOn w:val="a0"/><w:link w:val="a7"/><w:uiPriority w:val="99"/><w:semiHidden/><w:rsid w:val="00581F8C"/><w:rPr><w:rFonts w:ascii="宋体" w:eastAsia="宋体"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="a8"><w:name w:val="Balloon Text"/><w:basedOn w:val="a"/><w:link w:val="Char3"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:rsid w:val="00581F8C"/><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Char3"><w:name w:val="批注框文本 Char"/><w:basedOn w:val="a0"/><w:link w:val="a8"/><w:uiPriority w:val="99"/><w:semiHidden/><w:rsid w:val="00581F8C"/><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="a9"><w:name w:val="footnote text"/><w:basedOn w:val="a"/><w:link w:val="Char4"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:rsid w:val="006E593F"/><w:pPr><w:snapToGrid w:val="0"/><w:jc w:val="left"/></w:pPr><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="character" w:customStyle="1" w:styleId="Char4"><w:name w:val="脚注文本 Char"/><w:basedOn w:val="a0"/><w:link w:val="a9"/><w:uiPriority w:val="99"/><w:semiHidden/><w:rsid w:val="006E593F"/><w:rPr><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:type="character" w:styleId="aa"><w:name w:val="footnote reference"/><w:basedOn w:val="a0"/>
        <w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:rsid w:val="006E593F"/><w:rPr><w:vertAlign w:val="superscript"/></w:rPr></w:style><w:style w:type="table" w:styleId="ab"><w:name w:val="Table Grid"/><w:basedOn w:val="a1"/><w:uiPriority w:val="59"/><w:rsid w:val="00D06FBB"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="000000" w:themeColor="text1"/><w:left w:val="single" w:sz="4" w:space="0" w:color="000000" w:themeColor="text1"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000" w:themeColor="text1"/><w:right w:val="single" w:sz="4" w:space="0" w:color="000000" w:themeColor="text1"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000" w:themeColor="text1"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000" w:themeColor="text1"/></w:tblBorders><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`
        },
        {
            path:'word/webSettings.xml',
            content:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:webSettings xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:optimizeForBrowser/></w:webSettings>`
        }];

    }
}