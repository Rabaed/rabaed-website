# The unified number is the company's identifier, not its tax number

The co-founder's draft of the company's structured data (`reference/HANDOFF.md` §6.3) states the unified number 7050078786 as `taxID`. We are not building that: the structured data states it as an `identifier`, a `PropertyValue` named «الرقم الموحد».

7050078786 is the establishment's unified national number, the number CONTEXT.md records. It is not a tax registration: a Saudi VAT number is a different, fifteen-digit number. schema.org's `taxID` means the tax or fiscal ID, so stating the unified number there would be a false statement about the company in exactly the data search engines and AI assistants are meant to trust (spec: SEO and GEO — no invented facts). `identifier` states the number without claiming what kind of registration it is not. Chosen on 15 September 2026, when ticket 32 was built.

## Consequences

- `src/content/company.ts` holds the number once, with its name; `src/components/structured-data.tsx` emits it as the organisation's `identifier`, and `tests/e2e/structured-data.spec.ts` checks it is there.
- If the founders want the VAT number in the structured data, it goes in `taxID` beside this, as the second fact it is.
