import {Xml} from "../xmlbuilder";

export class File{
    constructor(public path: string){}

    public pack(){}
}

export class XmlFile extends File{
    protected root? : Xml;
    constructor(path: string, public statement: boolean=true){
        super(path);
    }
}