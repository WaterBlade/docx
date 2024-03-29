import { MathInline, MulMathInline, MathText} from "../../component";
import { Expression, AlignEqualSymbol, EqualSymbol } from "./expression";
import { Composite } from "../../component/xml";
import { Variable, Num } from "./variable";
//
// Equation
// 
export abstract class Relation {
    protected original: string = '=';
    protected oppsite: string = '≠';
    protected leftLong: boolean = false;
    protected rightLong: boolean = false;
    protected unit_?: Expression;
    protected value: boolean = true;

    constructor(protected left: Expression, protected right: Expression, protected tolerance: number = 0.0001) {
    }
    public abstract calc(): boolean;
    public unit(unit: Expression | undefined) {
        this.unit_ = unit;
        return this;
    }
    get Left(){
        return this.left;
    }
    get Right(){
        return this.right;
    }
    public setLeftLong(){
        this.leftLong = true;
        return this;
    }
    public setRightLong(){
        this.rightLong = true;
        return this;
    }
    public toInlineDefinition() {
        return new Composite(this.left.toVar(), new MathText(this.original, { sty: 'p' }), this.right.toVar())
    }
    public toDefinition() {
        return new MathInline(this.left.toVar(), AlignEqualSymbol, this.right.toVar());
    }
    protected toItemProcedure(item: Expression, symbol: MathText) {
        const left = new Composite();
        if (item instanceof Num) {
            left.push(item.toVar());
        } else if (item instanceof Variable) {
            left.push(item.toVar(), symbol, item.toResult());
        } else {
            left.push(item.toVar(), symbol, item.toNum(), EqualSymbol, item.toResult());
        }
        return left;
    }
    public toInlineProcedure() {
        let sybmol = this.value ? this.original : this.oppsite;
        const equation = new Composite();
        equation.push(
            this.toItemProcedure(this.left, EqualSymbol),
            new MathText(sybmol, { sty: 'p' }),
            this.toItemProcedure(this.right, EqualSymbol)
        );
        return equation;

    }
    public toProcedure() {
        let symbol = this.value ? this.original : this.oppsite;
        if (this.leftLong || this.rightLong) {
            const mline = new MulMathInline();
            if(this.leftLong){
                mline.push(
                    new MathInline(this.left.toVar()),
                    new MathInline(AlignEqualSymbol, this.left.toNum()),
                    new MathInline(AlignEqualSymbol, this.left.toResult())
                )
            }else{
                mline.push(new MathInline(this.toItemProcedure(this.left, EqualSymbol)));
            }
            mline.push(
                new MathInline( new MathText(symbol, { sty: 'p', align: true }))
            );
            if(this.rightLong){
                mline.push(
                    new MathInline(this.right.toVar()),
                    new MathInline(AlignEqualSymbol, this.right.toNum()),
                    new MathInline(AlignEqualSymbol, this.right.toResult())
                )
            }else{
                mline.push(new MathInline(this.toItemProcedure(this.right, EqualSymbol)));
            }
            return mline;

        } else {
            const equation = new MathInline();
            equation.push(
                this.toItemProcedure(this.left, EqualSymbol),
                new MathText(symbol, { sty: 'p', align: true }),
                this.toItemProcedure(this.right, EqualSymbol)
            );
            return equation;
        }
    }
}
class Equal extends Relation {
    public calc() {
        this.value = Math.abs(this.left.Value - this.right.Value) < this.tolerance;
        return this.value;
    }
}
class NotEqual extends Relation {
    protected original = '≠';
    protected oppsite = '=';
    public calc() {
        this.value = Math.abs(this.left.Value - this.right.Value) > this.tolerance;
        return this.value;
    }
}
class Greater extends Relation {
    protected original = '>';
    protected oppsite = '≤';
    public calc() {
        this.value = this.left.Value > this.right.Value;
        return this.value;
    }
}
class GreaterOrEqual extends Relation {
    protected original = '≥';
    protected oppsite = '<';
    public calc() {
        this.value = this.left.Value >= this.right.Value;
        return this.value;
    }
}
class Lesser extends Relation {
    protected original = '<';
    protected oppsite = '≥';
    public calc() {
        this.value = this.left.Value < this.right.Value;
        return this.value;
    }
}
class LesserOrEqual extends Relation {
    protected original = '≤';
    protected oppsite = '>';
    public calc() {
        this.value = this.left.Value <= this.right.Value;
        return this.value;
    }
}
class RangeRelation extends Relation {
    protected leftTest: boolean;
    protected rightTest: boolean;
    constructor(left: number, protected expression: Expression, right: number) {
        super(new Num(left), new Num(right));
    }
    public calc() {
        this.leftTest = this.expression.Value > this.left.Value;
        this.rightTest = this.expression.Value < this.right.Value;
        this.value = this.leftTest && this.rightTest
        return this.value;
    }

    public toInlineDefinition() {
        return new Composite(
            this.left.toVar(),
            new MathText('<', { sty: 'p' }),
            this.expression.toVar(),
            new MathText('<', { sty: 'p' }),
            this.right.toVar())
    }

    public toDefinition() {
        return new MathInline(this.toInlineDefinition());
    }

    public toInlineProcedure() {
        const equation = new Composite();
        if (this.value) {
            equation.push(
                this.toItemProcedure(this.left, EqualSymbol),
                new MathText('<', { sty: 'p' }),
                this.toItemProcedure(this.expression, EqualSymbol),
                new MathText('<', { sty: 'p' }),
                this.toItemProcedure(this.right, EqualSymbol)
            );
        } else if (this.leftTest){
            equation.push(
                this.toItemProcedure(this.expression, EqualSymbol),
                new MathText('>', {sty: 'p'}),
                this.toItemProcedure(this.right, EqualSymbol)
            )
        } else {
            equation.push(
                this.toItemProcedure(this.left, EqualSymbol),
                new MathText('>', {sty: 'p'}),
                this.toItemProcedure(this.expression, EqualSymbol)
            )
        }
        return equation;
    }
    public toProcedure() {
        return new MathInline(this.toInlineProcedure());
    }
}
export function GT(left: Expression, right: Expression) {
    return new Greater(left, right);
}
export function GE(left: Expression, right: Expression) {
    return new GreaterOrEqual(left, right);
}
export function EQ(left: Expression, right: Expression) {
    return new Equal(left, right);
}
export function NE(left: Expression, right: Expression) {
    return new NotEqual(left, right);
}
export function LT(left: Expression, right: Expression) {
    return new Lesser(left, right);
}
export function LE(left: Expression, right: Expression) {
    return new LesserOrEqual(left, right);
}
export function RN(left: number, exp: Expression, right: number) {
    return new RangeRelation(left, exp, right);
}
