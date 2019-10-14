import {Xml} from "../xmlbuilder";
import {XmlFile} from "./xmlfile";

export class CoreXml extends XmlFile{
    constructor(){
        super('docProps/core.xml',
        new Xml('cp:coreProperties')
        .attr('xmlns:cp', 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties')
        .attr('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
        .attr('xmlns:dcterms', 'http://purl.org/dc/terms/')
        .attr('xmlns:dcmitype', 'http://purl.org/dc/dcmitype/')
        .attr('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        .child(new Xml('dc:title'))
        .child(new Xml('dc:subject'))
        .child(new Xml('dc:creator'))
        .child(new Xml('cp:keywords'))
        .child(new Xml('dc:description'))
        .child(new Xml('cp:lastModifiedBy'))
        .child(new Xml('cp:revision'))
        .child(new Xml('dcterms:created').attr('xsi:type', 'dcterms:W3CDTF'))
        .child(new Xml('dcterms:modified').attr('xsi:type', 'dcterms:W3CDTF')));

    }
}