import {Xml, E} from "../../xml";
import { MathPara } from "./math";
import { Bookmark } from "../element";

export class Definition extends MathPara{
    constructor(private bookmark: Bookmark){
        super();
    }

    public toXml(root: Xml){
        const mp = E('w:p').push(E('w:pPr').push(E('w:jc').attr('w:val', 'center')));
        super.toXml(mp);
        const bp = E('w:p').push(E('w:pPr').push(E('w:jc').attr('w:val', 'center')));
        this.bookmark.toXml(bp);
        root.push(
            E('w:tbl').push(
                E('w:tblPr').push(
                    E('w:jc').attr('w:val', 'center'),
                    E('w:tblLayout').attr('w:type', 'fixed')
                ),
                E('w:tblGrid').push(
                    E('w:gridCol').attr('w:w', 8000),
                    E('w:gridCol').attr('w:w', 1000)
                ),
                E('w:tr').push(
                    E('w:trPr').push(E('w:cantSplit'), E('w:jc').attr('w:val', 'center')),
                    E('w:tc').push(
                        E('w:tcPr').push(E('w:vAlign').attr('w:val', 'center')),
                        mp
                    ),
                    E('w:tc').push(
                        E('w:tcPr').push(E('w:vAlign').attr('w:val', 'center')),
                        bp
                    )
                )
            )
        )
    }


}