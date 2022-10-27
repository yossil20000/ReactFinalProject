import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    props.setValue(newValue); 
    setValue(newValue);
  };

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
        variant="scrollable"
        scrollButtons
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
