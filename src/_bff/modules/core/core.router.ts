import 'server-only'

import { router } from '@/_trpc/server'
import { CREATE_CONSENT_COOKIE_PUBLIC_CONTROLLER } from '@/_bff/modules/core/controllers/create-consent-cookie.controller'
import { SEND_PUSH_NOTIFICATION_PROTECTED_CONTROLLER } from '@/_bff/modules/core/controllers/send-push-notification.controller'
import { SUBMIT_FEEDBACK_PUBLIC_CONTROLLER } from '@/_bff/modules/core/controllers/submit-feedback.controller'
import { SUBSCRIBE_PUSH_PROTECTED_CONTROLLER } from '@/_bff/modules/core/controllers/subscribe-push.controller'
import { UNSUBSCRIBE_PUSH_PROTECTED_CONTROLLER } from '@/_bff/modules/core/controllers/unsubscribe-push.controller'

export const CORE_ROUTER = router({
    submitFeedback: SUBMIT_FEEDBACK_PUBLIC_CONTROLLER,
    createConsentCookie: CREATE_CONSENT_COOKIE_PUBLIC_CONTROLLER,
    subscribePush: SUBSCRIBE_PUSH_PROTECTED_CONTROLLER,
    unsubscribePush: UNSUBSCRIBE_PUSH_PROTECTED_CONTROLLER,
    sendPushNotification: SEND_PUSH_NOTIFICATION_PROTECTED_CONTROLLER,
})
