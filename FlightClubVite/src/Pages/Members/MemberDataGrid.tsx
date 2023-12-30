import { DataGrid } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function MemberDataGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div className='main' style={{ height: 400, width: '100%' }}>
      <DataGrid
        components={{
          LoadingOverlay: LinearProgress,
        }}
        loading
        {...data}
      />
    </div>
  );
}
