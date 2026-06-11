import 'server-only'

import { router } from '@/_trpc/server'
import { CREATE_REPORT_PROTECTED_CONTROLLER } from '@/backend/modules/reports/controllers/create-report.controller'
import { EXPORT_REPORT_PROTECTED_CONTROLLER } from '@/backend/modules/reports/controllers/export-report.controller'
import { GET_REPORT_BY_ID_PROTECTED_CONTROLLER } from '@/backend/modules/reports/controllers/get-report-by-id.controller'
import { GET_REPORTS_PROTECTED_CONTROLLER } from '@/backend/modules/reports/controllers/get-reports.controller'

export const REPORTS_ROUTER = router({
    create: CREATE_REPORT_PROTECTED_CONTROLLER,
    export: EXPORT_REPORT_PROTECTED_CONTROLLER,
    getById: GET_REPORT_BY_ID_PROTECTED_CONTROLLER,
    getAll: GET_REPORTS_PROTECTED_CONTROLLER,
})
