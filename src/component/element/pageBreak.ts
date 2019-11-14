import {Xml, E, XmlObject} from "../xml";


export class PageBreak extends XmlObject{
    toXml(root: Xml){
        root.push(E('w:p').push(E('w:r').push(E('w:br').attr('w:type', 'page'))))
    }
}