import type { PrismaClient, TypeRegul } from '@prisma/client'

/** Valeurs du formulaire public « Diagnostic foncier » → enum Prisma. */
export function diagnosticSituationToTypeRegul(situation: string): TypeRegul {
  const map: Record<string, TypeRegul> = {
    ph_vers_tf: 'PH_TO_TF',
    premier_tf: 'PREMIER_TF',
    mutation: 'MUTATION',
    litige: 'LITIGE',
    morcellement: 'MORCELLEMENT',
    audit: 'AUDIT',
    autre: 'AUDIT',
  }
  return map[situation] ?? 'AUDIT'
}

export async function generateUniqueDossierReference(db: PrismaClient): Promise<string> {
  const year = new Date().getFullYear()
  for (let i = 0; i < 12; i++) {
    const ref = `DOS-${year}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const taken = await db.dossierFoncier.findUnique({ where: { reference: ref }, select: { id: true } })
    if (!taken) return ref
  }
  return `DOS-${year}-${Date.now().toString(36).toUpperCase()}`
}
