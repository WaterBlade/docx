import {Xml} from "../../xml";
import {Composite} from "./composite";
import {IComponent} from "../component";


export class MathInline extends Composite{
    public toXml(root: Xml){
        const math = new Xml('m:oMath');
        root.child(math);

        for (const item of this.components){
            item.toXml(math);
        }
    }
} 

export class Div extends Composite{
    constructor(protected left: IComponent, protected right: IComponent, protected type: string='bar'){
        super();
    }

    public toXml(root: Xml){
        const num = new Xml('m:num');
        const den = new Xml('m:den');

        this.left.toXml(num);
        this.right.toXml(den);

        root
        .child(
            new Xml('m:fPr').child(new Xml('m:type').attr('m:val', this.type)),
            num,
            den
        );
    }
}


export class Delimeter extends Composite{
    constructor(protected expression: IComponent, protected delimeter?:{left?:string, right?:string}){
        super();
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
            item.toXml(e);
        }
    }
}