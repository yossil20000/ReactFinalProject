import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsYAxis, axisClasses } from '@mui/x-charts';

export default function WOBChart() {
  const [connectNulls, setConnectNulls] = React.useState(true);

  return (
    <Stack sx={{ width: 500 }}>

      <LineChart
      yAxis={[{label:"Weight" }]}
        xAxis={[{label:"Moment", id:"moment", data: [35, 35,36.5, 40.5,40.5, 35,36.5,39.5,47.3,47.3,40.5,40.5,36.5,40.28,40.28,39.96,39.69,42.44,44.76,44.88,45.07 ] }]}
        series={[
          {
            data: [1200, 1960, 2100, 2100,  1200,1200],
            connectNulls,
            area: true,
            curve: "linear"
          },
          {
            data: [null,null,null,null,null,null,2100,2400,2400,1200,1200,2100,2100],
            connectNulls,
            area: true,
            curve: "linear"
          },
          {
            data: [null,null,null,null,null,null,null,null,null,null,null,null,null,1200,1552,1772,1892,2062,2232,2237,2400],
            connectNulls,
            area: false,
            curve: "linear",
            color: "red"
          },
  
        ]}
        height={500}
        margin={{ top: 20, bottom: 20,left:100 }}
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