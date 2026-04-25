import type { PropmptsEnum } from './PropmptsEnum'

export enum ReportStatus {
    GENERATING = 'GENERATING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export type ReportDTO = {
    id: string
    created_at: string
    type: PropmptsEnum
    status: ReportStatus
    ai_response: string
    user_id: string
    stock: string
    sentiment: number
}

export type ReportListItem = Pick<ReportDTO, 'created_at' | 'id' | 'status' | 'stock' | 'type'>
