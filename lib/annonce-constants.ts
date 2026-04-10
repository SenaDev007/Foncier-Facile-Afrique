/** Valeurs stockées dans `Annonce.documents` — alignées sur les filtres du site public. */
export const ANNONCE_DOCUMENT_OPTIONS = [
  { value: 'TF', label: 'Titre foncier' },
  { value: 'ACD', label: 'ACD' },
  { value: 'PERMIS_HABITER', label: 'Permis d’habiter' },
  { value: 'AR', label: 'Attestation de Recasement (AR)' },
  { value: 'CEC', label: 'Certificat d’Enregistrement Cadastral (CEC)' },
] as const
