import {Xml, E, Composite} from "../../xml";

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
        root.push(para);

        para.push(
            E('w:pPr').push(
                E('w:pStyle').attr('w:val', this.level*10),
                E('w:tabs').push(
                    E('w:tab').attr('w:val', 'left').attr('w:pos', 420+630*(this.level-1)),
                    E('w:tab').attr('w:val', 'right').attr('w:leader', 'dot').attr('w:pos', 8296)
                ),
                E('w:rPr').push(
                    E('w:noProof').push(
                        E('w:rStyle').attr('w:val', 'a3')
                    )
                )
            )
        );

        if(this.isFirst){
            para.push(
                E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'begin')),
                E('w:r').push(E('w:instrText').text('TOC \\o "1-3" \\h \\z \\u')),
                E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'separate'))
            );
        }

        const link = E('w:hyperlink');
        para.push(link);

        link.push(
            E('w:r').push(E('w:t').text(this.code)),
            E('w:r').push(E('w:tab'))
        );

        for(const item of this.xmlBuilders){
            item.toXml(link);
        }

        link.push(
            E('w:r').push(E('w:tab')),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'begin')),
            E('w:r').push(E('w:instrText').attr('xml:space', 'preserve').text(` PAGEREF ${this.symbol} \\h`)),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'separate')),
            E('w:r').push(E('w:t').text(0)),
            E('w:r').push(E('w:fldChar').attr('w:fldCharType', 'end'))
        );
    }
}