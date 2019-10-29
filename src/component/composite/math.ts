import {Xml} from "../../xml";
import {Composite} from "./composite";
import { IXml } from "../../IXml";
import { MathText } from "../element";


export class MathInline extends Composite{
    public toXml(root: Xml){
        const math = new Xml('m:oMath');
        root.child(math);

        for (const item of this.components){
            item.toXml(math);
        }
    }
} 


export class MathPara extends Composite{
    protected components: MathInline[] =[];

    constructor(...items: MathInline[]){
        super(...items);
    }

    public child(...items: MathInline[]){
        for(const item of items){
            this.components.push(item);
        }
        return this;
    }

    public toXml(root: Xml){
        const m = new Xml('m:oMathPara');
        root.child(new Xml('w:p').child(m));

        for(let i = 0; i < this.components.length; i++){
            const item = this.components[i];
            item.toXml(m);
            if(i < this.components.length-1){
                m.child(new Xml('w:r').child(new Xml('w:br')));
            }
        }
    }
}

export class Div extends Composite{
    constructor(protected left: IXml, protected right: IXml, protected type: string='bar'){
        super();
    }

    public toXml(root: Xml){
        const num = new Xml('m:num');
        const den = new Xml('m:den');

        this.left.toXml(num);
        this.right.toXml(den);

        root
            .child(
                new Xml('m:f').child(
                    new Xml('m:fPr').child(new Xml('m:type').attr('m:val', this.type)),
                    num,
                    den)
            );
    }
}


export class SubSup extends Composite{
    constructor(protected base: IXml, protected sub: IXml, protected sup: IXml){
        super();
    }

    public toXml(root: Xml){
        const base = new Xml('m:e');
        this.base.toXml(base);
        const sub = new Xml('m:sub');
        const sup = new Xml('m:sup');
        this.sub.toXml(sub);
        this.sup.toXml(sup);
        root.child(new Xml('m:sSubSup').child(base).child(sub).child(sup));

    }

}


export class SubSript extends Composite{
    constructor(protected base: IXml, protected sub: IXml){
        super();
    }

    public toSubSup(sup: IXml){
        return new SubSup(this.base, this.sub, sup);
    }

    public toXml(root: Xml){
        const base = new Xml('m:e');
        const sub = new Xml('m:sub');
        this.base.toXml(base);
        this.sub.toXml(sub);
        root.child(new Xml('m:sSub').child(base).child(sub));
    }
}

export class SupSript extends Composite{
    constructor(protected base: IXml, protected sup: IXml){
        super();
    }

    public toXml(root: Xml){
        const base = new Xml('m:e');
        const sup = new Xml('m:sup');
        this.base.toXml(base);
        this.sup.toXml(sup);
        root.child(new Xml('m:sSup').child(base).child(sup));
    }
}


export class Rad extends Composite{
    constructor(protected index: IXml, protected base: IXml, protected hasIndex = true){
        super();
    }

    public toXml(root: Xml){
        const rad = new Xml('m:rad');
        root.child(rad);

        if(this.hasIndex){
            const index = new Xml('m:deg');
            this.index.toXml(index);
            rad.child(index);
        } else {
            rad.child(new Xml('m:radPr').child(new Xml('m:degHide').attr('m:val', 'on')));
        }

        const base = new Xml('m:e')
        this.base.toXml(base);
        rad.child(base);
    }
}


export class Delimeter extends Composite{
    constructor(protected expression: IXml, protected delimeter?:{left?:string, right?:string}){
        super(expression);
    }

    public toXml(root: Xml){
        const d = new Xml('m:d');
        root.child(d);

        const prop = new Xml('m:dPr');
        d.child(prop);

        if(this.delimeter){
            if(this.delimeter.left){
                prop.child(new Xml('m:begChr').attr('m:val', this.delimeter.left));
            }
            if(this.delimeter.right){
                prop.child(new Xml('m:endChr').attr('m:val', this.delimeter.right));

            }
        }

        for(const item of this.components){
            const e = new Xml('m:e');
            d.child(e);
            item.toXml(e);
        }
    }
}


export class Func extends Composite{
    constructor(protected name: string, protected expression: IXml){
        super();
    }

    public toXml(root: Xml){
        const name = new Xml('m:fName');
        const expression = new Xml('m:e');
        new MathText(this.name, {sty: 'p'}).toXml(name);
        new Delimeter(this.expression, {left:'(', right:')'}).toXml(expression);
        root.child(new Xml('m:func').child(name).child(expression));

    }
}


export class NArray extends Composite{
    constructor(protected base: IXml, protected feature: {
        name?: string, sub?: IXml, sup?: IXml, limLoc?: string
    }={}){
        super();
    }

    public toXml(root: Xml){
        const nary = new Xml('m:nary');
        root.child(nary);
        const prop = new Xml('m:naryPr');
        nary.child(prop);

        const {name, sub, sup, limLoc} = this.feature

        if(name){
            prop.child(new Xml('m:chr').attr('m:val', name));
        }
        if(sub){
            const subexp = new Xml('m:sub');
            sub.toXml(subexp);
            nary.child(subexp);
        } else {
            prop.child(new Xml('m:subHide').attr('m:val', 'on'));
        }
        if(sup){
            const supexp = new Xml('m:sup');
            sup.toXml(supexp);
            nary.child(supexp);
        } else {
            prop.child(new Xml('m:supHide').attr('m:val', 'on'));
        }
        prop.child(new Xml('m:ctrlPr').child(new Xml('w:rPr').child(new Xml('w:i'))));

        const e = new Xml('m:e');
        this.base.toXml(e);
        nary.child(e);
    }
}

export class EqArr extends Composite{
    constructor(protected includedSide: {left?: boolean, right?: boolean}={}, ...eqArray: IXml[]){
        super(...eqArray);
    }

    public toXml(root: Xml){
        const arr = new Xml('m:eqArr');

        for (const item of this.components){
            const e = new Xml('m:e');
            arr.child(e);
            item.toXml(e);
        }

        const { left, right } = this.includedSide;

        if(left || right){
            const leftChr = left ? '{' : '';
            const rightChr = right ? '' : '}';

            root.child(new Xml('m:d').child(
                new Xml('m:dPr')
                .child(
                    new Xml('m:begChr').attr('m:val', leftChr),
                    new Xml('m:endChr').attr('m:val', rightChr)
                ),
                new Xml('m:e').child(arr)
            ))

        } else {
            root.child(arr);
        }
    }
}