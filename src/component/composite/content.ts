import {Xml, Composite} from "../../xml";


export class Content extends Composite{
    constructor(
        private headerRelSymbol: string,
        private footerRelSymbol: string 
    ){super()}

    public toXml(root: Xml){
        for(const item of this.xmlBuilders){
            item.toXml(root);
        }

        root.push(
            new Xml('w:sectPr').push(
                new Xml('w:headerReference').attr('w:type', 'default').attr('r:id', this.headerRelSymbol),
                new Xml('w:footerReference').attr('w:type', 'default').attr('r:id', this.footerRelSymbol),
                new Xml('w:pgSz').attr('w:w', 11906).attr('w:h', 16838),
                new Xml('w:pgMar').attr('w:top', 1440).attr('w:right', 1800)
                .attr('w:bottom', 1440).attr('w:left', 1800)
                .attr('w:footer', 992).attr('w:gutter', 0),
                new Xml('w:pgNumType').attr('w:start', 1),
                new Xml('w:cols').attr('w:space', 425),
                new Xml('w:docGrid').attr('w:type', 'lines').attr('w:linePitch', 312)
            )
        );

    }
}