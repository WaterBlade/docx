import { XmlObject } from "../component/xml";

export abstract class Root{
    protected xmlBuilders: XmlObject[] = [];

    public child(item: XmlObject){
        this.xmlBuilders.push(item);
    }

    abstract toString():string;

}