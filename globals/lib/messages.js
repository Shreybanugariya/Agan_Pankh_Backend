const builder = {
    wrong_credentials: (prefix) => builder.prepare(403, prefix, 'Invalid credentials.'),
    unauthorized: (prefix) => builder.prepare(401, prefix, 'Authentication Error, Please try logging again.'),
    invalid_req: (prefix) => builder.prepare(406, prefix, 'invalid Request.'),
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
    getString: (key) => (customMessages ? customMessages[key].message : ''),
    not_allowed: (prefix) => builder.prepare(409, prefix, 'not allowed.'),
    // custom: key => builder.prepare(...customMessages[key], ''),

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