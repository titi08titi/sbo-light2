import { useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { toast } from 'react-toastify'
import { IntrastatReportsTable } from '../../components/reports/intrastat/IntrastatReportsTable'
import { PageContainer } from '../../components/layout/PageContainer'
import { CountrySelector } from '../../components/common/CountrySelector'
import { PeriodSelector } from '../../components/common/PeriodSelector'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Country } from '../../utils/countries'
import { Period } from '../../utils/periods'
import { useDownloadIntrastat } from '../../modules/reports/intrastat/queries'

const mockData = [
  {
    id: 1,
    year: 2024,
    month: 1,
    isOpen: true,
    variationDate: '2024-01-01'
  },
  {
    id: 2, 
    year: 2023,
    month: 12,
    isOpen: false,
    variationDate: '2023-12-01'
  }
]

export default function IntrastatPage() {
  const [data] = useState(mockData)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const downloadQuery = useDownloadIntrastat(selectedCountry, selectedPeriod)

  const handleDownload = async () => {
    if (isDownloading) return
    
    setIsDownloading(true)
    try {
      const { data: fileData } = await downloadQuery.refetch()
      
      if (!fileData) {
        throw new Error('No data received')
      }

      // Create and trigger download
      const url = window.URL.createObjectURL(fileData)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename
      const countryCode = selectedCountry?.code || 'ALL'
      const periodLabel = selectedPeriod?.label || 'ALL'
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `intrastat_${countryCode}_${periodLabel}_${timestamp}.xlsx`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup URL after small delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 100)

      toast.success('Report downloaded successfully')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download report'
      toast.error(message)
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
      setConfirmOpen(false)
    }
  }

  const handleCancel = () => {
    setConfirmOpen(false)
  }

  const getConfirmationMessage = () => {
    if (selectedCountry && selectedPeriod) {
      return `Voulez vous télécharger l'intrastat de ${selectedPeriod.label} pour ${selectedCountry.name} ?`
    }
    if (selectedCountry) {
      return `Voulez vous télécharger l'intrastat pour ${selectedCountry.name} ?`
    }
    if (selectedPeriod) {
      return `Voulez vous télécharger l'intrastat de ${selectedPeriod.label} pour tous les pays ?`
    }
    return "Voulez vous télécharger l'intrastat ?"
  }

  return (
    <PageContainer title="Intrastat Reports">
      <Stack spacing={3} direction="row" sx={{ mb: 3 }} alignItems="center">
        <Box sx={{ width: 300 }}>
          <CountrySelector
            value={selectedCountry}
            onChange={setSelectedCountry}
            label="Select Country"
          />
        </Box>
        <Box sx={{ width: 300 }}>
          <PeriodSelector
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            label="Select Period"
          />
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={() => setConfirmOpen(true)}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>
      </Stack>

      <IntrastatReportsTable 
        dataSet={data}
        onDownloadClick={handleDownload}
        isDownloading={isDownloading}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Download"
        message={getConfirmationMessage()}
        onConfirm={handleDownload}
        onCancel={handleCancel}
      />
    </PageContainer>
  )
}