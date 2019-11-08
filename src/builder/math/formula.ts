import { Variable } from "./variable";
import { Expression, AlignEqualSymbol, EqualSymbol } from "./expression";
import { MathInline, MulMathInline, EqArr, MathText, Delimeter } from "/component";
import { Equation } from "./equation";
import { Composite } from "/xml";
import { DefinitionContent, ProcedureContent } from "./content";

// Formula
export class Formula {
    protected long: boolean = false;
    constructor(protected variable: Variable, protected expression: Expression) { }
    get Variable() {
        return this.variable;
    }
    get Expression() {
        return this.expression;
    }

    public setLong() {
        this.long = true;
        return this;
    }

    public toInlineDefinition(){
        return new Composite(
            this.variable.toVar(),
            EqualSymbol,
            this.expression.toVar()
        )
    }

    public toDefinition() {
        return new MathInline(
            this.variable.toVar(),
            AlignEqualSymbol,
            this.expression.toVar()
        )
    }

    public toDefCnt(){
        return new DefinitionContent(this.toDefinition());
    }

    public toInlineProcedure() {
        return new Composite(
            this.variable.toVar(),
            EqualSymbol,
            this.expression.toVar(),
            EqualSymbol,
            this.expression.toNum(),
            EqualSymbol,
            this.variable.toResult()
        )

    }

    public toProcedure() {
        if (this.long) {
            return new MulMathInline(
                new MathInline(
                    this.variable.toVar(),
                    AlignEqualSymbol,
                    this.expression.toVar()
                ),
                new MathInline(
                    AlignEqualSymbol,
                    this.expression.toNum()
                ),
                new MathInline(
                    AlignEqualSymbol,
                    this.variable.toResult()
                )
            )
        } else {
            return new MathInline(
                this.variable.toVar(),
                AlignEqualSymbol,
                this.expression.toVar(),
                EqualSymbol,
                this.expression.toNum(),
                EqualSymbol,
                this.variable.toResult()
            )
        }

    }

    public toProcCnt(){
        return new ProcedureContent(this.toProcedure());
    }
}

export class ConditionFormula extends Formula {
    protected combines: Array<[Equation, Expression]>
    constructor(variable: Variable, ...combines: Array<[Equation, Expression]>) {
        super(variable, combines[0][1]);
        this.combines = combines;
    }

    public toDefinition() {
        const array = new EqArr();
        for(const [equ, exp] of this.combines){
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
            AlignEqualSymbol,
            new Delimeter(array, { left: '{' })
        )
    }

    public toProcedure(){
        for(const [equ, exp] of this.combines){
            if(equ.calc()){
                this.expression = exp;
                break;
            }
        }
        return super.toProcedure();
    }
}

export function formula(variable: Variable, expression: Expression){
    return new Formula(variable, expression);
}

export function condition(variable: Variable,...combines: Array<[Equation, Expression]>){
    return new ConditionFormula(variable, ...combines);
}
