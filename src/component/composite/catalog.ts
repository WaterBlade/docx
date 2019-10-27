import {Xml} from "../../xml";
import {Composite} from "./composite";


export class Catalog extends Composite{
    public toXml(root: Xml){
        root
        .child(
            new Xml('w:p')
            .child(
                new Xml('w:pPr').child(new Xml('w:jc').attr('w:val', 'center')),
                new Xml('w:r')
                .child(
                    new Xml('w:rPr').child(new Xml('w:b'), new Xml('w:sz').attr('w:val', 32)),
                    new Xml('w:t').text('目录')
                )
            )
        );

        for (const item of this.components){
            item.toXml(root);
        }

        root
        .child(
            new Xml('w:p')
            .child(new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'end'))),
            new Xml('w:p')
            .child(
                new Xml('w:pPr')
                .child(
                    new Xml('w:sectPr')
                    .child(
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