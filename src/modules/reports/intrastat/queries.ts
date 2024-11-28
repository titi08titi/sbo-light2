import { useQuery } from '@tanstack/react-query'
import { getSambotClientWithToken } from '../../../core/client'
import { Country } from '../../../utils/countries'
import { Period } from '../../../utils/periods'

interface DownloadParams {
  year?: number
  month?: number
  country?: string
}

export const downloadIntrastat = async (params: DownloadParams): Promise<Blob> => {
  try {
    const sambotClient = await getSambotClientWithToken()
    const queryParams = new URLSearchParams()
    
    if (params.year) {
      queryParams.append('year', params.year.toString())
    }
    if (params.month) {
      queryParams.append('month', params.month.toString())
    }
    if (params.country) {
      queryParams.append('country', params.country)
    }

    const response = await sambotClient.get(`/intrastats/download?${queryParams.toString()}`, {
      responseType: 'blob',
      timeout: 30000
    })

    return new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
  } catch (error) {
    console.error('Download error:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to download report')
  }
}

export const useDownloadIntrastat = (country?: Country | null, period?: Period | null) => {
  return useQuery(
    ['intrastat', 'download', { country: country?.code, period: period?.label }],
    () => downloadIntrastat({
      year: period?.year,
      month: period?.type === 'month' ? period.month : undefined,
      country: country?.code
    }),
    {
      enabled: false,
      cacheTime: 0,
      retry: 1,
      retryDelay: 1000
    }
  )
}