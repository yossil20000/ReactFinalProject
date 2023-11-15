import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts';
import * as turf from "@turf/turf";
export enum EPoint_WAB_GC {
  EPOINT_IN_UTILITY,
  EPOINT_IN_NORMAL,
  EPOINT_OUT_OF_LIMIT
} 
export interface WABChartProps {
  wabXPoints: (number|null )[]
  wabYPoints: (number| null )[]
}
export default function WABChart({wabXPoints,wabYPoints}: WABChartProps) {
  const [connectNulls, setConnectNulls] = React.useState(true);
  /* wabXPoints= [40.28,39.96,39.69,42.44,44.76,44.88,45.07 ] 
  wabYPoints= [1552,1772,1892,2062,2232,2237,2400] */
  let dataAxis :(number| null )[] =     [35, 35,36.5, 40.5,40.5, 35,36.5,39.5,47.3,47.3,40.5,40.5,36.5 ] 
  console.log("WABChart/wabYPoints_wabXPoints",wabXPoints,wabYPoints );
  let dataAxisAll = dataAxis.concat(wabXPoints)
  let dataYUtility = [1200, 1960, 2100, 2100, 1200,1200];
  let dataYNormal =  [null,null,null,null,null,null,2100,2400,2400,1200,1200,2100,2100]
  let dataYCG :(number| null)[] = Array(dataYNormal.length).fill(null)
  dataYCG = dataYCG.concat(wabYPoints)
/*   const initializeArrayWithValues = (n:any, val = null) => Array(n).fill(val);
initializeArrayWithValues(5, 2); // [2, 2, 2, 2, 2] */
  console.log("WABChart/dataYCG", dataYCG);
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
       var poly = turf.polygon([[
        [35, 1200],
        [35, 1960],
        [36.5,  2100],
        [40.5, 2100],
        [40.5, 1200],
        [35,1200]
      ]]);
       
      
      var pt = turf.point([35,1900]);
      let res = turf.booleanPointInPolygon(pt, poly);
      console.log("WABChart/getLastPointLocation/truf_res",res)
    }

    return EPoint_WAB_GC.EPOINT_OUT_OF_LIMIT
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