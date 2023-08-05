import { InputComboItem } from "../Components/Buttons/ControledCombo";

export class Enum2ComboItem<T extends {[name: string]: any}> {
  constructor(public enumObject: T) {}
  getItems() : InputComboItem[]{
    const items : InputComboItem[] = Object.keys(this.enumObject).filter((v) => isNaN(Number(v))).
    map((name) => {
      return {
        _id: this.enumObject[name as keyof typeof this.enumObject].toString(),
        description: "",
        lable: name
      }
    })
    CustomLogger.info("Enum2ComboItem/items",items)
    return items;
  }
}

export enum EviewMode {
  E_VM_DAY,
  E_VM_NORMAL
}
export enum EfilterMode {
  E_FM_DATE,
  E_FM_DAY,
  E_FM_WEEK,
  E_FM_MONTH
}