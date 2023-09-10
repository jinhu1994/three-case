export interface Size {
    width: number;
    height: number;
}

export enum AttrType {
    Color,
    Number,
    Boolean
}

export interface GuiParams {
    type: AttrType,
    min: number;
    max: number;
    step: number
}
