import {MathText, Composite, Paragraph, MathInline} from "../component";
import { DocX } from "./docX";
import { Expression, Var, Equation, EqualSymbol, IQuantative} from "./math";


export class MathInlineBuilder{
    private mathInline = new MathInline();
    constructor(private docx: DocX, private paragraph: Paragraph){
        this.paragraph.child(this.mathInline);
    }

    public equation(equation: Equation){
        this.mathInline.child(equation.toVar());
    }

    public formula(left: Var, right: Expression){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty: 'p'}),
            right.toVar()
        );
    }

    public expression(left: Expression){
        this.mathInline.child(left.toVar());
    }

    public variable(left: Var){
        this.mathInline.child(left.toVar());
    }

    public equationValue(equation: Equation, option: IQuantative={}){ 
        const left = equation.Left;
        const right = equation.Right;
        
        this.mathInline.child(left.toVar(), EqualSymbol)
        if(!(left instanceof Var)){
            this.mathInline.child(left.toNum(), EqualSymbol);
        }
        this.mathInline.child(
            left.toResult(option),
            equation.EqualitySymbol,
            right.toVar(),
            EqualSymbol
        );
        if(!(right instanceof Var)){
            this.mathInline.child(right.toNum(), EqualSymbol);
        }
        this.mathInline.child(right.toResult(option));

    }

    public formulaValue(left: Var, right: Expression){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty:'p'}),
            right.toVar(),
            new MathText('=', {sty:'p'}),
            right.toNum(),
            new MathText('=', {sty:'p'}),
            left.toResult()
        );
    }

    public expressionValue(left: Expression, right: Var){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty:'p'}),
            left.toNum(),
            new MathText('=', {sty: 'p'}),
            right.toResult()
        )
    }

    public variableValue(left: Var){
        this.mathInline.child(
            left.toVar(),
            new MathText('=', {sty: 'p'}),
            left.toResult()
        )
    }
}