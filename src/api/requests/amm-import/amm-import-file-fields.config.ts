/**
 * Configuration des field names pour les fichiers AMM Import
 *
 * Les fichiers uploadés avec ces field names seront automatiquement regroupés
 * dans administrativeDocuments ou technicalDocuments selon leur catégorie
 */

/**
 * Field names pour les documents administratifs
 * Les fichiers avec ces field names seront regroupés dans administrativeDocuments
 */
export const AMM_IMPORT_ADMINISTRATIVE_FIELDS = [
  'demande_amm',
  'demandeamm',
  'licence',
  'agrement',
  'certification',
  'certification_norme',
  'certification-norme',
  'certificationnorme',
  // Ajoutez d'autres field names pour les documents administratifs ici
];

/**
 * Field names pour les documents techniques
 * Les fichiers avec ces field names seront regroupés dans technicalDocuments
 */
export const AMM_IMPORT_TECHNICAL_FIELDS = [
  'fiche_technique',
  'fiche-technique',
  'fichetechnique',
  'rapport_analytique',
  'rapport-analytique',
  'rapportanalytique',
  'certificat_qualite',
  'certificat-qualite',
  'certificatqualite',
  // Ajoutez d'autres field names pour les documents techniques ici
];

/**
 * Vérifie si un field name appartient aux documents administratifs
 */
export function isAdministrativeField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().replace(/[_-]/g, '');
  return AMM_IMPORT_ADMINISTRATIVE_FIELDS.some((field) =>
    normalized.includes(field.toLowerCase().replace(/[_-]/g, '')),
  );
}

/**
 * Vérifie si un field name appartient aux documents techniques
 */
export function isTechnicalField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().replace(/[_-]/g, '');
  return AMM_IMPORT_TECHNICAL_FIELDS.some((field) =>
    normalized.includes(field.toLowerCase().replace(/[_-]/g, '')),
  );
}
