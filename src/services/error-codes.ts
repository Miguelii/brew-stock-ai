export enum ErrorCode {
    // Analysis - Stock Analysis
    ANALYSIS_INVALID_PROMPT = 'x7kf2m9p',
    ANALYSIS_AI_GENERATION = 'q3vn8w4j',
    ANALYSIS_AI_NO_OUTPUT = 'r6ht5c1b',

    // Analysis - Latest News
    LATEST_NEWS_FETCH = 'c3nh8w2q',
    LATEST_NEWS_PARSE = 'm6xp4v7f',
    LATEST_NEWS_API_KEY_MISSING = 'c3nh8a23',

    // Analysis - Yahoo
    YAHOO_CLIENT_INIT = 'w2pd9x6k',
    YAHOO_INSIGHTS_FETCH = 'j8mc4v7n',
    YAHOO_QUOTE_SUMMARY = 'f5bz1h3t',
    YAHOO_SEARCH_CLIENT = 'n4yw6r9g',
    YAHOO_SEARCH_REQUEST = 'd1kp7m2x',

    // Analysis - Save
    SAVE_ANALYSIS_SB_CLIENT = 'v9tj3f8c',
    SAVE_ANALYSIS_UPDATE = 'h6wn2k5q',
    SAVE_ANALYSIS_UPDATE_ERR = 'b4xr8g1m',
    SAVE_STOCK_DATA_SB_CLIENT = 'p7cj5v9t',
    SAVE_STOCK_DATA_INSERT = 'k2mf6h4w',
    SAVE_STOCK_DATA_ERR = 'g9nb3x7d',

    // Auth - Session
    AUTH_SESSION_SB_CLIENT = 't5rv1k8p',
    AUTH_SESSION_GET_USER = 'y3wm7j2c',

    // Auth - Login
    AUTH_LOGIN_SB_CLIENT = 'z8hf4n6q',
    AUTH_LOGIN_SIGN_IN = 'a1xk9v3t',
    AUTH_LOGIN_SIGN_IN_ERR = 'e7pd2m5w',

    // Auth - Logout
    AUTH_LOGOUT_SB_CLIENT = 'c4bj8r1g',
    AUTH_LOGOUT_SIGN_OUT = 'u6nt3f9k',
    AUTH_LOGOUT_SIGN_OUT_ERR = 'i2yw7h4p',

    // Auth - OAuth
    OAUTH_GOOGLE_SB_CLIENT = 's9xc5v2m',
    OAUTH_GOOGLE_INIT = 'l3kj7t6b',
    OAUTH_GOOGLE_NO_URL = 'o8wn1r4f',
    OAUTH_CALLBACK_SB_CLIENT = 'q5hd9g3x',
    OAUTH_CALLBACK_EXCHANGE = 'm7pv2k6j',
    OAUTH_CALLBACK_SESSION = 'w1tc8n4y',

    // Reports - CRUD
    REPORT_CREATE_SB_CLIENT = 'f4xm6h9b',
    REPORT_CREATE_UNAUTH = 'r2kv3p7t',
    REPORT_CREATE_INVALID_PROMPT = 'j9wc5n1g',
    REPORT_CREATE_INSERT = 'd6yf8m4x',
    REPORT_CREATE_INSERT_ERR = 'h3bt7k2v',
    REPORT_LIST_SB_CLIENT = 'n8rj1w5p',
    REPORT_LIST_UNAUTH = 'x4mc9f3q',
    REPORT_LIST_FETCH = 'v7hk2t6d',
    REPORT_LIST_FETCH_ERR = 'b1pn5y8g',
    REPORT_BY_ID_SB_CLIENT = 'k6wv3m9j',
    REPORT_BY_ID_UNAUTH = 't2xf7c4n',
    REPORT_BY_ID_FETCH = 'y9hb1r5w',
    REPORT_BY_ID_FETCH_ERR = 'g4kp8t2m',

    // Reports - Process
    PROCESS_REPORT_SB_CLIENT = 'c7nj3v6f',
    PROCESS_REPORT_FETCH = 'p1yd9k4h',
    PROCESS_REPORT_NOT_FOUND = 'w5xm2b8t',
    PROCESS_REPORT_MARK_FAILED = 'a8rv6n3g',

    // Reports - Export
    EXPORT_REPORT_CHROMIUM = 'u3wk7p1c',
    EXPORT_REPORT_SB_CLIENT = 'i6hf4t9x',
    EXPORT_REPORT_UNAUTH = 'e2bm8v5j',
    EXPORT_REPORT_FETCH = 'o9nc3k7d',
    EXPORT_REPORT_FETCH_ERR = 'l4yp1h6w',
    EXPORT_REPORT_PDF = 's7xj5r2b',

    // Tokens
    TOKENS_GET_SB_CLIENT = 'z1mv8f4t',
    TOKENS_GET_UNAUTH = 'q6wk3n9p',
    TOKENS_GET_FETCH = 'a4hc7y2g',
    TOKENS_DEDUCT_SB_CLIENT = 'm9xt5b1j',
    TOKENS_DEDUCT_RPC = 'f3pv6k8w',
    TOKENS_DEDUCT_RPC_ERR = 'r7nd2m4c',
    TOKENS_INSUFFICIENT = 'h1yj9t6x',
    CHECKOUT_INVALID_PKG = 'v5wf3k8n',
    CHECKOUT_SB_CLIENT = 'b2mc7p4g',
    CHECKOUT_UNAUTH = 'd8hx1v6t',
    CHECKOUT_STRIPE_INIT = 'k4nj9r3w',
    CHECKOUT_STRIPE_CREATE = 'g6yb2f5p',
    INVOICES_SB_CLIENT = 'x3tv8m1k',
    INVOICES_UNAUTH = 'j7wc4h9n',
    INVOICES_STRIPE_INIT = 'p2xf6b3d',
    INVOICES_STRIPE_FETCH = 'n5kv1t7y',

    // Notifications
    PUSH_SUBSCRIBE_SB_CLIENT = 'c9mj4w2g',
    PUSH_SUBSCRIBE_UNAUTH = 'u6hx8r5f',
    PUSH_SUBSCRIBE_SAVE = 'i1nb3k7t',
    PUSH_SUBSCRIBE_SAVE_ERR = 'e4yp9v2m',
    PUSH_UNSUBSCRIBE_SB_CLIENT = 'o7wf5c1j',
    PUSH_UNSUBSCRIBE_UNAUTH = 'l3xt6h8d',
    PUSH_UNSUBSCRIBE_DELETE = 's9mv2n4b',
    PUSH_UNSUBSCRIBE_DELETE_ERR = 'z5kj7r1p',
    PUSH_SEND_FETCH_SUB = 'a8hc3y6w',
    PUSH_SEND_DISPATCH = 'q2nt9f4g',
    PUSH_SEND_SB_CLIENT = 'w4xv7m1k',
    PUSH_SEND_UNAUTH = 'y6bp3j8t',
    PUSH_SEND_USER_ERR = 'f9wk5c2n',
    PUSH_SEND_TO_USER_ERR = 'd3hm7v4x',
    PUSH_VAPID_SETUP = 'r5cj2n8w',
    PUSH_SEND_TO_USER_SB_CLIENT = 'k7mh4p9f',

    // Feedback
    FEEDBACK_SUBMIT_SB_CLIENT = 'n2qh7w5f',
    FEEDBACK_SUBMIT_INSERT = 'e8kv3m1p',
    FEEDBACK_SUBMIT_INSERT_ERR = 'z6xt9j4c',

    // Admin
    ADMIN_STATS_FETCH = 'admn_s7f3',
    ADMIN_UNAUTH = 'admn_unth',
    ADMIN_FEEDBACK_FETCH = 'admn_fbfch',
    ADMIN_FEEDBACK_FETCH_ERR = 'admn_fberr',

    // Consent
    CONSENT_COOKIE_CREATE = 't1yj6r9b',

    // Auth - OTP
    AUTH_OTP_SEND_SB_CLIENT = 'c2qx8n5f',
    AUTH_OTP_SEND_REQUEST = 'p7mv3h1k',
    AUTH_OTP_SEND_ERR = 'j4yt6b9w',
    AUTH_OTP_VERIFY_SB_CLIENT = 'r9kf2t7p',
    AUTH_OTP_VERIFY_REQUEST = 'g5hn8m3x',
    AUTH_OTP_VERIFY_ERR = 'v1wc4j6d',
}
