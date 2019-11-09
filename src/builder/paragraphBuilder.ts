import {Builder} from "./builder";
import {DocX} from "./docX";

import {Paragraph} from "../component";
import { Expression } from "./math/expression";
import { Formula } from "./math/formula";
import { Equation } from "./math/equation";
import { Variable } from "./math/variable";
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

    public t(str: string) {
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

    public var(variable: Variable){
        this.mathBuilder().variable(variable);
        return this;
    }

    public exp(expression: Expression){
        this.mathBuilder().expression(expression);
        return this;
    }

    public formula(fml: Formula){
        this.mathBuilder().formula(fml);
        return this;
    }

    public equation(equation: Equation){
        this.mathBuilder().equation(equation);
        return this;
    }

    public varVal(variable: Variable){
        this.mathBuilder().variableValue(variable);
        return this;
    }

    public expVal(expression: Expression){
        this.mathBuilder().expressionValue(expression);
        return this;
    }

    public formulaVal(fml: Formula){
        this.mathBuilder().formulaValue(fml);
        return this;
    }

    public equationVal(equation: Equation ){
        this.mathBuilder().equationValue(
            equation
        );
        return this;
    }
}