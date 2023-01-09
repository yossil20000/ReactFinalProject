import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import AccountsCombo from '../../Components/Accounts/AccountsCombo'
import ActionButtons, { EAction } from '../../Components/Buttons/ActionButtons'
import { InputComboItem } from '../../Components/Buttons/ControledCombo'
import { IValidationAlertProps, ValidationAlert } from '../../Components/Buttons/TransitionAlert'
import MembersCombo from '../../Components/Members/MembersCombo'
import DeviceTabItem from '../Administrator/Devices/DeviceTabItem'
import ContainerPage, { ContainerPageFooter, ContainerPageHeader, ContainerPageMain } from '../Layout/Container'

function Accounts() {
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);

  const onValidationAlertClose = () => {
    setValidationAlert([]);
  }
  function onAction(action: EAction, event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event?.defaultPrevented
    console.log("ActionButtons/onAction", event?.target, action)
    switch (action) {
      case EAction.ADD:

        break;
      case EAction.DELETE:
        /* onDelete(); */
        break;
      case EAction.SAVE:
        /* onSave() */
        break;
    }
  }
  const onMemberChange = (item: InputComboItem) => {
    

  }
  return (
    <ContainerPage>
      <>
        {"Conainer"}
        <ContainerPageHeader>
        <Box marginTop={2}>
            <Grid container width={"100%"} height={"100%"} gap={2}>
              <Grid item xs={12}>
                <AccountsCombo onChanged={onMemberChange} source={"_accounts"}  />
                
              </Grid>

            </Grid>
          </Box>
        </ContainerPageHeader>
        <ContainerPageMain>
          <> {"Conainer Main"}</>
        </ContainerPageMain>
        <ContainerPageFooter>
          <><Box className='yl__action_button' >
            <ActionButtons OnAction={onAction} show={[EAction.SAVE, EAction.ADD]} />
          </Box>
            <Grid container>
              {validationAlert.map((item) => (
                <Grid item xs={12}>

                  <ValidationAlert {...item} />

                </Grid>
              ))}
            </Grid></>
        </ContainerPageFooter>
      </>

    </ContainerPage>
  )
}

export default Accounts