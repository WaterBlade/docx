import {IComponent} from "../component";
import {Xml} from "../../xml";

export class Composite implements IComponent{
    protected components: IComponent[] = [];

    public child(item: IComponent): Composite{
        this.components.push(item);
        return this;
    }

    public toXml(root: Xml){}
}