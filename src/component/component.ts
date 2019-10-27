import {Xml} from "../xml";


export interface IComponent{
    toXml(root: Xml):void;
}