//https://dev.to/kai_wenzel/top-3-react-tricks-pros-like-to-use-to-reduce-the-size-of-a-component-4hl

import React, { useEffect, useState } from 'react'

import { keys } from 'ts-transformer-keys';
import IFlightReservation from '../../../Interfaces/API/IFlightReservation';

interface ReservationProps{
  headers : Record<string,string>
  sorters?: Record<string,boolean>
  rows: IFlightReservation[] | undefined
}
//const keysOfProps = keys<IFlightReservation>();
//console.log(keysOfProps);
const keysOfProps = ["from", "to","Device", "Member"];
console.log(keysOfProps); 

function Reservation({headers,rows,sorters} : ReservationProps) {
    const isSortable = Boolean(sorters);
    const [displayRows,setDisplayRows] = useState<IFlightReservation[] | undefined>(rows);
    const [sortersData, setSortersData] = useState(sorters);
    const [currentSort,setCurrentSort] = useState("");

     useEffect(() =>{
      if(!isSortable || currentSort ===""){ 
        return;
      }
      
    }) 
    const handleSortToggled = (headerKey: string, isAsc: boolean) => {
      if (!isSortable) {
        return
      }
  
      const newIsAsc = !isAsc
      sortersData![headerKey] = newIsAsc
      setCurrentSort(headerKey)
      setSortersData({ ...sortersData })
    }
  return (
    <>
      <table>
        <thead>
          <tr>
            {Object.keys(headers).map((headerKey: string, index: number) => (
              <th key={'col' + index}>
                {headers[headerKey]}
                {isSortable && sortersData![headerKey] !== undefined && (
                  <div className='sort-icon'
                  onClick={() => handleSortToggled(headerKey, sortersData![headerKey])}>
                    {sortersData![headerKey] ? <>&and;</> : <>&or;</>}
                  </div>
                )}

              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows?.map((row: IFlightReservation , index: number) => (
 <tr key={'row' + index}>
  <td key={keysOfProps[0]}>
            {new Date(row.date_from).toLocaleString()}
  </td>
  <td key={keysOfProps[1]}>
            {new Date(row.date_to).toLocaleString()}
  </td>
  <td key={keysOfProps[2]}>
            {row.device.device_id}
  </td>
  <td key={keysOfProps[3]}>
            {row.member.first_name}
  </td>
  <td><button >Delete {row._id}</button></td>
 </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Reservation