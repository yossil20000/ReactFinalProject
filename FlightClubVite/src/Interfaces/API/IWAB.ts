
export enum WABItemType {
  WAB_AIRCRAFT = "WAB_AIRCRAFT",
  WAB_CHAIR = "WAB_CHAIR",
  WAB_FUEL = "WAB_FUEL"
}
export enum WABUnits {
  WAB_GALON = "GALON",
  WAB_POUND = "POUND",
  WAB_KG= "KILO"
}
const lbTokg = (lb: number) : number => lb / 2.2;
const galonTolb = (galon: number): number => galon * 6;
const kgTolb = (kg: number) : number => kg * 2.2;
const lbTogalon = (lb: number): number => lb / 6;
const galonTokg = (galon:number) : number => lbTokg(galonTolb(galon))
const kgTogalon = (kg:number) : number => lbTogalon(kgTolb(kg))

export const unitConversion = {
  category:{
    POUNDTOKILO: lbTokg,
  GALONTOPOUND: galonTolb,
  KILOTOPOUND: kgTolb,
  POUNDTOGALON: lbTogalon
  }
};
export type WABItem = {
  type: WABItemType;
  weight: number;
  cX: number;
  cY: number;
  pX?: number;
  pY?: number;
  weightLimit?: number;
  displayName?: string;
  displayValue: number;
  displayUnits: WABUnits;
  unit: WABUnits
}
export type WABAircraft = {
  empty: WABItem;
}
export type WABLimits = {
  weight: number;
  fuel: number;
}
export type WABGc = {
  x: number;
  y: number;
  weight: number;
  cg: number;
  validation: string[];
  cgMoment: (number | null)[];
  cgWeight: (number | null)[];
  /* performance: EPoint_WAB_GC */
}
export interface IWAB {
  items: WABItem[];
  getGC(): WABGc
}




function CreateCGCWaB(): WABItem[] {
  let items: WABItem[] = []
  items[0] = {
    type: WABItemType.WAB_AIRCRAFT,
    weight: 1552,
    cX: 0,
    cY: 40.28,
    pX:0,pY:0,
    weightLimit: 2400,
    displayName: "Empty Weight",
    displayUnits: WABUnits.WAB_KG,
    unit: WABUnits.WAB_POUND,
    displayValue: 705.45
  }
  items[1] = {
    type: WABItemType.WAB_CHAIR,
    weight: 176,
    cX: 0,
    cY: 37,
    pX: 1, pY: 1,
    displayName: "Pilot",
    displayUnits: WABUnits.WAB_KG,
    unit: WABUnits.WAB_POUND,
    displayValue: 80
  }
  items[2] = {
    type: WABItemType.WAB_CHAIR,
    weight: 0,
    cX: 0,
    cY: 37,
    pX: 2, pY: 1,
    displayName: "Co-Pilot",
    displayUnits: WABUnits.WAB_KG,
    unit: WABUnits.WAB_POUND,
    displayValue: 0
  }
  items[3] = {
    type: WABItemType.WAB_CHAIR,
    weight: 0,
    cX: 0,
    cY: 73,
    pX: 1, pY: 2,
    displayName: "RearL Passanger",
    displayUnits: WABUnits.WAB_KG,
    unit: WABUnits.WAB_POUND,
    displayValue: 0
  }
  items[4] = {
    type: WABItemType.WAB_CHAIR,
    weight: 0,
    cX: 0,
    cY: 73,
    pX: 2, pY: 2,
    displayName: "RearR Passanger",
    displayUnits: WABUnits.WAB_KG,
    unit: WABUnits.WAB_POUND,
    displayValue: 0
  }
  items[5] = {
    type: WABItemType.WAB_CHAIR,
    weight: 33,
    cX: 0,
    cY: 95,
    pX: 1, pY: 3,
    weightLimit: 120,
    displayName: "Baggage 120",
    displayUnits: WABUnits.WAB_KG,
    unit: WABUnits.WAB_POUND,
    displayValue: 15
  }
  items[6] = {
    type: WABItemType.WAB_CHAIR,
    weight: 0,
    cX: 0,
    cY: 123,
    pX: 1, pY: 4,
    weightLimit: 50,
    displayName: "Baggage 50",
    displayUnits: WABUnits.WAB_KG,
    unit: WABUnits.WAB_POUND,
    displayValue: 0
  }
  items[7] = {
    type: WABItemType.WAB_FUEL,
    weight: 0,
    cX: 0,
    cY: 47.9,
    pX: 0, pY: 1,
    weightLimit: 300,
    displayUnits: WABUnits.WAB_GALON,
    displayName: "Main Fuel [1 gal == 6 lb]",
    unit: WABUnits.WAB_POUND,
    displayValue: 0
  }

  return items;
}
export enum EPoint_WAB_GC {
  EPOINT_IN_UTILITY = "IN_UTILITY",
  EPOINT_IN_NORMAL = "IN_NORMAL",
  EPOINT_GC_LIMIT = "GC_LIMIT",
  EPOINT_WEIGHT_LIMIT =  "WEIGHT_LIMIT",
  EPOINT_OUT_LIMIT = "OUT_LIMIT"
} 

export class CWAB implements IWAB {
  items: WABItem[] = [];
  /* constructor(items?: WABItem[] = ) {
    this.items = items;
  } */
  setStationWeight(pX: number, pY: number, weight: number, type: WABItemType): WABGc {

    let validation: string[] = [];
    switch (type) {
      case WABItemType.WAB_FUEL:
      case WABItemType.WAB_CHAIR:
        const item = this.items.find((i) => i.type == type && i.pX == pX && i.pY == pY)
        if (item) {
          if(item.weightLimit && item.weightLimit > weight)
          validation.push(`Item ${type} location: ${pX},${pY} weight ${weight}over limit of ${item.weightLimit} `)
          else
          item.weight = weight
        }
        else {
          validation.push(`Item ${type} location: ${pX},${pY} Not Found`)
        }
        break;
    }
    return this.getGC();

  }
  inititialCGC(): WABGc {
    this.items = CreateCGCWaB()
    return this.getGC()
  }
  static calcCG(items: WABItem[]) : WABGc{
    let validation:string[] = []
    let cgMoment: number[] =[]
    let cgWeight: number[] =[]
    let cg = items.reduce((acc, cur) => {
      acc[0] += cur.weight
      acc[1] += cur.weight * cur.cX
      acc[2] += cur.weight * cur.cY
      cgMoment.push(acc[2]/acc[0])
      cgWeight.push(acc[0])
      cur.weightLimit ? 
      cur.weight > cur.weightLimit ?
      validation.push(`Invalid Weight in station ${cur.type} location: ${cur.pX} , ${cur.pY} weight: ${cur.weight} limits: ${cur.weightLimit}`) 
      : "" : ""
      return acc;
    }, [0, 0, 0])
    return { x: cg[1], y: cg[2], weight: cg[0], validation: validation ,cg: cg[2]/cg[0],cgMoment: cgMoment,cgWeight: cgWeight}
  }
  getGC(): WABGc {
    return CWAB.calcCG(this.items)
  }

}

type UserRoles = Record<string, (any)>;

export const conv: UserRoles = {
  POUNDTOKILO: lbTokg,
  KILOTOPOUND: kgTolb,
  POUNDTOGALON: lbTogalon,
  GALONTOPOUND: galonTolb,
  GALONTOKILO: galonTokg, 
  KILOTOGALON: kgTogalon
};
