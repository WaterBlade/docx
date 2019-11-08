import { MathText, SubSript, } from "../../component";
import { XmlObject, Composite } from "../../xml";

export const Level1Precedence = 1;
export const Level2Precedence = 2;
export const Level3Precedence = 3
export const TopPrecedence = 10;


export const EqualSymbol = new MathText('=', { sty: 'p' });
export const AlignEqualSymbol = new MathText('=', { sty: 'p', align: true });

export abstract class Expression {
    protected unit_?: Expression;
    protected precision: number = 3;
    protected long?: boolean = false;

    constructor(protected precedence: number) { }

    abstract get Value(): number;

    public unit(unit: Expression){
        this.unit_ = unit;
        return this;
    }

    public prec(precision: number){
        this.precision = precision;
        return this;
    }

    public setLong(){
        this.long = true;
        return this;
    }

    get Precedence() {
        return this.precedence;
    }

    public toResult(): XmlObject {
        const value = this.Value;
        if (!value) {
            throw Error(`Expression has not been assigned.`);
        }
        if (Math.abs(value) < 1e-9) {
            return new MathText(0);
        }
        if (Math.abs(value) > 10000 || Math.abs(value) < 0.0001 && value !== 0) {
            const sup = Math.floor(Math.log10(Math.abs(value)));
            const base = value / Math.pow(10, sup);
            return new Composite(new MathText(Number(base).toFixed(this.precision)), new MathText('×', { sty: 'p' }), new SubSript(new MathText(10), new MathText(sup)));
        }
        return new MathText(Number(value).toFixed(this.precision));
    
    }

    public abstract toVar(): XmlObject;


    public abstract toNum(): XmlObject;

}


