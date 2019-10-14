import {Xml} from "../xmlbuilder";
import {XmlFile} from "./xmlfile";

export class ContentTypeXml extends XmlFile{
    constructor(){
        super('[Content_Types].xml',
            new Xml('Types').attr('xmlns',"http://schemas.openxmlformats.org/package/2006/content-types"));

        this.default('rels', 'application/vnd.openxmlformats-package.relationships+xml');
        this.default('xml', 'application/xml');
        this.override("/word/document.xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml");
        this.override("/word/styles.xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml");
        this.override("/word/settings.xml","application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml");
        this.override("/word/webSettings.xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml");
        this.override("/word/fontTable.xml", "application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml");
        this.override("/word/theme/theme1.xml", "application/vnd.openxmlformats-officedocument.theme+xml");
        this.override("/docProps/core.xml", "application/vnd.openxmlformats-package.core-properties+xml");
        this.override("/docProps/app.xml", "application/vnd.openxmlformats-officedocument.extended-properties+xml");
    }

    private default(ext: string, type: string){
        this.root.child(new Xml('Default')
            .attr('Extension', ext)
            .attr('ContentType', type));
    }

    private override(part: string, type: string){
        this.root.child(new Xml('Override')
            .attr('PartName', part)
            .attr('ContentType', type));
    }
}