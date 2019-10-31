export class Xml{
    protected _elements: Xml[] = [];
    protected _attributes :{[key:string] : string} = {};
    protected _text: string='';

    constructor(protected _tagName?: string){
    }

    public get last(){
        return this._elements[this._elements.length-1]
    }

    public get length(){
        return this._elements.length;
    }

    public newChild(tagName: string): Xml{
        const xml = new Xml(tagName);
        this.push(xml);
        return xml;
    }

    public push(...ele: Array<Xml|null>): Xml{
        for(const item of ele){
            if(item){
                this._elements.push(item)
            }
        }
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

    public build(...builder: Array<XmlObject| null>):Xml{
        for(const item of builder){
            if(item){
                item.toXml(this);
            }
        }
        return this;
    }

    public toString(): string{
        if (this._elements.length === 0 && this._text === ''){
            return `<${this._tagName}${this.attributesString()}/>`;
        } else{
            return `<${this._tagName}${this.attributesString()}>${this.elementsString()}${this.textString()}</${this._tagName}>`
        }
    }

    private attributesString(): string{
        let attrs: string = '';
        for (let key in this._attributes){
            attrs += ` ${key}="${this._attributes[key]}"`;
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


export abstract class XmlObject{
    abstract toXml(root: Xml):void;
}


export abstract class XmlRoot{
    abstract toString(): string;
}

export class XmlObjectComposite<T extends XmlObject> extends XmlObject{
    protected xmlBuilders: T[] = []

    constructor(...builders: T[]){
        super();
        this.xmlBuilders = builders;
    }

    get Length(){
        return this.xmlBuilders.length;
    }

    public push(...builder: T[]){
        this.xmlBuilders.push(...builder);
        return this;
    }

    public toXml(root: Xml){
        for(const item of this.xmlBuilders){
            item.toXml(root);
        }
    }

}

export class Composite extends XmlObjectComposite<XmlObject>{}

export function E(tagName: string){return new Xml(tagName)}