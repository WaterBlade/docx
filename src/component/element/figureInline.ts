import { Xml, XmlObject, E } from "../xml";
export class FigureInline extends XmlObject {
    constructor(
        private width: number,
        private height: number,
        private figId: number,
        private figName: string,
        private relIdSymbol: string
    ) {
        super();
    }
    toXml(root: Xml) {
        const width = Math.floor(this.width * 914400);
        const height = Math.floor(this.height*914400);
        root.push(
            E('w:r').push(
                E('w:drawing').push(
                    E('wp:inline').push(
                        E('wp:extent').attr('cx', width).attr('cy', height),
                        E('wp:effectExtent').attr('l', 0).attr('t', 0).attr('r', 0).attr('b', 0),
                        E('wp:docPr').attr('id', this.figId).attr('name', this.figName),
                        E('wp:cNvGraphicFramePr').push(
                            E('a:graphicFrameLocks').attr('xmlns:a', "http://schemas.openxmlformats.org/drawingml/2006/main").attr('noChangeAspect', 1)
                        ),
                        E('a:graphic').attr('xmlns:a', "http://schemas.openxmlformats.org/drawingml/2006/main").push(
                            E('a:graphicData').attr('uri', "http://schemas.openxmlformats.org/drawingml/2006/picture").push(
                                E('pic:pic').attr('xmlns:pic', "http://schemas.openxmlformats.org/drawingml/2006/picture").push(
                                    E('pic:nvPicPr').push(
                                        E('pic:cNvPr').attr('id', this.figId).attr('name', this.figName),
                                        E('pic:cNvPicPr')
                                    ),
                                    E('pic:blipFill').push(
                                        E('a:blip').attr('r:embed', this.relIdSymbol),
                                        E('a:stretch').push(E('a:fillRect'))
                                    ),
                                    E('pic:spPr').push(
                                        E('a:xfrm').push(
                                            E('a:off').attr('x', 0).attr('y', 0),
                                            E('a:ext').attr('cx', width).attr('cy', height)
                                        ),
                                        E('a:prstGeom').attr('prst', 'rect').push(
                                            E('a:avLst')
                                        )
                                    )
                                )
                            )
                        )

                    )
                )
            )
        )
    }
}