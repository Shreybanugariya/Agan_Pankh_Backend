const customMessages = {
    custom_message: { code: 200, message: 'custom message' },
    user_create_success: { code: 200, message: 'Congratulations!! You have been registered successfully.' },
    login_otp_success: { code: 205, message: 'Verification OTP sent to your registered mobile number.' },
    already_exists_email: { code: 409, message: 'User already exists with email id' },
    already_exists_mobile: { code: 409, message: 'User already exists with mobile number' },
    already_exists_facebook: { code: 409, message: 'User already exists with facebook account' },
    already_exists_google: { code: 409, message: 'User already exists with google account' },
    already_exists_apple: { code: 409, message: 'User already exists with apple account' },
    already_exists_username: { code: 409, message: 'This username is already taken try another.' },
    user_not_found: { code: 404, message: "Sorry, we didn't find any account with that Email id/Mobile number" },
    user_blocked: { code: 419, message: 'Your account is blocked please contact to the support' },
    user_deleted: { code: 419, message: 'Your account is deleted please contact to the support' },
    verified_mobile_change: { code: 409, message: 'You can not change mobile number, please contact support' },
    verified_address_change: { code: 409, message: 'You can not change address details, please contact support' },
    verified_email_change: { code: 409, message: 'You can not change email, please contact support' },
    disposable_mail_fault: { code: 403, message: 'Please sign up with valid email. Disposable mails are not allowed' },
    kyc_not_updated: { code: 419, message: 'Please update your kyc details first' },
    kyc_not_approved: { code: 419, message: 'Please wait for your KYC to be approved' },
    kyc_rejected: { code: 419, message: 'Your KYC is rejected please contact support' },
    duplicate_bank: { code: 419, message: 'Bank number already exist' },
};
/**
 * Push notification messages
 */
const notifications = {};

const builder = {
    wrong_credentials: (prefix) => builder.prepare(403, prefix, 'Invalid credentials.'),
    unauthorized: (prefix) => builder.prepare(401, prefix, 'Authentication Error, Please try logging again.'),
    invalid_req: (prefix) => builder.prepare(406, prefix, 'invalid Request.'),
    wrong_otp: (prefix) => builder.prepare(403, prefix, 'entered OTP is invalid.'),
    wrong_password: (prefix) => builder.prepare(403, prefix, 'The current password you entered was incorrect.'),
    server_error: (prefix) => builder.prepare(500, prefix, 'server error.'),
    server_maintenance: (prefix) => builder.prepare(500, prefix, 'maintenance mode is active.'),
    inactive: (prefix) => builder.prepare(403, prefix, 'inactive.'),
    not_found: (prefix) => builder.prepare(404, prefix, 'not found.'),
    not_matched: (prefix) => builder.prepare(406, prefix, 'not matched.'),
    not_verified: (prefix) => builder.prepare(406, prefix, 'not verified.'),
    already_exists: (prefix) => builder.prepare(409, prefix, 'already exists.'),
    user_deleted: (prefix) => builder.prepare(406, prefix, 'deleted by admin.'),
    user_blocked: (prefix) => builder.prepare(406, prefix, 'blocked by admin.'),
    required_field: (prefix) => builder.prepare(419, prefix, 'field required.'),
    too_many_request: (prefix) => builder.prepare(429, prefix, 'too many request.'),
    expired: (prefix) => builder.prepare(417, prefix, 'expired.'),
    canceled: (prefix) => builder.prepare(419, prefix, 'canceled.'),
    created: (prefix) => builder.prepare(200, prefix, 'created.'),
    updated: (prefix) => builder.prepare(200, prefix, 'updated.'),
    deleted: (prefix) => builder.prepare(417, prefix, 'deleted.'),
    blocked: (prefix) => builder.prepare(401, prefix, 'blocked.'),
    success: (prefix) => builder.prepare(200, prefix, 'success.'),
    delete_success: (prefix) => builder.prepare(200, prefix, 'deleted successfully.'),
    
    successfully: (prefix) => builder.prepare(200, prefix, 'successfully.'),
    error: (prefix) => builder.prepare(500, prefix, 'error.'),
    no_prefix: (prefix) => builder.prepare(200, prefix, ''),
    custom: { ...customMessages },
    getString: (key) => (customMessages ? customMessages[key].message : ''),
    not_allowed: (prefix) => builder.prepare(409, prefix, 'not allowed.'),
    // custom: key => builder.prepare(...customMessages[key], ''),
    notifications,

};

Object.defineProperty(builder, 'prepare', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: (code, prefix, message) => ({
        code,
        message: `${prefix ? `${prefix} ${message}` : message}`,
    }),
});

module.exports = builder;