export interface MythFact {
  myth: string;
  fact: string;
}

export const mythsFacts: MythFact[] = [
  {
    myth: 'Census data will be shared with police or used against individuals.',
    fact: 'Census data is confidential and protected under the Census Act, 1948. Individual records cannot be used as evidence in court or shared with any agency for legal/administrative action against a person.',
  },
  {
    myth: 'You must pay a fee to complete self-enumeration.',
    fact: 'Self-enumeration on the official portal is completely free. Anyone asking for payment is attempting fraud — report it immediately.',
  },
  {
    myth: 'Only citizens with an Aadhaar card can be counted.',
    fact: 'Aadhaar is not mandatory for census participation. The census counts every usual resident of the country, regardless of citizenship or documentation status.',
  },
  {
    myth: 'Religion and caste data collected will be made public individually.',
    fact: 'Data is published only in aggregated, anonymized form for policy and research use — never linked to identifiable individuals.',
  },
  {
    myth: 'Self-enumeration replaces the physical enumerator visit entirely.',
    fact: 'Self-enumeration is an optional first step. A trained enumerator may still visit to verify or assist, especially for households without digital access.',
  },
  {
    myth: 'SMS or email links claiming to be "Census 2027 verification" are official.',
    fact: 'The government will never ask for OTPs, bank details, or payments via SMS/email links. Always use the official census portal directly.',
  },
];
