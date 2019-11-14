import { Builder } from "./builder";
import { DocX } from "../root/docX";
import { Title } from "../component";
import { ContentInlineBuilder } from "./contentInlineBuilder";
import { Variable } from "./math/variable";

export class TitleBuilder extends Builder{
    private content: ContentInlineBuilder;
    constructor(protected docx: DocX, protected title: Title){
        super();
        this.content = new ContentInlineBuilder(this.docx, this.title);
    }

    public text(str: string){
        this.content.text(str);
        return this;
    }

    public footnote(str: string){
        this.content.footnote(str);
        return this;
    }

    public variable(variable: Variable){
        this.content.variable(variable);
        return this;
    }

    public variableValue(variable: Variable){
        this.content.variableValue(variable);
        return this;
    }

}