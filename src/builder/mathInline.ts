import {MathText, MathInline} from "../component";
import { Expression, Var, Equation, EqualSymbol, IQuantative, Formula} from "./math";
import { Composite } from "../xml";


export class MathInlineBuilder{
    private mathInline = new MathInline();
    constructor(private composite: Composite){
        this.composite.push(this.mathInline);
    }

    public equation(equation: Equation){
        this.mathInline.push(equation.toVar());
    }

    public formula(fml: Formula){
        this.mathInline.push(
            fml.Variable.toVar(),
            new MathText('=', {sty: 'p'}),
            fml.Expression.toVar()
        );
    }

    public expression(left: Expression){
        this.mathInline.push(left.toVar());
    }

    public variable(left: Var){
        this.mathInline.push(left.toVar());
    }

    public equationValue(equation: Equation, option: IQuantative={}){ 
        const left = equation.Left;
        const right = equation.Right;
        
        this.mathInline.push(left.toVar(), EqualSymbol)
        if(!(left instanceof Var)){
            this.mathInline.push(left.toNum(), EqualSymbol);
        }
        this.mathInline.push(
            left.toResult(option),
            equation.EqualitySymbol,
            right.toVar(),
            EqualSymbol
        );
        if(!(right instanceof Var)){
            this.mathInline.push(right.toNum(), EqualSymbol);
        }
        this.mathInline.push(right.toResult(option));

    }

    public formulaValue(fml: Formula){
        this.mathInline.push(
            fml.Variable.toVar(),
            new MathText('=', {sty:'p'}),
            fml.Expression.toVar(),
            new MathText('=', {sty:'p'}),
            fml.Expression.toNum(),
            new MathText('=', {sty:'p'}),
            fml.Variable.toResult()
        );
    }

    public expressionValue(left: Expression){
        this.mathInline.push(
            left.toVar(),
            new MathText('=', {sty:'p'}),
            left.toNum(),
            new MathText('=', {sty: 'p'}),
            left.toResult()
        )
    }

    public variableValue(left: Var){
        this.mathInline.push(
            left.toVar(),
            new MathText('=', {sty: 'p'}),
            left.toResult()
        )
    }
}