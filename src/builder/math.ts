import {MathText, Composite, IComponent, Paragraph, MathInline,
        Div as DivComp, Delimeter} from "../component";
import { DocX } from "./docX";

export enum EInquality{
    Lesser,
    LesserOrEqual,
    Equal,
    NotEqual,
    Greater,
    GreaterOrEqual
}

const Level1Precedence = 1;
const Level2Precedence = 2;
const Level3Precedence = 3
const TopPrecedence = 10;


export abstract class Expression{
    constructor(protected precedence: number){}

    get Precedence(){
        return this.precedence;
    }

    public abstract toVar(): IComponent;

    public abstract toNum(): IComponent;

    public add(right: Expression){
        return new Add(this, right);
    }

    public sub(right: Expression){
        return new Sub(this, right);
    }

    public mul(right: Expression){
        return new Mul(this, right);
    }

    public div(right: Expression){
        return new Div(this, right);
    }

    public flatDiv(right: Expression){
        return new FlatDiv(this, right);
    }
}

export class Variable extends Expression{
    public value?: number;
    constructor(
        protected name: string, 
        protected feature?: {
            inform?: string ; 
            unit?: Expression;
            format?: {(num: number): string} 
        }
    ){super(TopPrecedence);}

    public toVar(){
        return new MathText(this.name);
    }

    public toNum(){
        if (!this.value){ throw Error(`Variable ${this.name} has not been assigned.`);}
        
        let num : string | number = this.value;
        if (this.feature && this.feature.format){
            num = this.feature.format(this.value);
        }
        return new MathText(num);
    }
}


class BiOperator extends Expression{
    protected numOperator: string
    constructor(
        protected left: Expression, protected right: Expression, 
        protected precedence: number,
        protected operator: string, numOperator?: string
    ){
        super(precedence);
        if(left.Precedence < this.precedence){
            this.left = new Parenthesis(this.left);
        }
        if(right.Precedence < this.Precedence){
            this.right = new Parenthesis(this.right);
        }

        this.numOperator = this.operator;
        if(numOperator){
            this.numOperator = numOperator;
        }
    }

    public toVar(){
        return new Composite(
            this.left.toVar(), 
            new MathText(this.operator, {sty:'p'}),
            this.right.toVar()
        )
    }

    public toNum(){
        return new Composite(
            this.left.toNum(), 
            new MathText(this.numOperator, {sty:'p'}),
            this.right.toNum()
        )
    }
}

class Add extends BiOperator{
    constructor(left: Expression, right: Expression){
        super(left, right, Level1Precedence, '+');
    }
}

class Sub extends BiOperator{
    constructor(left: Expression, right: Expression){
        super(left, right, Level1Precedence , '-');
    }
}

class Mul extends BiOperator{
    constructor(left: Expression, right: Expression){
        super(left, right, Level2Precedence, '⋅', '×');
    }
}


class Div extends Expression{
    constructor(protected left: Expression, protected right:Expression){
        super(Level2Precedence);
    }

    public toVar(){
        return new DivComp(this.left.toVar(), this.right.toVar())
    }

    public toNum(){
        return new DivComp(this.left.toNum(), this.right.toNum());
    }
}


class FlatDiv extends Expression{
    constructor(protected left: Expression, protected right: Expression){
        super(Level2Precedence);
        if(left.Precedence < this.precedence){
            this.left = new Parenthesis(this.left);
        }
        if(right.Precedence < this.Precedence){
            this.right = new Parenthesis(this.right);
        }
    }

    public toVar(){
        return new DivComp(this.left.toVar(), this.right.toVar(), 'lin');
    }

    public toNum(){
        return new DivComp(this.left.toNum(), this.right.toNum(), 'lin');

    }
}


class Parenthesis extends Expression{
    constructor(protected expression: Expression){super(TopPrecedence)}

    public toVar(){
        return new Delimeter(this.expression.toVar(), {left:'(', right:')'});
    }

    public toNum(){
        return new Delimeter(this.expression.toNum(), {left: '(', right:')'});
    }
}