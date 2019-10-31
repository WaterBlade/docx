import { XmlObject } from "../xml";

export abstract class Root{
    protected xmlBuilders: XmlObject[] = [];

    public child(item: XmlObject){
        this.xmlBuilders.push(item);
    }

    abstract toString():string;

}