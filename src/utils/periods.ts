export type PeriodType = 'month' | 'quarter' | 'year'

export interface Period {
  type: PeriodType
  year: number
  quarter?: number
  month?: number
  label: string
}

export function generatePeriods(startYear: number = new Date().getFullYear() - 2): Period[] {
  const currentYear = new Date().getFullYear()
  const periods: Period[] = []

  // Generate periods for last 2 years + current year
  for (let year = currentYear; year >= startYear; year--) {
    // Add year period
    periods.push({
      type: 'year',
      year,
      label: `${year}`
    })

    // Add quarters
    for (let quarter = 4; quarter >= 1; quarter--) {
      periods.push({
        type: 'quarter',
        year,
        quarter,
        label: `${year} Q${quarter}`
      })
    }

    // Add months
    for (let month = 12; month >= 1; month--) {
      periods.push({
        type: 'month',
        year,
        month,
        label: `${year}-${month.toString().padStart(2, '0')}`
      })
    }
  }

  return periods
}