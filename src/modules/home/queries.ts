import { useQuery } from '@tanstack/react-query'
import { mockService } from '#core/mockService'
import { ProcessInfoSummary, ProcessStatistic } from '#utils/global'

export interface ProcessStatisticsKey {
  startDate?: string
  endDate?: string
}

async function getProcessesInfoSummary() {
  return mockService.getProcessSummary()
}

const useProcessesInfoSummary = () => useQuery<ProcessInfoSummary>(['Home_Get_ProcessesInfoSummary'], getProcessesInfoSummary)

async function getProcessesStatistics() {
  return mockService.getProcessStatistics()
}

const useProcessesStatistics = (processStatisticsKey?: ProcessStatisticsKey) =>
  useQuery<ProcessStatistic[]>(['Home_Get_ProcessesStatistics', processStatisticsKey], getProcessesStatistics)

export { useProcessesInfoSummary, useProcessesStatistics }