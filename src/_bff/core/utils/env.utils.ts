// Runtime environment checks shared by _bff (logger, jobs, PDF export) and the frontend (CSP).
export const getIsDev = (): boolean => {
    return process.env.NODE_ENV === 'development'
}
