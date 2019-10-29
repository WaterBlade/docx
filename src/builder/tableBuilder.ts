import {Builder} from "./builder";
import {DocX} from "./docX";


export class TableBuilder extends Builder{
    constructor(protected docx: DocX){
        super();
    }
}