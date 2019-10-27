import {Xml} from "../xml";
import {Root} from "./root";


export class Relationships extends Root{
    private rel_id: number = 0;

    get RelationshipId(){
        const id = this.rel_id;
        const symbol = `rId${id}`;
        this.rel_id += 1;
        return {id, symbol};
    }

    get FooterRelationshipId(){
        return {id: 10, symbol: 'rId10'};
    }

    get HeaderRelationshipId(){
        return {id: 11, symbol: 'rId11'};
    }

    public toString(): string{
        const relationships = new Xml('Relationships');
        
        relationships
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

        for (const item of this.components){
            item.toXml(relationships);
        }

        return relationships.toString();
    }
}