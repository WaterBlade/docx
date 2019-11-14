import { Variable } from "./variable";
import { Expression} from "./expression";
import { MathInline, MulMathInline, EqArr, MathText, Delimeter } from "../../component";
import { Relation } from "./relation";
import { Composite } from "../../xml";

// Formula
export class Formula {
    protected long: boolean = false;
    protected symbol: string = '=';
    constructor(protected variable: Variable, protected expression: Expression) { }
    public calc() {
        this.variable.Value = this.expression.Value;
        return this.variable.Value;
    }

    public setLong() {
        this.long = true;
        return this;
    }

    public toInlineDefinition() {
        return new Composite(
            this.variable.toVar(),
            new MathText(this.symbol, { sty: 'p' }),
            this.expression.toVar()
        )
    }

    public toDefinition() {
        return new MathInline(
            this.variable.toVar(),
            new MathText(this.symbol, { sty: 'p', align: true }),
            this.expression.toVar()
        )
    }

    public toInlineProcedure() {
        return new Composite(
            this.variable.toVar(),
            new MathText(this.symbol, { sty: 'p' }),
            this.expression.toVar(),
            new MathText('=', { sty: 'p' }),
            this.expression.toNum(),
            new MathText('=', { sty: 'p' }),
            this.variable.toResult()
        )

    }

    public toProcedure() {
        if (this.long) {
            return new MulMathInline(
                new MathInline(
                    this.variable.toVar(),
                    new MathText(this.symbol, { sty: 'p', align: true }),
                    this.expression.toVar()
                ),
                new MathInline(
                    new MathText(this.symbol, { sty: 'p', align: true }),
                    this.expression.toNum()
                ),
                new MathInline(
                    new MathText(this.symbol, { sty: 'p', align: true }),
                    this.variable.toResult()
                )
            )
        } else {
            return new MathInline(
                this.variable.toVar(),
                new MathText(this.symbol, { sty: 'p', align: true }),
                this.expression.toVar(),
                new MathText('=', { sty: 'p' }),
                this.expression.toNum(),
                new MathText('=', { sty: 'p' }),
                this.variable.toResult()
            )
        }

    }

}

class GTFormula extends Formula{
    protected symbol = '>';
}

class GEFormula extends Formula{
    protected symbol = '≥';
}

class LTFormula extends Formula{
    protected symbol = '<';
}

class LEFormula extends Formula{
    protected symbol = '≤';
}


export class ConditionFormula extends Formula {
    protected combines: Array<[Relation, Expression]>
    constructor(variable: Variable, ...combines: Array<[Relation, Expression]>) {
        super(variable, combines[0][1]);
        this.combines = combines;
    }

    public calc() {
        for (const [equ, exp] of this.combines) {
            if (equ.calc()) {
                this.expression = exp;
                break;
            }
        }
        return super.calc();
    }

    public toDefinition() {
        const array = new EqArr();
        for (const [equ, exp] of this.combines) {
            array.push(
                new Composite(
                    exp.toVar(),
                    new MathText(', '),
                    equ.toInlineDefinition()
                )
            )

        }
        return new MathInline(
            this.variable.toVar(),
            new MathText(this.symbol, { sty: 'p', align: true }),
            new Delimeter(array, { left: '{' })
        )
    }

}

export function formula(variable: Variable, expression: Expression) {
    return new Formula(variable, expression);
}

export function condition(variable: Variable, ...combines: Array<[Relation, Expression]>) {
    return new ConditionFormula(variable, ...combines);
}

export function gtFormula(variable: Variable, expression: Expression){
    return new GTFormula(variable, expression);
}
export function geFormula(variable: Variable, expression: Expression){
    return new GEFormula(variable, expression);
}
export function ltFormula(variable: Variable, expression: Expression){
    return new LTFormula(variable, expression);
}
export function leFormula(variable: Variable, expression: Expression){
    return new LEFormula(variable, expression);
}