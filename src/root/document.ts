import {Xml} from "../component/xml";
import {Root} from "./root";

export class Document extends Root{
    public toString():string{
        const document = new Xml('w:document');
        const body = new Xml('w:body');

        document
        .push(body)
        .attr('xmlns:ve', 'http://schemas.openxmlformats.org/markup_compatibility/2006')
        .attr('xmlns:o', 'urn:schemas-microsoft-com:office:office')
        .attr('xmlns:r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships')
        .attr('xmlns:m', 'http://schemas.openxmlformats.org/officeDocument/2006/math')
        .attr('xmlns:v', 'urn:schemas-microsoft-com:vml')
        .attr('xmlns:wp', 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing')
        .attr('xmlns:w10', 'urn:schemas-microsoft-com:office:word')
        .attr('xmlns:w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        .attr('xmlns:wne', 'http://schemas.microsoft.com/office/word/2006/wordml');

        for(const item of this.xmlBuilders){
            item.toXml(body);
        }

        return document.toString();
    }

}