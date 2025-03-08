import { Box } from '@mui/system'
import { Fragment, useEffect, useState } from 'react'
import WABChart from '../../Components/WOBChart'
import { CWAB, EPoint_WAB_GC, WABGc, WABItem, WABItemType, WABUnits, conv } from '../../Interfaces/API/IWAB'
import { Input, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import useLocalStorage from '../../hooks/useLocalStorage';


function WABPage() {
  const [items, setItems] = useLocalStorage<WABItem[]>("CGC_ITEMS",[])
  const [CoG, setCoG] = useState<WABGc>({ x: 0, y: 0, weight: 0, cg: 0, validation: [], cgMoment: [], cgWeight: [] })
  const [cgResults, setCgResults] = useState<EPoint_WAB_GC>(EPoint_WAB_GC.EPOINT_IN_NORMAL)
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: WABItem) => {
    e.preventDefault()
    console.log("WABPage/onChange/value_row", e.target.value, row, items)
    let index = -1;
    if (items) {
      index = items.findIndex((item) => {
        console.log("WABPage/onChange/value_row", item)
        return row.pX == item.pX && row.pY == item.pY
      })
      console.log("WABPage/onChange/index", index)
    }

    if (index >= 0) {
      if (items) {
        console.log("WABPage/onChange/StartSet", index)
        let tempitems = [...items]
        
        let item = { ...tempitems[index] }
        if (item) {
          console.log("WABPage/onChange/convert", Number(e.target.value),item.displayUnits,item.unit, converUnit(Number(e.target.value),item.displayUnits,item.unit))
          item.weight =  Number(converUnit(Number(e.target.value),item.displayUnits,item.unit).toFixed(1));
          item.displayValue=Number(e.target.value),
          tempitems[index] = item;
          const newitems = new CWAB()
          newitems.inititialCGC()
          newitems.items = tempitems
          setItems(newitems.items);
          setCoG(CWAB.calcCG(newitems.items))
          console.log("WABPage/onChange/Set", index,item)

        }
      }
    }




  };
  useEffect(() => {
    console.log("WABPage/useEffect/items", items)
    let CGC = new CWAB(items)
    
    if(items.length == 0){
      CGC.inititialCGC();
      setItems(CGC.items)
    }
      
    setCoG(CWAB.calcCG(CGC.items))
  }, [])
  const onWABChange = (cGResult: EPoint_WAB_GC) => {
    console.log("WABPage/onWABChange/utility,normal", cGResult.toString())
    setCgResults(cGResult);
  }
  const getCGResultColor = (): string => {
    switch (cgResults) {
      case EPoint_WAB_GC.EPOINT_GC_LIMIT:
      case EPoint_WAB_GC.EPOINT_WEIGHT_LIMIT:
      case EPoint_WAB_GC.EPOINT_OUT_LIMIT:
        return 'red'
      case EPoint_WAB_GC.EPOINT_IN_NORMAL:
        return 'aquamarine '
      case EPoint_WAB_GC.EPOINT_IN_UTILITY:
        return "deepskyblue "
    }
  }
  const getAircraftLimitWeight = (): number => {
    const item = items?.find((i) => i.type == WABItemType.WAB_AIRCRAFT)
    if (item && item.weightLimit)
      return item.weightLimit;
    return -1
  }

  const converUnit = (weight: number,from:WABUnits,to:WABUnits) : number =>  {
    let convert = `${from}TO${to}`
    conv[convert](weight)
    console.log("WABPage/converUnit",convert,weight,conv[convert](weight))
    return conv[convert](weight);
  }
  converUnit(171,WABUnits.WAB_KG,WABUnits.WAB_POUND) 

  return (
    <Fragment>
      <Box display={'flex'} flexWrap={'wrap'} width={'100%'} flexDirection={'row'} height={'100%'} sx={{ overflow: "scroll" }}>
        <WABChart wabXPoints={CoG?.cgMoment} wabYPoints={CoG?.cgWeight} onChanged={onWABChange} />
        <Box display={'flex'} flexDirection={'column'} minWidth={'50%'} sx={{ overflow: "scroll" }} >
          <Table aria-label='weight and balance table'  >
            <caption>CGC Weight And Balance</caption>
            <TableHead>
              <TableRow>
                <TableCell width="50%" align='left'></TableCell>
                <TableCell width="10%" align='left'>Quantity [kg]</TableCell>
                <TableCell width="10%" align='left'>Weight [lb]</TableCell>
                <TableCell width="10%" align='left'>Station</TableCell>
                <TableCell width="10%" align='left'>Arm</TableCell>
                <TableCell width="10%" align='left'>Moment</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {
                items?.map((row,i) => (
                  <TableRow key={`${row.cX}${row.cY}`}>
                    <TableCell width="50%">{row.displayName}</TableCell>
                    <TableCell>
                      <Input type='number'
                        sx={{ width: "100%" }}
                        value={row.displayValue}
                        name={"weight"}
                        disabled={row.type == WABItemType.WAB_AIRCRAFT}
                        onChange={(e) => onChange(e, row)}
                        inputProps={{
                          min:0,max:row.weightLimit == undefined ? 1000 : converUnit(row.weightLimit,WABUnits.WAB_POUND,row.displayUnits)
                        }}
                      />
                    </TableCell>
                    <TableCell width="10%" sx={{backgroundColor: row.weightLimit != undefined ? row.weight > row.weightLimit ? "red" : "": ""}}>{row.weight}  {`${row.weightLimit == undefined ? "" : ` Limit: ${row.weightLimit}`}`}</TableCell>
                    <TableCell width="10%">{`${row.pX},${row.pY}`}</TableCell>
                    <TableCell width="10%">{`${row.cY}`}</TableCell>
                    <TableCell width="10%">{`${(row.cY * row.weight).toFixed(2)}`}</TableCell>

                  </TableRow>
                ))
              }
              <TableRow>
                <TableCell colSpan={1}>Total Weight</TableCell>
                <TableCell align="right">{CoG?.weight.toFixed(1)} Limit: {`${getAircraftLimitWeight()}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={1}>Total CoG</TableCell>
                <TableCell align="right">{CoG?.cg.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={1}>CG Results</TableCell>
                <TableCell align="right">{

                }</TableCell>
                <TableCell width="20%" align='right' sx={{ backgroundColor: `${getCGResultColor()}` }}>{`${cgResults}`}</TableCell>
              </TableRow>
            </TableBody>


          </Table>
        </Box>
      </Box>

    </Fragment >
  )
}

export default WABPage