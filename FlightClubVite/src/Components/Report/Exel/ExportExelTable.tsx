import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from "@mui/material";
import { useEffect } from "react";
import { downloadExcel } from "react-export-table-to-excel";

export interface IExportExelTable {
  file: string;
  sheet: string;
  title: string;
  header: string[];
  body: Array<string[]>
  save:boolean
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function ExportExelTable({ file, sheet, title, header, body ,save}: IExportExelTable) {
  function handleExportTable() : boolean {
    const opt = 'downloadExcel Method'; 
    const result = downloadExcel({
      fileName: file,
      sheet: sheet,
      tablePayload: {
        header,
        // accept two different data structures
        body: body,
      },
    });
    return result;
  }
  useEffect(() => {
    if(save){
      if(handleExportTable()){

      }
    }
  },[save])
  return (
    <TableContainer component={Paper}>
      <button onClick={handleExportTable}>export table</button>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <caption>{`File:${file} Sheet:${sheet}`}</caption>
        <TableHead>
          <StyledTableRow>
          {header.map((head) => (
              <StyledTableCell key={head}>
                {head}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
         
          {body.map((row, i) => (
            <StyledTableRow key={i}>
              {row.map((cell: string,i) => (
                <StyledTableCell key={`${cell}${i}`}>{cell}</StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExportExelTable