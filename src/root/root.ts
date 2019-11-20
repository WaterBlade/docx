import { XmlObject } from "../component/xml";

export abstract class Root{
    protected xmlBuilders: XmlObject[] = [];

    public push(item: XmlObject){
        this.xmlBuilders.push(item);
    }

    abstract toString():string;

}