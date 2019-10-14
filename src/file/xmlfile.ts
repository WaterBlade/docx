import {File} from "./file";
import {Xml} from "../xmlbuilder";


export class XmlFile extends File{
    constructor(path: string, protected root: Xml, public statement: boolean=true){
        super(path);
    }
}