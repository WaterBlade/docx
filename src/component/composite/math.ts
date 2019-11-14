import {Xml, XmlObject, E, XmlObjectComposite} from "../xml";
import { MathText } from "../element";


abstract class MathObject extends XmlObject{
    abstract toXml(root: Xml): void;
}

abstract class MathComposite extends MathObject{
    protected xmlBuilders: MathObject[]=[];

    public constructor(...builders: MathObject[]){
        super();
        this.xmlBuilders = builders;
    }
    
    public push(item: MathObject){
        this.xmlBuilders.push(item)
    }

    public toXml(root: Xml){
        root.build(...this.xmlBuilders);
    }
}


export class MathInline extends XmlObjectComposite<MathObject>{
    public toXml(root: Xml){
        root.push(
            E('m:oMath').build(...this.xmlBuilders)
        )
    }
} 


export class MulMathInline extends XmlObjectComposite<MathInline>{
    public toXml(root: Xml){
        for(let i = 0; i< this.Length; i++){
            root.build(this.xmlBuilders[i]);
            if(i < this.Length - 1){
                root.push(E('w:r').push(E('w:br')));
            }
        }
    }
}


export class MathPara extends XmlObjectComposite<MathInline|MulMathInline>{
    public toXml(root: Xml){
        const mpara = root.newChild('m:oMathPara');

        for(let i = 0; i < this.Length; i++){
            mpara.build(this.xmlBuilders[i]);
            if(i < this.Length-1){
                mpara.push(E('w:r').push(E('w:br')));
            }
        }
    }
}


export class Div extends MathObject{
    constructor(protected left: XmlObject, protected right: XmlObject, protected type: string='bar'){
        super();
    }

    public toXml(root: Xml){
        root.push(
            E('m:f').push(
                E('m:fPr').push(E('m:type').attr('m:val', this.type)),
                E('m:num').build(this.left),
                E('m:den').build(this.right))
        );
    }
}


export class SubSup extends MathObject{
    constructor(protected base: XmlObject, protected sub: XmlObject, protected sup: XmlObject){
        super();
    }

    public toXml(root: Xml){
        root.push(
            E('m:sSubSup').push(
                E('m:e').build(this.base),
                E('m:sub').build(this.sub),
                E('m:sup').build(this.sup)
            )
        )
    }
}


export class SubSript extends MathObject{
    constructor(protected base: XmlObject, protected sub: XmlObject){
        super();
    }

    public toSubSup(sup: XmlObject){
        return new SubSup(this.base, this.sub, sup);
    }

    public toXml(root: Xml){
        root.push(
            E('m:sSub').push(
                E('m:e').build(this.base),
                E('m:sub').build(this.sub)
            )
        )
    }
}

export class SupSript extends MathObject{
    constructor(protected base: XmlObject, protected sup: XmlObject){
        super();
    }

    public toXml(root: Xml){
        root.push(
            E('m:sSup').push(
                E('m:e').build(this.base),
                E('m:sup').build(this.sup)
            )
        )
    }
}


export class Rad extends MathObject{
    constructor(protected index: XmlObject, protected base: XmlObject, protected hasIndex = true){
        super();
    }

    public toXml(root: Xml){
        root.push(
            E('m:rad').push(
                this.hasIndex ? 
                E('m:deg').build(this.index) : 
                E('m:radPr').push(E('m:degHide').attr('m:val', 'on')),
                E('m:e').build(this.base)
            )
        )
    }
}


export class Delimeter extends MathObject{
    constructor(protected expression: XmlObject, protected delimeter:{left?:string, right?:string}={}){
        super();
    }

    public toXml(root: Xml){
        let {left , right} = this.delimeter;
        left = left ? left : '';
        right = right ? right: '';
        root.push(
            E('m:d').push(
                E('m:dPr').push(
                    E('m:begChr').attr('m:val', left) ,
                    E('m:endChr').attr('m:val', right) 
                ),
                E('m:e').build(this.expression)
            )
        )
    }
}


export class Func extends MathObject{
    constructor(protected name: string, protected expression: XmlObject){
        super();
    }

    public toXml(root: Xml){
        root.push(
            E('m:func').push(
                E('m:fName').build(new MathText(this.name, {sty: 'p'})),
                E('m:e').build(new Delimeter(this.expression, {left: '(', right: ')'}))
            )
        )
    }
}


export class NArray extends MathObject{
    constructor(protected base: XmlObject, protected feature: {
        name?: string, sub?: XmlObject, sup?: XmlObject, 
    }={}){
        super();
    }

    public toXml(root: Xml){
        const {name, sub, sup } = this.feature

        root.push(
            E('m:nary').push(
                E('m:naryPr').push(
                    name ? E('m:chr').attr('m:val', name) : null,
                    sub ? null : E('m:subHide').attr('m:val', 'on'),
                    sup ? null : E('m:supHide').attr('m:val', 'on'),
                    E('m:ctrlPr').push(E('w:rPr').push(E('w:i'))),
                ),
                sub ? E('m:sub').build(sub) : null,
                sup ? E('m:sup').build(sup) : null,
                E('m:e').build(this.base),
            )
        )
    }
}

export class EqArr extends MathComposite{
    constructor( ...eqArray: MathObject[]){
        super(...eqArray);
    }

    public toXml(root: Xml){
        root.push(
            E('m:eqArr').push(
                ...this.xmlBuilders.map(m => E('m:e').build(m))
            )
        )
    }
}