/**
 * Configuration des field names pour les fichiers SDR Accreditation
 *
 * Les fichiers uploadés avec ces field names seront automatiquement regroupés
 * dans companyDocuments ou technicalManagerDocuments selon leur catégorie
 */

/**
 * Field names pour les documents de l'entreprise
 * Les fichiers avec ces field names seront regroupés dans companyDocuments
 */
export const SDR_ACCREDITATION_COMPANY_FIELDS = [
  'registre_commerce',
  'registrecommerce',
  'statut',
  'statuts',
  'certificat_immatriculation',
  'certificatimmatriculation',
  'attestation_fiscale',
  'attestationfiscale',
  'autorisation_exploitation',
  'autorisationexploitation',
  'licence',
  'agrement',
  'certificat',
  // Ajoutez d'autres field names pour les documents de l'entreprise ici
];

/**
 * Field names pour les documents du responsable technique
 * Les fichiers avec ces field names seront regroupés dans technicalManagerDocuments
 */
export const SDR_ACCREDITATION_TECHNICAL_MANAGER_FIELDS = [
  'diplome',
  'diplomes',
  'cv',
  'curriculum_vitae',
  'curriculumvitae',
  'attestation_experience',
  'certificat_formation',
  'certificatformation',
  'attestation_competence',
  'attestationcompetence',
  'carte_identite',
  'piece_identite',
  // Ajoutez d'autres field names pour les documents du responsable technique ici
];

/**
 * Vérifie si un field name appartient aux documents de l'entreprise
 */
export function isCompanyField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().trim();
  return SDR_ACCREDITATION_COMPANY_FIELDS.some((field) => {
    const fieldNormalized = field.toLowerCase().trim();
    // Correspondance exacte ou correspondance après normalisation (sans tirets/underscores)
    return (
      normalized === fieldNormalized ||
      normalized.replace(/[_-]/g, '') === fieldNormalized.replace(/[_-]/g, '')
    );
  });
}

/**
 * Vérifie si un field name appartient aux documents du responsable technique
 */
export function isTechnicalManagerField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().trim();
  return SDR_ACCREDITATION_TECHNICAL_MANAGER_FIELDS.some((field) => {
    const fieldNormalized = field.toLowerCase().trim();
    // Correspondance exacte ou correspondance après normalisation (sans tirets/underscores)
    return (
      normalized === fieldNormalized ||
      normalized.replace(/[_-]/g, '') === fieldNormalized.replace(/[_-]/g, '')
    );
  });
}
