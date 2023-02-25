// https://www.webtips.dev/webtips/javascript/update-nested-property-by-string
import nestedProperty from 'nested-property'
import { InputComboItem } from '../Components/Buttons/ControledCombo';
import IDevice from '../Interfaces/API/IDevice';
export function setProperty(obj: any, path: any, value: any): any {
    const [head, ...rest] = path.split('.')
    console.log("setPropery/obj", obj)
    return {
        ...obj,
        [head]: rest.length
            ? setProperty(obj[head], rest.join('.'), value)
            : value
    }
}

export function SetObjPro(obj: any, path: any, value: any): any {
    let newObj = { ...obj };
    nestedProperty.set(newObj, path, value);
    console.log("SetObjPro/newobj", newObj)
    return newObj;
}

export const getSelectedItem = (value: string | undefined , device?: any): InputComboItem => {
    /* selectedItem?[property].toString() : "" */
    console.log("getSelectedItem/value", value, device)
    const selected: InputComboItem = {
        lable: value ? value : "",
        _id: "",
        description: ""
    }
    console.log("getSelectedItem/selected", selected)
    return selected;
}
export const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    console.log("SetProperty/newobj", newObj, path, value)
    return newObj;
  }