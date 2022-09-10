import { ArrowDropDown } from "@mui/icons-material";
import { Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React, { useRef, useState } from "react";
export interface ISplitButtonProps {
  options: string[];
  handleClick(selectedIndex : number) : number;
}

export default function SplitedButton(props: ISplitButtonProps) {
  //console.log("SplitedButtonProps", props)
  let { options,handleClick } = props;
  //options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  
  const handleToogle = () => {
    setOpen((prevOpen) => !prevOpen);
  }
  const handleClose = (event: Event) =>{
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  }
  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index:number) =>{
    setSelectedIndex(index);
    setOpen(false);
    handleClick(index);
  }
  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={() => handleClick(selectedIndex)}>{options[selectedIndex]}</Button>
        <Button size="small" 
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
        onClick={handleToogle}> <ArrowDropDownIcon /></Button>
        <Popper sx={{ zIndex: 1, }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (<Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menue" autoFocusItem>
                  {
                    options.map((option : any, index:any) => (
                      <MenuItem key={option} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event,index)}>
                        {option}
                      </MenuItem>
                    ))
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
          )}
        </Popper>
      </ButtonGroup>
    </React.Fragment>
  )
}