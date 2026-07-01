import 'server-only'

import { router } from '@/_trpc/server'
import { SB_LOGIN_PUBLIC_CONTROLLER } from '@/_backend/modules/auth/controllers/sb-login.controller'
import { SB_LOGOUT_PUBLIC_CONTROLLER } from '@/_backend/modules/auth/controllers/sb-logout.controller'
import { SB_SEND_OTP_PUBLIC_CONTROLLER } from '@/_backend/modules/auth/controllers/sb-send-otp.controller'
import { SB_VERIFY_OTP_PUBLIC_CONTROLLER } from '@/_backend/modules/auth/controllers/sb-verify-otp.controller'

export const AUTH_ROUTER = router({
    signIn: SB_LOGIN_PUBLIC_CONTROLLER,
    logout: SB_LOGOUT_PUBLIC_CONTROLLER,
    sendOtp: SB_SEND_OTP_PUBLIC_CONTROLLER,
    verifyOtp: SB_VERIFY_OTP_PUBLIC_CONTROLLER,
})
