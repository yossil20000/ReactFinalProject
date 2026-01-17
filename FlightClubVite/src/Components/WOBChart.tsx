import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts';
/* import * as turf from "@turf/turf"; */
import inside from 'point-in-polygon';
import { EPoint_WAB_GC } from '../Interfaces/API/IWAB';
import { useState } from 'react';
type chartMaxData = {
  maxGC: number;
  maxWeight: number
}
export interface WABChartProps {
  wabXPoints: (number|null )[]
  wabYPoints: (number| null )[]
  onChanged: (CGResult: EPoint_WAB_GC)  => void
}
export default function WABChart({wabXPoints,wabYPoints,onChanged}: WABChartProps) {
  const [connectNulls, setConnectNulls] = React.useState(true);
  /* wabXPoints= [40.28,39.96,39.69,42.44,44.76,44.88,45.07 ] 
  wabYPoints= [1552,1772,1892,2062,2232,2237,2400] */
    const [dataMax, setDataMax] = useState<chartMaxData>({maxGC:0,maxWeight:2400} )
  /*const [dataAxisAll, setDataAxisAll] = useState<(number| null )[]>([] )
 
  React.useEffect(()=>{
    let dataAxis :(number| null )[] =     [35, 35,36.5, 40.5,40.5, 35,36.5,39.5,47.3,47.3,40.5,40.5,36.5 ]  
    setDataAxis(dataAxis)
    let dataAxisAll = dataAxis.concat(wabXPoints)
     setDataAxisAll(dataAxisAll) 
  },[])  */
  let dataAxis :(number| null )[] =     [35, 35,36.5, 40.5,40.5, 35,36.5,39.5,47.3,47.3,40.5,40.5,36.5 ] 

  console.log("WABChart/useEffect/dataMax",dataMax );
  console.log("WABChart/wabYPoints_wabXPoints",wabXPoints,wabYPoints );
  let dataAxisAll = dataAxis.concat(wabXPoints)
  let dataYUtility = [1200, 1960, 2100, 2100, 1200,1200];
  let dataYNormal =  [null,null,null,null,null,null,2100,2400,2400,1200,1200,2100,2100]
  let dataYCG :(number| null)[] = Array(dataYNormal.length).fill(null)
  dataYCG = dataYCG.concat(wabYPoints)
/*   const initializeArrayWithValues = (n:any, val = null) => Array(n).fill(val);
initializeArrayWithValues(5, 2); // [2, 2, 2, 2, 2] */
  console.log("WABChart/dataYCG", dataYCG);
  React.useEffect (()=>  {
    let max = dataAxis.reduce((cur,acc) => {
      if(cur === null)
        return acc
      if(acc === null)
        return 0
      if(cur > acc ) 
        return cur
      return acc

    },0);
    let max1 = max === null ? 0 : max
    console.log("WABChart/useEffect/max1",max1 );
    setDataMax((prev) => ({...prev,maxGC: max1}))
    max = dataYNormal.reduce((cur,acc) => {
      if(cur === null)
        return acc
      if(acc === null)
        return 0
      if(cur > acc ) 
        return cur
      return acc

    },0);
    let max2 = max === null ? 0 : max
    console.log("WABChart/useEffect/max1",max1 );
    setDataMax((prev) => ({...prev,maxWeight: max2}))
  },[])
  function getLastPointLocation() : EPoint_WAB_GC {
    if(wabXPoints.length == wabYPoints.length)
    {
      let size = wabXPoints.length;
      let cgPoly =[40,2000]
     /*  if(wabXPoints[size-1] !== null && wabYPoints[size-1] !== null)
        cgPoly= [wabXPoints[size-1] === null ? 0 : wabXPoints[size-1] ,wabYPoints[size-1] === null ? 0 : wabYPoints[size-1]]; */
      let utilitySize = dataYUtility.length
      let normalSize = dataYNormal.length - utilitySize;
      let utilityArea : any=[];
      let normalArea: any = [];
      for(let  i:number =0; i<dataAxis.length; i++){
        if(i < utilitySize){
          if(dataAxis[i] != null)
            utilityArea.push([dataAxis[i],dataYUtility[i]])
        }
        else(
          normalArea.push([dataAxis[i],dataYNormal[i]])
        )
      }
      console.log("WABChart/getLastPointLocation/utility_normal",utilityArea,normalArea)
/*      var pt = turf.point(wabXPoints[size-1] === null ? 0 : wabXPoints[size-1] ,wabYPoints[size-1] === null ? 0 : wabYPoints[size-1]);*/
       /* var polyUtility = turf.polygon([[
        [35, 1200],
        [35, 1960],
        [36.5,  2100],
        [40.5, 2100],
        [40.5, 1200],
        [35,1200]
      ]]);
      var polyNormal = turf.polygon([[
        
        [36.5, 2100],
        [39.5, 2401],
        [47.4,  2401],
        [47.4, 1200],
        [40.5, 1200],
        [40.5, 2100],
        [36.5,2100]
      ]]); */
      var polyNormal2 = [
         
        [36.5, 2100],
        [39.5, 2401],
        [47.4,  2401],
        [47.4, 1200],
        [40.5, 1200],
        [40.5, 2100],
        [36.5,2100]  
      ]
      var polyUtility2 = [
        [35, 1200],
        [35, 1960],
        [36.5, 2100],
        [40.5, 2100],
        [40.5, 1200],
        [35,1200]
      ];

      console.log("WABChart/getLastPointLocation/point",getLastPoint())
      let lastPoint1 = getLastPoint();
      let lastPoint = [lastPoint1[0],lastPoint1[1]] as [number,number]
      /* var pt = turf.point(lastPoint);
      let resUtil2 = turf.booleanPointInPolygon(pt, polyUtility);
      let resNormal2 = turf.booleanPointInPolygon(pt, polyNormal); */
      let resUtil = inside(lastPoint,polyUtility2 as [number,number][]);
      let resNormal = inside(lastPoint,polyNormal2 as [number,number][]);

      console.log("WABChart/getLastPointLocation/truf_res_utility",resUtil,resNormal)
      /* console.log("WABChart/getLastPointLocation/inside_res_utility",resUtil2,resNormal2) */
      console.log("WABChart/getLastPointLocation/truf_res_utility_normal",resUtil,resNormal)
      let cgResult : EPoint_WAB_GC = EPoint_WAB_GC.EPOINT_OUT_LIMIT
      if(resUtil)
        cgResult = EPoint_WAB_GC.EPOINT_IN_UTILITY
      else if(resNormal)
        cgResult = EPoint_WAB_GC.EPOINT_IN_NORMAL
      else 
      {
        if(lastPoint[0]> dataMax.maxGC && lastPoint[1]> dataMax.maxWeight)
          cgResult = EPoint_WAB_GC.EPOINT_OUT_LIMIT
        else if(lastPoint[1]> dataMax.maxWeight)
          cgResult = EPoint_WAB_GC.EPOINT_WEIGHT_LIMIT
        else
          cgResult = EPoint_WAB_GC.EPOINT_GC_LIMIT
      }
      
       onChanged(cgResult)
       console.log("WABChart/getLastPointLocation/truf_res_utility_normal",resUtil,resNormal,cgResult,dataMax ,lastPoint[0])
       return cgResult
    }

    return EPoint_WAB_GC.EPOINT_OUT_LIMIT
  }
  function getLastPoint() : number[] {
    
    let point=[0,0];
    if(wabXPoints.length == 0 || wabYPoints.length == 0)
    return point;
    if(wabXPoints[wabXPoints.length-1] !== undefined || wabYPoints[wabYPoints.length-1] !== null)
    {
      point = [wabXPoints[wabXPoints.length-1]!  ,wabYPoints[wabYPoints.length-1]!]
    }
    console.log("WABChart/getLastPointLocation/getLastPoint",wabXPoints,wabYPoints,point)
    return point
    }
  
  getLastPointLocation();
return(
    <Stack sx={{width: {xs: "100%", xl:'50%'}, height:{xs:"auto"}  }}>

      <LineChart
      yAxis={[{label:"Weight" }]}
        xAxis={[{label:"Moment", id:"moment", data: dataAxisAll }]}
        series={[
          {
            data: dataYUtility,
            connectNulls,
            area: true,
            curve: "linear",
            label: 'Utility'
          },
          {
            data: dataYNormal,
            connectNulls,
            area: true,
            curve: "linear",
            label: 'Normal'
          },
          {
            data:  dataYCG /* [null,null,null,null,null,null,null,null,null,null,null,null,null,1552,1772,1892,2062,2232,2237,2400] */,
            connectNulls,
            area: false,
            curve: "linear",
            color: "red",
            label: 'C.G'
          },
  
        ]}
        height={300}
        margin={{ top: 50, bottom: 20,left:100 }}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-25px, 0)',
          },
          [`.${axisClasses.right} .${axisClasses.label}`]: {
            transform: 'translate(30px, 10)',
          },
        }}
      />
      
    </Stack>
  );
}