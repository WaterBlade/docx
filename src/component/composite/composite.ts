import {IComponent} from "../component";
import {Xml} from "../../xml";

export class Composite implements IComponent{
    protected components: IComponent[] = [];

    constructor(...items: IComponent[]){
        this.components = items;
    }

    public child(...items: IComponent[]): Composite{
        for (const i of items){this.components.push(i)}
        return this;
    }

    public toXml(root: Xml){
        for (const item of this.components){
            item.toXml(root);
        }
    }

}