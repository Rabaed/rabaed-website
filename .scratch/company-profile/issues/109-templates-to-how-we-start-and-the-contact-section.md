# 109: The Company profile from templates to its close: sections 10–14, the contact section and the floating WhatsApp button

**What to build:** Ahmed's sections 10–14, his footer as the page's last section, and the floating WhatsApp button (spec: Sections, in order; Buttons and links).

**Blocked by:** 102 (the page has to exist).

**Lane:** 1b

**Status:** ready-for-agent

- [ ] 10 Pre-made templates (`#templates`): the hint and the nine flip cards (SAR, MAR, DAR, MIR, WIR, RFI, DAS, NPD, NPV), turned by click or keyboard (`aria-pressed`)
- [ ] 11 Why Rabaed (`#why`): the three cards
- [ ] 12 The impact (`#impact`): the six figures, counting up as they come into view (still under reduced motion), the activation line, and the source line «المصدر: بيانات مشاريع ربائد» / "Source: Rabaed project data"
- [ ] 13 Plans (`#plans`): the three plans with their features and the «الأكثر طلباً» badge, without prices
- [ ] 14 How we start (`#start`): the three steps and the closing card with "Book a live demo" and "WhatsApp us". Each button has an editable label and link
- [ ] The contact section (`#contact`), from Ahmed's footer: the tagline, Ahmed's name, mobile and email, the company WhatsApp (site settings), the location and the social links (site settings where the site has them). Then the site's own footer, unchanged
- [ ] A floating WhatsApp button, on the Company profile only, to the site's WhatsApp address
- [ ] Each section has a show switch, and the words are seeded from `../source/*.json`. Every size, font and colour is from the site's tokens and type. No sideways overflow at ticket 86's phone widths
- [ ] Tests cover the flip cards, the buttons' links, the floating button's absence from other pages, and words reaching the page from the CMS
