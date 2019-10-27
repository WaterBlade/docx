import {Xml} from "../xml";
import {IComponent} from "../component";

export abstract class Root{
    protected components: IComponent[] = [];

    public child(item: IComponent){
        this.components.push(item);
    }

    abstract toString():string;

}