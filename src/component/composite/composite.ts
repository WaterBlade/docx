import { IXml } from "../../IXml";
import {Xml} from "../../xml";

export class Composite implements IXml{
    protected components: IXml[] = [];

    get length(){
        return this.components.length;
    }

    constructor(...items: IXml[]){
        this.components = items;
    }

    public child(...items: IXml[]): Composite{
        for (const i of items){this.components.push(i)}
        return this;
    }

    public toXml(root: Xml){
        for (const item of this.components){
            item.toXml(root);
        }
    }

}