import { Box } from '@mui/system'
import { Fragment, useEffect, useState } from 'react'
import WABChart from '../../Components/WOBChart'
import { CWAB, WABGc, WABItem } from '../../Interfaces/API/IWAB'
import { Input, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


function WABPage() {
  const [items, setItems] = useState<WABItem[]>()
  const [CoG, setCoG] = useState<WABGc>({  x:0,y: 0,weight: 0,cg: 0,validation: [],cgMoment: [], cgWeight: []})

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
          item.weight = Number(e.target.value)
          tempitems[index] = item;
          const newitems = new CWAB()
          newitems.inititialCGC()
          newitems.items = tempitems
          setItems(newitems.items);
          setCoG(CWAB.calcCG(newitems.items))
          console.log("WABPage/onChange/Set", index)

        }
      }
    }




  };
  useEffect(() => {
    console.log("WABPage/useEffect")
    let CGC = new CWAB()
    CGC.inititialCGC();
    setItems(CGC.items)
    setCoG(CWAB.calcCG(CGC.items))
  }, [])

  return (
    <Fragment>
      <Box display={'flex'} flexWrap={'wrap'} width={'100%'} flexDirection={'row'} height={'100%'}>
          <WABChart wabXPoints={CoG?.cgMoment} wabYPoints={CoG?.cgWeight} />
        <Box display={'flex'} flexDirection={'column'} minWidth={'50%'} sx={{ overflow: "scroll" }} >
        <Table aria-label='weight and balance table'  >
          <caption>CGC Weight And Balance</caption>
          <TableHead>
            <TableRow>
              <TableCell width="50%" align='left'></TableCell>
              <TableCell width="10%" align='left'>Quantity [lb]</TableCell>
              <TableCell width="10%" align='left'>Weight</TableCell>
              <TableCell width="10%" align='left'>Station</TableCell>
              <TableCell width="10%" align='left'>Arm</TableCell>
              <TableCell width="10%" align='left'>Moment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              items?.map((row) => (
                <TableRow key={`${row.cX}${row.cY}`}>
                  <TableCell width="50%">{row.displayName}</TableCell>
                  <TableCell>                    <Input type='number'
                    sx={{ width: "100%" }}
                    value={row.weight}
                    name={"weight"}
                    onChange={(e) => onChange(e, row)}
                  /></TableCell>
                  <TableCell width="10%">{row.weight}</TableCell>
                  <TableCell width="10%">{`${row.pX},${row.pY}`}</TableCell>
                  <TableCell width="10%">{`${row.cY}`}</TableCell>
                  <TableCell width="10%">{`${(row.cY * row.weight).toFixed(2)}`}</TableCell>
                </TableRow>
              ))
            }
            <TableRow>

              <TableCell colSpan={1}>Total Weight</TableCell>
              <TableCell align="right">{CoG?.weight}</TableCell>

            </TableRow>
            <TableRow>
              <TableCell colSpan={1}>Total CoG</TableCell>
              <TableCell align="right">{CoG?.cg.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>


        </Table>
      </Box>
      </Box>
      
    </Fragment>
  )
}

export default WABPage