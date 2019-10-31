import {Builder} from "./builder";
import {DocX} from "./docX";

import {Paragraph} from "../component";
import { Equation, IQuantative, Var, Expression } from "./math";
import { Reference } from "./reference"
import { ContentInlineBuilder } from "./contentInlineBuilder";

export class ParagraphBuilder extends Builder{
    private builder :ContentInlineBuilder;

    constructor(private docx : DocX){
        super();
        const para = new Paragraph();

        para.Spacing = {before: 0, after: 0, line: 360};
        para.IndentChar = 2;

        this.docx.content.push(para);
        this.builder = new ContentInlineBuilder(this.docx, para);
    }

    public text(str: string) {
        this.builder.text(str);
        return this;
    }

    public footnoteBuilder(){
        return this.builder.footnoteBuilder();
    }

    public footnote(str: string){
        this.footnoteBuilder().text(str);
        return this;
    }

    public reference(ref: Reference){
        this.builder.reference(ref);
        return this;
    }

    public bookmark(ref: Reference){
        this.builder.bookmark(ref);
        return this;
    }

    public mathBuilder(){
        return this.builder.mathBuilder();
    }

    public variable(variable: Var){
        this.mathBuilder().variable(variable);
        return this;
    }

    public expression(expression: Expression){
        this.mathBuilder().expression(expression);
        return this;
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