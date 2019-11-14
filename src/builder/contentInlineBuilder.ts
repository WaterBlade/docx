import {Builder} from "./builder";
import {DocX} from "../component/docX";

import { Text, } from "../component";
import { FootnoteBuilder } from "./footnoteBuilder";
import { MathInlineBuilder} from "./mathInlineBuilder";
import { Expression } from "./math/expression";
import { Formula } from "./math/formula";
import { Relation } from "./math/relation";
import { Variable } from "./math/variable";
import { Reference } from "./reference"
import { Composite } from "../component/xml";

export class ContentInlineBuilder extends Builder{
    private composite = new Composite();

    constructor(private docx : DocX, private parentBuilder: Composite){
        super();
        this.parentBuilder.push(this.composite);
    }

    public text(str: string){
        this.composite.push(new Text(str))
        return this;
    }

    public footnoteBuilder(){
        return new FootnoteBuilder(this.docx, this.composite);
    }

    public footnote(str: string){
        this.footnoteBuilder().text(str);
        return this;
    }

    public reference(ref: Reference){
        this.composite.push(ref.Ref);
        return this;
    }

    public bookmark(ref: Reference){
        this.composite.push(ref.generateMark(this.docx));
        return this;
    }

    public mathBuilder(){
        return new MathInlineBuilder(this.composite);
    }

    public variable(variable: Variable){
        this.mathBuilder().variable(variable);
        return this;
    }

    public expression(expression: Expression){
        this.mathBuilder().expression(expression);
    }

    public formula(fml: Formula){
        this.mathBuilder().formula(fml);
        return this;
    }

    public equation(equation: Relation){
        this.mathBuilder().equation(equation);
        return this;
    }

    public variableValue(variable: Variable){
        this.mathBuilder().variableValue(variable);
        return this;
    }

    public expressionValue(expression: Expression){
        this.mathBuilder().expressionValue(expression);
        return this;
    }

    public formulaValue(fml: Formula){
        this.mathBuilder().formulaValue(fml);
        return this;
    }

    public equationValue(equation: Relation){
        this.mathBuilder().equationValue(
            equation
        );
        return this;
    }
}