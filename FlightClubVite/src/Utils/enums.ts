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
    console.log("Enum2ComboItem/items",items)
    return items;
  }
}