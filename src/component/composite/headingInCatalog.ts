import {Xml} from "../../xml";
import {Composite} from "./composite";

export class HeadingInCatalog extends Composite{
    constructor(
        private level: number,
        private id: number,
        private symbol: string,
        private code: string,
        private isFirst: boolean=false,
    ){super()}

    public toXml(root: Xml): void{
        const para = new Xml('w:p');
        root.child(para);

        para
        .child(
            new Xml('w:pPr')
            .child(
                new Xml('w:pStyle').attr('w:val', this.level*10),
                new Xml('w:tabs')
                .child(
                    new Xml('w:tab').attr('w:val', 'left').attr('w:pos', 420+630*(this.level-1)),
                    new Xml('w:tab').attr('w:val', 'right').attr('w:leader', 'dot').attr('w:pos', 8296)
                ),
                new Xml('w:rPr')
                .child(
                    new Xml('w:noProof')
                    .child(
                        new Xml('w:rStyle').attr('w:val', 'a3')
                    )
                )
            )
        );

        if(this.isFirst){
            para
            .child(
                new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'begin')),
                new Xml('w:r').child(new Xml('w:instrText').text('TOC \\o "1-3" \\h \\z \\u')),
                new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'separate'))
            );
        }

        const link = new Xml('w:hyperlink');
        para.child(link);

        link
        .child(
            new Xml('w:r').child(new Xml('w:t').text(this.code)),
            new Xml('w:r').child(new Xml('w:tab'))
        );

        for(const item of this.components){
            item.toXml(link);
        }

        link
        .child(
            new Xml('w:r').child(new Xml('w:tab')),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'begin')),
            new Xml('w:r').child(new Xml('w:instrText').attr('xml:space', 'preserve').text(` PAGEREF ${this.symbol} \\h`)),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'separate')),
            new Xml('w:r').child(new Xml('w:t').text(0)),
            new Xml('w:r').child(new Xml('w:fldChar').attr('w:fldCharType', 'end'))
        );
    }
}