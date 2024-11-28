import { Box, Chip, Paper } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import moment from 'moment'
import { StyledDataGrid } from '../../common/datagrid/StyledDataGrid'
import { DownloadReportButton } from '../DownloadReportButton'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'

interface IntrastatReportsTableProps {
  dataSet: any[]
  onDownloadClick?: (period: string) => void
  isDownloading?: boolean
}

export function IntrastatReportsTable(props: IntrastatReportsTableProps) {
  const { dataSet, onDownloadClick, isDownloading } = props
  const rows = dataSet.map((res, id) => ({ id, ...res }))

  const columns: GridColDef[] = [
    { field: 'year', headerName: 'Year', width: 70 },
    { 
      field: 'month', 
      headerName: 'Month', 
      width: 50,
      renderCell: (params) => params?.value.toString().padStart(2, '0')
    },
    { 
      field: 'isOpen', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.value ? <LockOpenIcon /> : <LockIcon />}
          label={params.value ? 'Open' : 'Closed'}
          color={params.value ? 'success' : 'error'}
          size="small"
          variant="outlined"
          sx={{ 
            minWidth: 85,
            '& .MuiChip-icon': {
              fontSize: 16
            }
          }}
        />
      )
    },
    {
      field: 'variationDate',
      headerName: 'Variation Date',
      width: 120,
      valueFormatter: (value) => moment(value.value).format('YYYY-MM-DD'),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: (params) => (
        <DownloadReportButton
          year={params.row.year}
          month={params.row.month}
          onDownloadClick={onDownloadClick}
          isDownloading={isDownloading}
        />
      ),
    }
  ]

  return (
    <Paper elevation={2}>
      <Box sx={{ height: 400, width: '100%' }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          getRowClassName={(params) => 
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 }
            },
          }}
        />
      </Box>
    </Paper>
  )
}