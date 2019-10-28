import {MathText, Composite, IComponent, Paragraph, MathInline} from "../component";
import { DocX } from "./docX";
import {EInquality, Expression, Variable} from "./math";


export class MathInlineBuilder{
    private mathInline = new MathInline();
    constructor(private docx: DocX, private paragraph: Paragraph){
        this.paragraph.child(this.mathInline);
    }

    public equation(left: Expression, right: Expression, operator?: EInquality){
        let oper = '=';
        switch(operator){
            case EInquality.Lesser: oper = '<'; break;
            case EInquality.LesserOrEqual: oper = '≤'; break;
            case EInquality.NotEqual: oper = '≠'; break;
            case EInquality.Greater: oper = '>'; break;
            case EInquality.GreaterOrEqual: oper = '≥'; break;
        };
    
        this.mathInline.child(
            left.toVar(),
            new MathText(oper, {sty: 'p'}),
            right.toVar()
        )
    }

    public formula(left: Variable, right: Expression){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty: 'p'}),
            right.toVar()
        );
    }

    public expression(left: Expression){
        this.mathInline.child(left.toVar());
    }

    public variable(left: Variable){
        this.mathInline.child(left.toVar());
    }

    public equationValue(
        left: Expression, leftVariable: Variable,
        right: Expression, rightVariable: Variable,
        testMode: EInquality, tolerance: number=0.001
    ){
        if(leftVariable.value !== undefined && rightVariable.value !== undefined){
            const delta = leftVariable.value - rightVariable.value;

            let oper = '';
            switch(testMode){
                case EInquality.Lesser:
                    oper = delta < 0 ? '<' : '≥' ; 
                    break;
                case EInquality.LesserOrEqual:
                    oper = delta <= 0 ? '≤' : '>' ;
                    break;
                case EInquality.Equal:
                case EInquality.NotEqual:
                    oper = delta * delta < tolerance * tolerance ? '=' : '≠';
                    break;
                case EInquality.Greater:
                    oper = delta > 0 ? '>' : '≤';
                    break;
                case EInquality.GreaterOrEqual:
                    oper = delta >= 0 ? '≥' : '<';
                    break; 
            }

            this.mathInline
            .child(
                left.toVar(),
                new MathText('=', {sty: 'p'}),
                leftVariable.toNum(),
                new MathText(oper, {sty: 'p'}),
                right.toVar(),
                rightVariable.toNum()
            );
        } else {
            throw Error(`Unasigned Variable: ${leftVariable} or ${rightVariable}`);
        }

    }

    public formulaValue(left: Variable, right: Expression){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty:'p'}),
            right.toVar(),
            new MathText('=', {sty:'p'}),
            right.toNum(),
            new MathText('=', {sty:'p'}),
            left.toNum()
        );
    }

    public expressionValue(left: Expression, right: Variable){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty:'p'}),
            left.toNum(),
            new MathText('=', {sty: 'p'}),
            right.toNum()
        )
    }

    public variableValue(left: Variable){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty: 'p'}),
            left.toNum()
        )
    }
}