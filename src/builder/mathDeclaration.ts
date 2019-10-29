import {Builder} from "./builder";
import {Xml} from "../xml";
import { DocX } from "./docX";


export class MathDeclarationBuilder extends Builder{
    protected paragraph = new Xml('w:p')

    constructor(protected docx: DocX){
        super();
    }



}