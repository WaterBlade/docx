import {Xml, Composite} from "../../xml";


export class Catalog extends Composite{
    public toXml(root: Xml){
        root.push(
            new Xml('w:p').push(
                new Xml('w:pPr').push(new Xml('w:jc').attr('w:val', 'center')),
                new Xml('w:r').push(
                    new Xml('w:rPr').push(new Xml('w:b'), new Xml('w:sz').attr('w:val', 32)),
                    new Xml('w:t').text('目录')
                )
            )
        );

        for (const item of this.xmlBuilders){
            item.toXml(root);
        }

        root.push(
            new Xml('w:p').push(new Xml('w:r').push(new Xml('w:fldChar').attr('w:fldCharType', 'end'))),
            new Xml('w:p').push(
                new Xml('w:pPr').push(
                    new Xml('w:sectPr').push(
                        new Xml('w:pgSz').attr('w:w', 11906).attr('w:h', 16838),
                        new Xml('w:pgMar').attr('w:top', 1440).attr('w:right', 1800)
                        .attr('w:bottom', 1440).attr('w:left', 1800)
                        .attr('w:footer', 992).attr('w:gutter', 0),
                        new Xml('w:cols').attr('w:space', 425),
                        new Xml('w:docGrid').attr('w:type', 'lines').attr('w:linePitch', 312)
                    )
                )
            )
        );
    }
}