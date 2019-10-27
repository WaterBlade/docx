import {Xml} from "../xml";
import {Root} from "./root";

export class Footnotes extends Root{
    private footnote_id:number = 2;

    get FootnoteId(){
        const id = this.footnote_id;
        const symbol = `${id}`;
        this.footnote_id += 1;
        return {id, symbol};
    }
    
    public toString(): string{

        const footnotes = new Xml('w:footnotes');

        footnotes
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

        for(const item of this.components){
            item.toXml(footnotes);
        }

        return footnotes.toString();

    }
}