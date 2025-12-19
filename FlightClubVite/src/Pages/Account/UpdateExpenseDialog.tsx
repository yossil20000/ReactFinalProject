import "../../Types/Number.extensions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ClubAccountsCombo from "../../Components/Accounts/ClubAccountsCombo";
import {
  InputComboItem,
  newInputComboItem,
} from "../../Components/Buttons/ControledCombo";
import {
  IValidationAlertProps,
  ValidationAlert,
} from "../../Components/Buttons/TransitionAlert";
import TypesCombo from "../../Components/Buttons/TypesCombo";
import Item from "../../Components/Item";
import {
  useUpdateExpenseMutation,
  useClubAccountQuery,
} from "../../features/Account/accountApiSlice";
import { IClubAccount } from "../../Interfaces/API/IClub";
import {
  IExpense,
  IExpenseBase,
  IUpsertExpanse,
} from "../../Interfaces/API/IExpense";
import { setProperty } from "../../Utils/setProperty";
import { getValidationFromError } from "../../Utils/apiValidation.Parser";
import FullScreenLoader from "../../Components/FullScreenLoader";
import { MemberType } from "../../Interfaces/API/IMember";
import SizePerUnitCombo from "../../Components/Buttons/SizePerUnitCombo";
import UtilizatedCombo from "../../Components/Buttons/UtilizatedCombo";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
export interface UpdateExpenseDialogProps {
  onClose: () => void;
  onSave: (value: IExpenseBase) => void;
  open: boolean;
  expense: IExpense;
}

function UpdateExpenseDialog({
  onClose,
  onSave,
  open,
  expense,
  ...other
}: UpdateExpenseDialogProps) {
  const theme = useTheme();
  const [UpdateExpense, { isError, isLoading }] = useUpdateExpenseMutation();
  const { data: bankAccounts, isLoading: isQuery } = useClubAccountQuery(true);
  const [bank, setBank] = useState<IClubAccount | undefined>();
  const [selectedExpense, setSelectedExpense] = useState<IExpense>(expense);
  const [selectedSource, setSelectedSource] = useState<InputComboItem>({_id:"", label:"INIT", description:""});
  const [selectedDestination, setSelectedDestination] = useState<InputComboItem>({_id:"", label:"INIT", description:""});
  const [validationAlert, setValidationAlert] = useState<IValidationAlertProps[]>([]);
  const [selectedType, setSelectedType] = useState<InputComboItem>();
  const [selectedCategory, setSelectedCategory] = useState<InputComboItem>();
  const [selectedSPU, setSelectedSPU] = useState<InputComboItem>();
  const [sourceCombo, setSourceCombo] = useState<JSX.Element>(<></>);
  const [destinationCombo, setDestinationCombo] = useState<JSX.Element>(<></>);
 
  
  useEffect(() => {
    CustomLogger.info("UpdateExpenseDialog/useEffect/expense", expense);
    let item : InputComboItem = {
      _id: expense.source.id,
      label: expense.source.display,
      key: expense.source.type,
      key2: expense.source.account_id,
      description: expense.supplier,
    };
    setSelectedSource(item);
    setSourceCombo(RenderSource(item));
    item = {
      _id: expense.destination.id,
      label: expense.destination.display,
      key: expense.destination.type,
      key2: expense.destination.account_id,
      description: expense.supplier,
    };
    setSelectedDestination(item)
    setDestinationCombo(RenderDestination(item))    
  }, [expense]);
    
    const [isSaved, setIsSaved] = useState(false);
    const UpdateSourceAccountFields = (): IExpenseBase => {
      let newObj = selectedExpense;
      CustomLogger.info(
      "CreateExspenseDialog/UpdateSourceAccountFields/selectedSource",
      selectedSource,
      selectedDestination
    );
    newObj = setProperty(selectedExpense, "source.id", selectedSource?._id);
    newObj = setProperty(newObj, "source.type", selectedSource?.key);
    newObj = setProperty(newObj, "source.display", selectedSource?.label);
    newObj = setProperty(newObj, "source.account_id", selectedSource?.key2);
    newObj = setProperty(newObj, "destination.id", selectedDestination?._id);
    newObj = setProperty(newObj, "destination.type", selectedDestination?.key);
    newObj = setProperty(newObj, "supplier", selectedDestination?.description);
    newObj = setProperty(
      newObj,
      "destination.display",
      selectedDestination?.label
    );
    newObj = setProperty(
      newObj,
      "destination.account_id",
      selectedDestination?.key2
    );

    CustomLogger.info(
      "CreateExspenseDialog/UpdateSourceAccountFields/newobj",
      newObj
    );
    //setSelectedExpense(newObj);
    return newObj;
  };

  const handleOnCancel = () => {
    setValidationAlert([]);
    if (isSaved) onSave(selectedExpense);
    else onClose();
  };
  const handleOnValidatiobClose = useCallback(() => {
    setValidationAlert([]);
  }, []);
  const handleOnSave = async () => {
    CustomLogger.log("UpdateExspenseDialog/onSave", selectedExpense);
    setValidationAlert([]);

    if (selectedSource !== undefined) {
      const expanse = UpdateSourceAccountFields();
      const filterData: IUpsertExpanse = {
        update: expanse,
      };
      CustomLogger.info("UpdateExspenseDialog/onSave/filterData", filterData);
      await UpdateExpense(filterData)
        .unwrap()
        .then((data) => {
          CustomLogger.info("UpdateExspenseDialog/onSave/", data);
          if (data.success) {
            setIsSaved(true);
          }
        })
        .catch((err) => {
          const validation = getValidationFromError(
            err,
            handleOnValidatiobClose
          );
          setValidationAlert(validation);
          CustomLogger.error(
            "UpdateExspenseDialog/onSave/error",
            err.data.errors
          );
        });
    }
  };
  const onSelectedSource = (item: InputComboItem) => {
    CustomLogger.log("onSelectedSource/item", item);
    setSelectedSource(item);
  };

  const OnselectedDestination = (item: InputComboItem): void => {
    setSelectedDestination(item);
    SetProperty(selectedExpense, `supplier`, item.description)
  };

  const RenderSource = (  defaultIem: InputComboItem = selectedSource): JSX.Element => {
    return (
      <ClubAccountsCombo
        title={"Source"}
        selectedItem={defaultIem}
        onChanged={onSelectedSource}
        source={"_ExpenseDialogs/Source"}
        includesType={[MemberType.Club]}
      />
    );
  };
  const RenderDestination = (defaultIem: InputComboItem = selectedDestination): JSX.Element => {
    return (
      <ClubAccountsCombo
        title={"Destination"}
        selectedItem={defaultIem}
        onChanged={OnselectedDestination}
        source={"_CreateExspense/Destination"}
        filter={{}}
        includesType={[MemberType.Member, MemberType.Supplier]}
      />
    );
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log(
      "ExpenseDialog/handleChange",
      event.target.name,
      event.target.value
    );
    const newObj: IExpense = SetProperty(
      selectedExpense,
      event.target.name,
      event.target.value
    ) as IExpense;

    setSelectedExpense(newObj);
  };
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    CustomLogger.log(
      "ExpenseDialog/handleNumberChange",
      event.target.name,
      event.target.value
    );
    const newObj: IExpense = SetProperty(
      selectedExpense,
      event.target.name,
      Number(event.target.value).setFix(2)
    ) as IExpense;
    newObj.amount = Number((newObj.units * newObj.pricePeUnit).toFixed(2));
    setSelectedExpense(newObj);
  };

  const SetProperty = (obj: any, path: string, value: any): any => {
    let newObj = { ...obj };
    newObj = setProperty(newObj, path, value);
    CustomLogger.info("ExpenseDialog/SetProperty/newobj", newObj);
    return newObj;
  };
  const onCategoryChanged = (item: InputComboItem) => {
    CustomLogger.log("ExpenseDialog/onCategoryChanged/item", item);
    setSelectedCategory(item);
    /*  setSelectedType(newInputComboItem) */
    setSelectedExpense(
      setProperty(selectedExpense, `expense.category`, item.label)
    );
    /*  setSelectedExpense(setProperty(selectedExpense, `expense.type`, "")) */
  };
  const onTypeChanged = (item: InputComboItem) => {
    CustomLogger.log("ExpenseDialog/onTypeChanged/item", item);
    setSelectedType(item);

    setSelectedExpense(
      setProperty(selectedExpense, `expense.type`, item.label)
    );
  };
    const onComboChanged = (item: InputComboItem, prop: string): void => {
      setSelectedExpense(setProperty(selectedExpense, prop, item.label))
      CustomLogger.log("selectedExpense", selectedExpense)
    }
    
  const onSPUChanged = (item: InputComboItem) => {
    CustomLogger.log("ExpenseDialog/onSPUChanged/item", item);
    setSelectedSPU(item);
    setSelectedExpense(setProperty(selectedExpense, `sizePerUnit`, item.label));
    /*     if(selectedExpense.description == "" || selectedExpense.description.includes("|") ){
      setSelectedExpense(SetProperty(selectedExpense,'description',`|${selectedExpense.expense.category}|${item.lable}|`))
    } */
  };
    const handleDateChange = (newValue: any | null) => {
      let newDate = newValue?.toJSDate() === undefined ? new Date() : newValue?.toJSDate();
      newDate.setHours(12,0,0,0);
      setSelectedExpense(prev => ({ ...prev, date: newDate }))
    };
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: "auto" } }}
      maxWidth="lg"
      open={open}
      {...other}
    >
      <DialogTitle>Update Expense</DialogTitle>
      {isQuery && isLoading && !selectedSource && !selectedDestination ? (
        <>
          <FullScreenLoader />
        </>
      ) : (
        <>
          <DialogContent>
            <Grid
              container
              sx={{ width: "100%" }}
              justifyContent="center"
              columns={12}
            >
              <Grid item xs={12} sm={6}>
                {sourceCombo}
              </Grid>
              <Grid item xs={12} sm={6}>
                {destinationCombo}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TypesCombo
                  selectedKey="Expense"
                  title={"Category"}
                  selectedValue={selectedExpense.expense.category}
                  selectedItem={selectedCategory}
                  onChanged={onCategoryChanged}
                  source={"_CreateExspense/category"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TypesCombo
                  selectedKey={`Expense.${selectedExpense.expense.category}`}
                  title={"Type"}
                  selectedValue={selectedExpense.expense.type}
                  selectedItem={selectedType}
                  onChanged={onTypeChanged}
                  source={"_CreateExspense/Type"}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <UtilizatedCombo onChanged={(item) => onComboChanged(item, "expense.utilizated")} source={""}
                  selectedItem={{ label: selectedExpense.expense.utilizated === undefined ? "" : selectedExpense.expense.utilizated.toString(), _id: "", description: "" }} />
              </Grid>
              <Grid item xs={6} sm={6}>
                <SizePerUnitCombo
                  onChanged={onSPUChanged}
                  source={"_CreateExspense/SizePerUnit"}
                  selectedItem={{
                    label:
                      selectedExpense.sizePerUnit === undefined
                        ? ""
                        : selectedExpense.sizePerUnit,
                    _id: "",
                    description: "",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth={true}
                  onChange={handleNumberChange}
                  id="units"
                  name="units"
                  type={"number"}
                  label="Units"
                  placeholder="Units"
                  variant="standard"
                  value={selectedExpense?.units}
                  required
                  helperText=""
                  error={false}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth={true}
                  onChange={handleNumberChange}
                  id="pricePeUnit"
                  name="pricePeUnit"
                  type={"number"}
                  label="Unit Price"
                  placeholder="Per Unit"
                  variant="standard"
                  value={selectedExpense?.pricePeUnit}
                  required
                  helperText=""
                  error={false}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth={true}
                  onChange={handleChange}
                  id="amount"
                  name="amount"
                  disabled
                  type={"number"}
                  label="Amount"
                  placeholder="Amount"
                  variant="standard"
                  value={selectedExpense?.amount}
                  required
                  helperText=""
                  error={false}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4} sx={{paddingTop: "2ch"}}>
              <LocalizationProvider adapterLocale={"en-gb"} dateAdapter={AdapterLuxon}>
                    <ThemeProvider theme={theme}>
                      <MobileDatePicker
                        sx={{ width:"100%"} }  
                        label="Date"
                        value={DateTime.fromJSDate(new Date(selectedExpense.date))}
                        onChange={handleDateChange}
                        
                      />
                    </ThemeProvider>
                  </LocalizationProvider>
              </Grid>
              <Grid item xs={8} sx={{paddingTop: "2ch", paddingLeft: "1ch"}}>
                <TextField
                  fullWidth={true}
                  onChange={handleChange}
                  id="description"
                  name="description"
                  multiline
                  label="Description"
                  placeholder="Expense Description"
                  variant="standard"
                  value={selectedExpense?.description}
                  required
                  helperText=""
                  error={false}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Grid container sx={{ width: "100%" }} justifyContent="center">
          {true ? (
            <>
              <LinearProgress />
            </>
          ) : null}
          {validationAlert.map((item) => (
            <Grid item xs={12}>
              <Item>
                <ValidationAlert {...item} />
              </Item>
            </Grid>
          ))}
          {isLoading ? (
            <>
              <Grid item xs={12} alignItems={"center"}>
                <Item>Loading</Item>
              </Grid>
              <Grid item xs={12}>
                <Item>
                  <LinearProgress />
                </Item>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6} xl={6}>
                <Item>
                  <Button
                    variant="outlined"
                    sx={{ width: "100%" }}
                    onClick={handleOnCancel}
                  >
                    {isSaved === true ? "Close " : "Cancle"}
                  </Button>
                </Item>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>
                <Item>
                  <Button
                    variant="outlined"
                    sx={{ width: "100%" }}
                    disabled={isSaved === true ? true : false}
                    onClick={handleOnSave}
                  >
                    {isSaved === true ? "Updated" : "Update"}
                  </Button>
                </Item>
              </Grid>
            </>
          )}
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateExpenseDialog;
