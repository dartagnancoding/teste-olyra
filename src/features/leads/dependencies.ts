import { httpLeadGateway } from '@/features/leads/data/http-lead-gateway'
import type { LeadGateway } from '@/features/leads/types/lead-gateway'

/**
 * Composition root da feature — o único ponto que escolhe implementações
 * concretas. Trocar de provedor é editar este arquivo, e só ele.
 *
 * As dependências de servidor (repositório, mailer) vivem em
 * `dependencies.server.ts`, separadas para que este módulo, importado por
 * componentes client, nunca arraste `server-only` para o bundle.
 */
export const leadGateway: LeadGateway = httpLeadGateway
