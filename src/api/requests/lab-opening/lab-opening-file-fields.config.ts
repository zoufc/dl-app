/**
 * Configuration des field names pour les fichiers Lab Opening
 *
 * Les fichiers uploadés avec ces field names seront automatiquement regroupés
 * dans administrativeDocuments ou technicalDocuments selon leur catégorie
 */

/**
 * Field names pour les documents administratifs
 * Les fichiers avec ces field names seront regroupés dans administrativeDocuments
 */
export const LAB_OPENING_ADMINISTRATIVE_FIELDS = [
  'autorisation',
  'licence',
  'agrement',
  'certificat',
  'certificat_ouverture',
  'demande_ouverture',
  'arrete',
  'arrete_ouverture',
  // Ajoutez d'autres field names pour les documents administratifs ici
];

/**
 * Field names pour les documents techniques
 * Les fichiers avec ces field names seront regroupés dans technicalDocuments
 */
export const LAB_OPENING_TECHNICAL_FIELDS = [
  'plan',
  'plan_laboratoire',
  'equipement',
  'liste_equipement',
  'procedure',
  'manuel_qualite',
  'rapport_technique',
  'specification',
  'specifications',
  // Ajoutez d'autres field names pour les documents techniques ici
];

/**
 * Vérifie si un field name appartient aux documents administratifs
 */
export function isAdministrativeField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().trim();
  return LAB_OPENING_ADMINISTRATIVE_FIELDS.some((field) => {
    const fieldNormalized = field.toLowerCase().trim();
    // Correspondance exacte ou correspondance après normalisation (sans tirets/underscores)
    return (
      normalized === fieldNormalized ||
      normalized.replace(/[_-]/g, '') === fieldNormalized.replace(/[_-]/g, '')
    );
  });
}

/**
 * Vérifie si un field name appartient aux documents techniques
 */
export function isTechnicalField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().trim();
  return LAB_OPENING_TECHNICAL_FIELDS.some((field) => {
    const fieldNormalized = field.toLowerCase().trim();
    // Correspondance exacte ou correspondance après normalisation (sans tirets/underscores)
    return (
      normalized === fieldNormalized ||
      normalized.replace(/[_-]/g, '') === fieldNormalized.replace(/[_-]/g, '')
    );
  });
}
