import { MulMathInline, MathInline, Declaration } from "../../component";

class MathContent<T>{
    private items: T[];
    constructor(...items: T[]){this.items = items;}

    get Contents(){
        return this.items;
    }

    public push(...items: T[]){
        this.items.push(...items);
        return this;
    }

    public merge(...contents: MathContent<T>[]){
        for (const c of contents){
            this.items.push(...c.items);
        }
        return this;
    }
}

export class DefinitionContent extends MathContent<MathInline|MulMathInline>{}

export class ProcedureContent extends MathContent<MathInline|MulMathInline>{}

export class DeclarationContent extends MathContent<Declaration>{}
