import {Xml} from "../xmlbuilder";
import {XmlFile} from "./xmlfile";

export class ContentTypeXml extends XmlFile{
    constructor(){
        super('[Content_Types].xml',
            new Xml('Types')
                .attr('xmlns',"http://schemas.openxmlformats.org/package/2006/content-types")
                .child(new Xml('Default')
                    .attr('Extension', 'rels')
                    .attr('ContentType', "application/vnd.openxmlformats-package.relationships+xml"))
                .child(new Xml('Default')
                    .attr('Extension', 'xml')
                    .attr('ContentType', "application/xml"))
                .child(new Xml('Override')
                    .attr('PartName', "/word/document.xml")
                    .attr('ContentType', "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml")))

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