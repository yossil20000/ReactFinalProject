// https://www.webtips.dev/webtips/javascript/update-nested-property-by-string
import nestedProperty  from 'nested-property'
import { InputComboItem } from '../Components/Buttons/ControledCombo';
export function setProperty(obj:any, path:any, value:any) : any {
    const [head, ...rest] = path.split('.')
    console.log("setPropery/obj",obj)
    return {
        ...obj,
        [head]: rest.length
            ? setProperty(obj[head], rest.join('.'), value)
            : value
    }
}

export function SetObjPro(obj:any, path:any, value:any) : any {
    let newObj = {...obj};
    nestedProperty.set(newObj,path,value);
    console.log("SetObjPro/newobj", newObj)
    return newObj;
}

export const getSelectedItem = (value: string | undefined) : InputComboItem => {
    /* selectedItem?[property].toString() : "" */
    const selected : InputComboItem = {
      lable:  value ? value : "",
      _id: "",
      description: ""
    }
console.log("getSelectedItem/selected",selected)
      return selected;
  }