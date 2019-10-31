import {Builder} from "./builder";
import { DocX } from "./docX";
import { Var } from "./math";
import { Paragraph, Text } from "../component";

export class MathDeclarationBuilder extends Builder{
    constructor(protected docx: DocX){
        super();
        this.docx.content.push(new Paragraph().push(new Text('式中：')));
    }

    public declare(variable: Var){
        this.docx.content.push(variable.Declaration)
    }
}