/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
export function sanitizeUser(user) {
  if (!user) return null;

  // Si c'est un document Mongoose, convertir en objet
  const sanitized = user.toObject ? user.toObject() : { ...user };

  // Supprimer les informations sensibles
  delete sanitized['password'];
  delete sanitized['codePin'];
  delete sanitized['created_at'];
  delete sanitized['updated_at'];

  return sanitized;
}

/**
 * Sanitize un utilisateur (fonctionne avec documents Mongoose et objets simples)
 * Version simplifiée pour les objets déjà convertis
 */
export function sanitizeUserObject(user: any): any {
  if (!user) return null;

  const sanitized = { ...user };

  // Supprimer les informations sensibles
  delete sanitized.password;
  delete sanitized.codePin;
  delete sanitized.created_at;
  delete sanitized.updated_at;

  return sanitized;
}
