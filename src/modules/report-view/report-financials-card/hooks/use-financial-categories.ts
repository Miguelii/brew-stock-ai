import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import type { FinancialCategory } from '@/types/FinancialCategory'
import { getFinancialCategories } from '@/_bff/core/helpers/financial-categories.helper'

export const useFinancialCategories = (
    financials: StockFinancials | null,
    fundamentals: StockFundamentals | null
): FinancialCategory[] => getFinancialCategories(financials, fundamentals)
