import {Xml} from "../xmlbuilder";

export class Relationship{
    private _id: number=-1;
    constructor(private _type: string, private _target: string){

    }

    public setId(id: number){
        this._id = id;
    }

    public getXml(): Xml{
        return new Xml('Relationship')
        .attr('Id', `rId${this._id}`)
        .attr('Type', this._type)
        .attr('Target', this._target);
    }
}