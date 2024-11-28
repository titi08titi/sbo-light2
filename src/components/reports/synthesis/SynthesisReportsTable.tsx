import { Box } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import moment from 'moment'
import React from 'react'

import { DownloadToolbar, NoRowsOverlay, StyledDataGrid } from '#components/common'
import { DefaultDateFormat, MAX_PAGE_SIZE } from '#utils/constants'
import { SynthesisHistoryModel } from '#utils/global'

import { DownloadReportButton } from '../DownloadReportButton'

interface SynthesisReportsTableProps {
  dataSet: SynthesisHistoryModel[]
  onDownloadClick?: (period: string) => void
  isDownloaded?: boolean
  hideFooter?: boolean
}

export default function SynthesisReportsTable(props: SynthesisReportsTableProps) {
  const { dataSet, hideFooter, isDownloaded, onDownloadClick } = props
  const sortedDataSet = dataSet.sort((a, b) => {
    const yearComparison = b.year - a.year
    if (yearComparison !== 0) {
      return yearComparison
    }
    return b.month - a.month
  })
  const rows = sortedDataSet.map((res, id) => ({ id, ...res }))

  const columns: GridColDef[] = [
    { field: 'year', headerName: 'Year', width: 70 },
    { field: 'month', headerName: 'Month', width: 50, renderCell: (params) => params?.value.toString().padStart(2, '0') },
    { field: 'isOpen', headerName: 'Open', width: 50, type: 'boolean' },
    {
      field: 'variationDate',
      headerName: 'Variation date',
      width: 100,
      valueFormatter: (value?: string) => moment(value).format(DefaultDateFormat),
    },
    {
      field: 'closingDate',
      headerName: 'Closing date',
      width: 100,
      valueFormatter: (value?: string) => (value ? moment(value).format(DefaultDateFormat) : null),
    },
    {
      field: 'action',
      headerName: 'Action',
      type: 'actions',
      width: 100,
      cellClassName: 'actions',
      getActions: (params) => {
        return [
          <>
            <DownloadReportButton
              year={params.row.year}
              month={params.row.month}
              onDownloadClick={onDownloadClick}
              isDownloaded={isDownloaded}
            />
          </>,
        ]
      },
    },
  ]

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: rows.length === 0 ? 250 : 'auto' }}>
      <DownloadToolbar dataSet={dataSet != undefined ? dataSet : []} filename="synthesis-reports" />
      <StyledDataGrid
        rows={rows}
        hideFooter={hideFooter === true || dataSet.length === 0 || dataSet.length < MAX_PAGE_SIZE}
        columns={columns}
        slots={{
          noRowsOverlay: NoRowsOverlay,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        density="compact"
        disableRowSelectionOnClick
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      />
    </Box>
  )
}
