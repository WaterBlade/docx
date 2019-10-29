import { IXml } from "../IXml";
import {Xml} from "../xml";

export class Container implements IXml{
    protected components: IXml[] = [];
    protected parent: Xml

    get length(){
        return this.components.length;
    }

    get last(){
        return this.components[this.length - 1];
    }

    constructor(parent: Xml){
        this.parent = parent;
    }

    public child(...items: IXml[]): Container{
        for (const i of items){this.components.push(i)}
        return this;
    }

    public toXml(root: Xml){
        root.child(this.parent)
        for (const item of this.components){
            item.toXml(this.parent);
        }
    }

}