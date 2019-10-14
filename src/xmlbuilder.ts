export class Xml{
    protected _tagName: string;
    protected _elements: Xml[] = [];
    protected _attributes :{[key:string] : string} = {};
    protected _text: string='';

    constructor(tagName: string){
        this._tagName = tagName;
    }

    public child(ele: Xml): Xml{
        this._elements.push(ele);
        return this;
    }

    public text(txt: string | number | boolean): Xml{
        this._text = `${txt}`;
        return this;
    }

    public attr(key: string, value: string | number | boolean): Xml{
        this._attributes[key] = `${value}`;
        return this;
    }

    public toString(): string{
        if (this._elements.length === 0 && this._text === ''){
            return `<${this._tagName}${this.attributesString()}\\>`;
        } else{
            return `<${this._tagName}${this.attributesString()}>${this.elementsString()}${this.textString()}<\\${this._tagName}>`
        }
    }

    private attributesString(): string{
        let attrs: string = '';
        for (let key in this._attributes){
            attrs += ` ${key}=${this._attributes[key]}`;
        }
        return attrs
    }

    private elementsString(): string{
        let elements: string = '';
        for (let item of this._elements){
            elements += `${item.toString()}`;
        }
        return elements
    }

    private textString(): string{
        return this._text.replace(/&/, '&amp;').replace(/</, '&lt;').replace(/>/, '&gt;');
    }
}