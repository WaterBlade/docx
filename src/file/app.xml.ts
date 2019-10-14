import {Xml} from "../xmlbuilder";
import {XmlFile} from "./xmlfile";

export class AppXml extends XmlFile{
    constructor(){
        super('docProps/app.xml',
        new Xml('Properties')
        .attr('xmlns', 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties')
        .attr('xmlns:vt', 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes')
        .child(new Xml('Template').text('Normal.dotm'))
        .child(new Xml('TotalTime').text(0))
        .child(new Xml('Pages').text(1))
        .child(new Xml('Words').text(1))
        .child(new Xml('Characters').text(1))
        .child(new Xml('Application').text('Microsoft Office Word'))
        .child(new Xml('DocSecurity').text(0))
        .child(new Xml('Lines').text(1))
        .child(new Xml('Paragraphs').text(1))
        .child(new Xml('ScaleCrop').text(false))
        .child(new Xml('Company'))
        .child(new Xml('LinksUpToDate').text(false))
        .child(new Xml('CharactersWithSpaces').text(40))
        .child(new Xml('SharedDoc').text(false))
        .child(new Xml('HyperlinksChanged').text(false))
        .child(new Xml('AppVersion').text('15.0000')));

    }
}
