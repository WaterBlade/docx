import {IXml} from "../IXml";

export abstract class Root{
    protected components: IXml[] = [];

    public child(item: IXml){
        this.components.push(item);
    }

    abstract toString():string;

}