import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts';

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
  dataAxis = dataAxis.concat(wabXPoints)
  let dataYUtility = [1200, 1960, 2100, 2100, 1200,1200];
  let dataYNormal =  [null,null,null,null,null,null,2100,2400,2400,1200,1200,2100,2100]
  let dataYCG :(number| null)[] = Array(dataYNormal.length).fill(null)
  dataYCG = dataYCG.concat(wabYPoints)
/*   const initializeArrayWithValues = (n:any, val = null) => Array(n).fill(val);
initializeArrayWithValues(5, 2); // [2, 2, 2, 2, 2] */
  console.log("WABChart/dataYCG", dataYCG);
return(
    <Stack sx={{width: {xs: "100%", xl:'50%'}, height:{xs:"auto"}  }}>

      <LineChart
      yAxis={[{label:"Weight" }]}
        xAxis={[{label:"Moment", id:"moment", data: dataAxis }]}
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