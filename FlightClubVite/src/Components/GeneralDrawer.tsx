import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { createTheme } from '@mui/material';

const drawerWidth = 320;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '0',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export interface GeneralDrawerProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  children?: string | JSX.Element | JSX.Element[] | (()  => JSX.Element);
}
export default function GeneralDrawer({ setOpen, open, children }: GeneralDrawerProps) {
  const theme = useTheme();
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const defaultMaterialThem = createTheme({

  })
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: 'auto',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {children === undefined ? null : <>{children}</>}
      </Drawer>


    </Box>
  );
}