import { ClassNames } from '@emotion/react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useFetcAllMembersQuery, useFetchAllClubNoticeQuery } from '../../features/Users/userSlice'
const columns = [
  { id: "_id", lable: "Id Number", minWidth: '10ch', align: 'center' , numeric: false ,disablePadding: true},
  { id: "member_id", lable: "Id Number", minWidth: '10ch', align: 'center' ,numeric: false , disablePadding: true} ,
  { id: "family_name", lable: "Famaily", minWidth: '10ch', align: 'right',numeric: false ,disablePadding: true},
  { id: "first_name", lable: "Name", minWidth: '10ch', align: 'right' , numeric: false , disablePadding: true},
  { id: "email", lable: "Email", minWidth: '10ch', align: 'right', format: (value: any) => value.tolocalString('en-US') , numeric: false , disablePadding: true},
  { id: "phone", lable: "Phone", minWidth: '10ch', align: 'right' , numeric: false , disablePadding: true},
]
interface ItableData {
  _id:string,member_id:string,family_name:string,first_name:string,email:string,phone:string
}
function createdata(_id:string,member_id:string,family_name:string,first_name:string,email:string,phone:string) : ItableData {
  return {_id,member_id,family_name,first_name,email,phone} as ItableData
}
let rows : ItableData[] | null | undefined= [];


function MembersPage() {
  const { data: members, isFetching } = useFetcAllMembersQuery();
  const { data: message, isFetching: isFetchingMessage } = useFetchAllClubNoticeQuery();
  console.log("Members", members)
  console.log("Messages", message)
  const DrawMessage = () => {
    if (isFetchingMessage) return (<>Fetcing message</>)
    if (message?.success) return (<>MEssage Succeed</>)
    return (<span>Un Known</span>)
  }
  useEffect(() => {

rows = members?.data.map((item) => {
  return createdata(item._id,item.member_id,item.family_name,item.first_name, item.contact.email, `${item.contact.phone.country}-${item.contact.phone.area}-${item.contact.phone.number}`)
  })
  console.log("rows",rows)
  },[members?.data])
  return (
    <div className='main'>
      <Box sx={{width:'100%'}}>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align='center' style={{ minWidth: column.minWidth }}>
                    {column.lable}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {members?.data.map((row) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row._id}>
                    <TableCell key={columns[0].id} align='left'>
                      {row.member_id}
                    </TableCell>
                    <TableCell key={columns[1].id} align='left'>
                      {row.family_name}
                    </TableCell>
                    <TableCell key={columns[2].id} align='left'>
                      {row.first_name}
                    </TableCell>
                    <TableCell key={columns[3].id} align='left'>
                      {row.contact.email}
                    </TableCell>
                    <TableCell key={columns[4].id} align='left'>
                      {`${row.contact.phone.country}-${row.contact.phone.area}-${row.contact.phone.number}`}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      </Box>
    </div>
  )
}

export default MembersPage