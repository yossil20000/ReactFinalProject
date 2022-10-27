// https://www.webtips.dev/webtips/javascript/update-nested-property-by-string
import nestedProperty  from 'nested-property'
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