import {Builder} from "./builder";
import {DocX} from "./docX";

import {Paragraph, Text } from "../component";
import { FootnoteBuilder } from "./footnoteBuilder";
import { Variable, Expression, EInquality } from "./math";
import { MathInlineBuilder} from "./mathInline";

export class ParagraphBuilder extends Builder{
    private paragraph = new Paragraph();

    constructor(private docx : DocX){
        super();
        this.docx.content.child(this.paragraph);
    }

    public text(str: string): ParagraphBuilder{
        this.paragraph.child(new Text(str))
        return this;
    }

    public footnoteBuilder(){
        return new FootnoteBuilder(this.docx, this.paragraph);
    }

    public footnote(str: string){
        this.footnoteBuilder().text(str);
        return this;
    }

    public mathBuilder(){
        return new MathInlineBuilder(this.docx, this.paragraph);
    }

    public variable(variable: Variable){
        this.mathBuilder().variable(variable);
        return this;
    }

    public expression(expression: Expression){
        this.mathBuilder().expression(expression);
    }

    public formula(variable: Variable, expression: Expression){
        this.mathBuilder().formula(variable, expression);
        return this;
    }

    public equation(left: Expression, right: Expression, oper?: EInquality){
        this.mathBuilder().equation(left, right, oper);
        return this;
    }

    public variableValue(variable: Variable){
        this.mathBuilder().variableValue(variable);
        return this;
    }

    public expressionValue(expression: Expression, result: Variable){
        this.mathBuilder().expressionValue(expression, result);
        return this;
    }

    public formulaValue(variable: Variable, expression: Expression){
        this.mathBuilder().formulaValue(variable, expression);
        return this;
    }

    public equationValue(
        left: Expression, lResult: Variable,
        right: Expression, rResult: Variable,
        testMode: EInquality, tolerance: number=0.001
    ){
        this.mathBuilder().equationValue(
            left, lResult, right, rResult, testMode, tolerance
        );
        return this;
    }
}