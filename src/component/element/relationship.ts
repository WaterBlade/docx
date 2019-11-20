import {Xml, E, XmlObject} from "../xml";
export class Relationship extends XmlObject{
    constructor(
        private relSymbol: string,
        private type: string,
        private target: string
    ){super();}
    toXml(root: Xml){
        root.push(
            E('Relationship')
            .attr('Id', this.relSymbol)
            .attr('Type', this.type)
            .attr('Target', this.target)
        )
    }
}