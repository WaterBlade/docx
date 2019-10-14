import {Xml} from "../xmlbuilder";
import {XmlFile} from "./xmlfile";
import {Relationship} from "../relationship/relationship";

export class Rels extends XmlFile{
    private relationships: Relationship[]=[];

    constructor(){
        super('_rels/.rels',
        new Xml('Relationships')
        .attr('xmlns', 'http://schemas.openxmlformats.org/package/2006/relationships')
        );

        this.relationships.concat(
            new Relationship(
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
                "docProps/app.xml"
            ),

            new Relationship(
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/core-properties",
                "docProps/core.xml"
            ),

            new Relationship(
                "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
                "word/document.xml"
            )
        )

    }

    public prepareForPack(){

        for (let i = 1; i < this.relationships.length; i++){
            let rel = this.relationships[i];
            rel.setId(i);
            this.root.child(rel.getXml());
        }

    }
}