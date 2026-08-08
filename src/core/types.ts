// Temporal/domain v2 types for Tarif Pajak ID. Discriminated unions and provenance
// metadata described in docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md.

export type DateString = string;
export type DecimalString = string;

export type DateInterval = {
  validFrom: DateString;
  validToExclusive: DateString | null;
};

export type VerificationStatus =
  | 'verified_primary'
  | 'verified_secondary'
  | 'needs_review'
  | 'source_conflict'
  | 'summary_only';

export type ProgressiveBracket = {
  upTo: DecimalString | null;
  rate: DecimalString;
};

export type Rate =
  | { type: 'percentage'; value: DecimalString }
  | { type: 'fixed'; amount: DecimalString; currency: string }
  | { type: 'specific'; amount: DecimalString; unit: string; currency?: string }
  | { type: 'progressive'; brackets: ProgressiveBracket[] }
  | { type: 'formula'; expression: string }
  | { type: 'range'; min: DecimalString; max: DecimalString }
  | { type: 'free_text'; text: string }
  | { type: 'zero' }
  | { type: 'not_applicable' }
  | { type: 'information_factor'; factor: DecimalString };

export type ConditionExpression =
  | { op: 'equals'; fact: string; value: unknown }
  | { op: 'in'; fact: string; value: unknown[] }
  | { op: 'exists'; fact: string }
  | { op: 'and'; conditions: ConditionExpression[] }
  | { op: 'or'; conditions: ConditionExpression[] }
  | { op: 'not'; condition: ConditionExpression };

export type SourceRole = 'primary' | 'secondary' | 'tertiary';

export type Source = {
  id: string;
  name: string;
  official: boolean;
  role?: SourceRole;
  regulationId?: string;
  locator?: string;
  url?: string;
  accessedAt?: DateString;
};

export type EvidenceRef = {
  claim: 'rate' | 'interval' | 'condition';
  sourceId: string;
  locator: string;
};

export type Verification = {
  status: VerificationStatus;
  sourceIds: string[];
  evidence?: EvidenceRef[];
  verifiedAt?: DateString;
  verifiedBy?: string;
};

export type Example = {
  id: string;
  label?: string;
  illustrative: boolean;
  input: Record<string, unknown>;
  expectedAmount?: DecimalString;
  notes?: string;
};

export type TaxRule = {
  id: string;
  conceptId: string;
  categoryId?: string;
  validFrom: DateString;
  validToExclusive: DateString | null;
  rate?: Rate;
  conditions?: ConditionExpression;
  verification?: Verification;
  exclusiveGroup?: string;
  supersedes?: string[];
  supersededBy?: string[];
  bppuId?: string;
  examples?: Example[];
  notes?: string;
};

export type Concept = {
  id: string;
  categoryId: string;
  name: string;
  slug?: string;
  description?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type BppuCode = {
  id: string;
  code: string;
  label?: string;
  validFrom?: DateString;
  validToExclusive?: DateString | null;
};

export type ConflictKind = 'rate' | 'interval' | 'condition' | 'scope';

export type Conflict = {
  id: string;
  kind: ConflictKind;
  ruleIds: string[];
  description: string;
  declaredAt?: DateString;
};

export type V2Data = {
  sources: Source[];
  categories: Category[];
  concepts: Concept[];
  rules: TaxRule[];
  conflicts?: Conflict[];
  bppu?: BppuCode[];
};
