import * as React from 'react';

import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
export type ScrollableTabsItem = {
    id: number;
    label: string;
}
export interface ISacrollableTabsProps {
  handleChange : (event: React.SyntheticEvent, newValue: number) => void;
  value: number;
  items: ScrollableTabsItem[];
  setValue: React.Dispatch<React.SetStateAction<number>>;
}
export default function ScrollableTabs(props: ISacrollableTabsProps) {

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: { xs: "100%", sm: "100%" },
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={props.value}
        onChange={props.handleChange}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {props.items.map((item) => (
          <Tab label={item.label} key={item.id} />  
        ))}
      </Tabs>
    </Box>
  );
}
