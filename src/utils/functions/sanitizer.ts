/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
export function sanitizeUser(user) {
  const sanitized = user.toObject();
  delete sanitized['password'];
  delete sanitized['codePin'];
  delete sanitized['created_at'];
  delete sanitized['updated_at'];
  return sanitized;
}
