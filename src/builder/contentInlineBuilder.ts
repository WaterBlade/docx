import {Builder} from "./builder";
import {DocX} from "./docX";

import { Text, } from "../component";
import { FootnoteBuilder } from "./footnoteBuilder";
import { MathInlineBuilder} from "./mathInline";
import { Equation, IQuantative, Var, Expression } from "./math";
import { Reference } from "./reference"
import { Composite } from "../xml";

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
        return new MathInlineBuilder(this.docx, this.composite);
    }

    public variable(variable: Var){
        this.mathBuilder().variable(variable);
        return this;
    }

    public expression(expression: Expression){
        this.mathBuilder().expression(expression);
    }

    public formula(variable: Var, expression: Expression){
        this.mathBuilder().formula(variable, expression);
        return this;
    }

    public equation(equation: Equation){
        this.mathBuilder().equation(equation);
        return this;
    }

    public variableValue(variable: Var){
        this.mathBuilder().variableValue(variable);
        return this;
    }

    public expressionValue(expression: Expression, result: Var){
        this.mathBuilder().expressionValue(expression, result);
        return this;
    }

    public formulaValue(variable: Var, expression: Expression){
        this.mathBuilder().formulaValue(variable, expression);
        return this;
    }

    public equationValue(equation: Equation, option: IQuantative={}){
        this.mathBuilder().equationValue(
            equation, option
        );
        return this;
    }
}