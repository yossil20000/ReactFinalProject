import { Dialog, DialogTitle, DialogContent, createTheme, Paper, styled, Grid, Button, Card, CardContent, Typography, CardActions, Divider, TextField } from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { InputComboItem } from "../../Components/Buttons/ControledCombo";
import { ITransitionAlrertProps, IValidationAlertProps, ValidationAlert } from "../../Components/Buttons/TransitionAlert";
import { useCreateOrderMutation } from "../../features/Account/accountApiSlice";
import { COrderCreate,  IOrderBase } from "../../Interfaces/API/IAccount";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";

export interface CreateOrderDialogProps {
  value: IOrderBase;
  onClose: () => void;
  onSave: (value: IOrderBase) => void;
  open: boolean;
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const defaultMaterialThem = createTheme({

})
let transitionAlertInitial: ITransitionAlrertProps = {
  severity: "success",
  alertTitle: "Create Order",
  alertMessage: "Operation succeed",
  open: false,
  onClose: () => { }
}
function CreateOrderDialog({ value, onClose, onSave, open, ...other }: CreateOrderDialogProps) {

  console.log("CreateOrderDialog/value", value)

  const [CreateOrder, { isError, isLoading, error, isSuccess }] = useCreateOrderMutation();
  const [orderCreate, setOrderCreate] = useState<IOrderBase>(value);
  const [alert, setAlert] = useState<ITransitionAlrertProps>(transitionAlertInitial);
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [isSaved,setIsSaved] = useState(false);

  useEffect(() => {
    console.log("CreateOrderDialog/useEffect", isError, isSuccess, isLoading)
    if (isSuccess) {

      setAlert((prev) => ({ ...prev, alertTitle: "Order Create", alertMessage: "Order Create Successfully", open: true, onClose: onClose, severity: "success" }))

    }
    if (isError) {

      const validation = getValidationFromError(error, handleOnValidatiobClose);
      setValidationAlert(validation);
      return;


    }
  }, [isLoading])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleChange", event.target.name, event.target.value)
    if(event.target.name === 'discount')
    {
      const newAmount = (orderCreate.units * orderCreate.pricePeUnit) -  Number(event.target.value);
      console.log("handleChange/newAmount", event.target.name, event.target.value,newAmount)
      setOrderCreate(prev => ({
        ...prev,
        [event.target.name]: Number(event.target.value),amount:  Number(newAmount.toFixed(2))
      }));
    }
    
  };
  const handleOnCancel = () => {
    setValidationAlert([])
    if(isSaved)
      onSave(value)
    else
      onClose()
  }
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([])

  }, [])
  const handleOnSave = async () => {
    console.log("CreateOrderDialog/onSave", orderCreate)
    let order = new COrderCreate();
    order.copy(orderCreate);
    console.log("CreateOrderDialog/onSave/order", order)
    console.log("CreateOrderDialog/onSave/date", orderCreate.order_date)

    await CreateOrder(orderCreate as IOrderBase).unwrap().then((data) => {
      console.log("CreateOrderDialog/onSave/", data);
      if(data.data._id !== undefined){
        setIsSaved(true)
      }
        /* onSave(value); */
        
      
    }).catch((err) => {
      console.log("CreateOrderDialog/onSave/error", err.data.errors);
    });


  }
  const onDeviceChanged = (item: InputComboItem, has_hobbs: boolean) => {

    setOrderCreate(prev => ({ ...prev, _id_device: item._id, reuired_hobbs: has_hobbs }))
  }
  const onMemberChanged = (item: InputComboItem) => {
    setOrderCreate(prev => ({ ...prev, _id_member: item._id }))
  }
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: "100%", maxHeight: "auto" } }}
      maxWidth="lg"

      open={open} {...other}>
      <DialogTitle>Order Create</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <Grid container sx={{ width: "100%" }} justifyContent="center" columns={12}>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary"  gutterBottom>
                  Order Details for {orderCreate.orderBy}
                </Typography>
                <Divider light />
              </Grid>

              <Grid item xs={3}>
              <TextField
                disabled={true}
                type={"text"}
                sx={{ marginLeft: "0px", width: "100%",fontSize: 25 }}
                name="referance"
                id="referance"
                variant="standard"
                key={"referance"}
                value={orderCreate.orderType.referance}
                InputLabelProps={{ shrink: true }}
                label="product"
              />
              </Grid>
              <Grid item xs={2}>

                <TextField
                disabled={true}
                type={"text"}
                sx={{ marginLeft: "0px", width: "100%",fontSize: 25 }}
                name="units"
                id="units"
                variant="standard"
                key={"unints"}
                value={orderCreate.units}
                InputLabelProps={{ shrink: true }}
                label="Units"
              />
              </Grid>
              <Grid item xs={2}>
                <TextField
                disabled={true}
                type={"text"}
                sx={{ marginLeft: "0px", width: "100%",fontSize: 25 }}
                name="pricePeUnit"
                id="pricePeUnit"
                variant="standard"
                key={"pricePeUnit"}
                value={orderCreate.pricePeUnit}
                InputLabelProps={{ shrink: true }}
                label="PerUnit"
              />
              </Grid>
              <Grid item xs={2}>

                <TextField
                type={"number"}
                sx={{ marginLeft: "0px", width: "100%",fontSize: 25 }}
                name="discount"
                id="discount"
                variant="standard"
                key={"discount"}
                value={Number(orderCreate.discount.toFixed(2))}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                label="discount"
              />
              </Grid>
              <Grid item xs={2}>

                <TextField
                disabled={true}
                type={"number"}
                sx={{ marginLeft: "0px", width: "100%",fontSize: 14 }}
                name="amount"
                id="amount"
                variant="standard"
                key={"amount"}
                value={orderCreate.amount}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                label="Amount"
              />
              </Grid>
              <Divider light />
              <Grid item xs={12}>
              <Divider light />

              </Grid>
              <Grid item xs={12}>
              <Divider light />
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Description:
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {value.desctiption}
                </Typography>
              </Grid>
            </Grid>

          </CardContent>
          <CardActions>
          <Grid container sx={{ width: "100%" }} justifyContent="center">
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" }}
              onClick={handleOnCancel}>

              {isSaved === true ? "Close ": "Cancle"}
            </Button></Item>
          </Grid>
          <Grid item xs={12} md={6} xl={6}>
            <Item><Button variant="outlined" sx={{ width: "100%" } } 
            disabled={isSaved === true ? true : false}
              onClick={handleOnSave}>
              {isSaved === true ? "Saved" : "Save"}
            </Button></Item>
          </Grid>
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>

                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
        </Grid>
          </CardActions>
        </Card>

      </DialogContent>
    </Dialog>
  )
}

export default CreateOrderDialog;