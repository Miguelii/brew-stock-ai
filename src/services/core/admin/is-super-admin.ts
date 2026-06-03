import 'server-only'

const ADMIN_EMAIL = 'andremcga3@gmail.com'

export function isSuperAdmin(email: string | undefined) {
    if (!email) return false
    return email === ADMIN_EMAIL
}
