# Spec: Confirmation email without an Alert address

Status: ready-for-agent

## Problem Statement

A visitor who sends a form on the Marketing site is promised an Arabic confirmation email (spec: Forms, "an Arabic confirmation is sent to the applicant"). Today that confirmation depends on something the visitor has nothing to do with: whether an Editor has set that form's **Alert address**.

While a form's Alert address is empty, the site sends no email at all about its Submissions — no alert to the team, and no confirmation to the visitor. The Submission is still stored, and the page still tells the visitor «وصلنا طلبك», but no email follows. This was ticket 27's literal reading of "nothing sent while no alert address is set", chosen so that nobody is emailed before the team is ready to answer.

The founder has since asked for the confirmation to be decided separately, at a later stage. The gap shows up whenever a form goes live before its Alert address is set:
- at launch, if the address is supplied late (spec: Further Notes lists it as awaited);
- each time a later form (Referral Program signup, Partnership Program application, Pour Tracker download) joins the submission pipeline with an empty address;
- whenever an Editor clears the address.

In all of these, visitors get less than the site promises, and nothing on the page or in the admin warns anyone.

## Solution

The confirmation to the visitor no longer waits for an Alert address. For every stored Submission, the visitor's Arabic confirmation goes out whenever the site has a mailbox to send from. The Alert address governs the team's alert and nothing else.

An Editor can see on each Submission what became of each of its two emails, and why one was not sent. The admin's descriptions say plainly which email depends on what.

## User Stories

1. As a prospect who requested a demo, I want an Arabic confirmation email as soon as my request is stored, so that I know it arrived even if the team has not yet said where alerts go.
2. As a prospect, I want the confirmation to arrive whether or not anyone at Rabaed is being alerted, so that what I am promised does not depend on the company's internal setup.
3. As a referrer signing up to the Referral Program, I want the same confirmation behaviour as the demo request, so that every form treats me the same way.
4. As an engineering office applying to the Partnership Program, I want my confirmation to arrive even on the day the form first goes live, so that my application does not look lost.
5. As a site engineer downloading the Pour Tracker, I want the confirmation email to follow my download regardless of the team's alert settings, so that I have the tool's details in my inbox.
6. As a visitor whose request was turned away (trap field, too many from one address) or not stored, I want no confirmation email, so that I am never told something arrived that did not.
7. As a visitor who sends the same request twice, I want exactly one confirmation email, so that my inbox is not cluttered.
8. As Ahmed, I want the Alert address to control only where the team's alerts go, so that setting it late never costs a visitor their confirmation.
9. As Ahmed, I want the form settings to say clearly that the confirmation goes to every applicant and the alert only to the Alert address, so that I understand what each setting does.
10. As Ahmed, I want each Submission to show whether its confirmation was sent, not sent, or failed, so that I can follow up with anyone who did not receive one.
11. As Ahmed, I want a Submission whose alert was not sent to say it was because no Alert address was set, so that I know to set one.
12. As Ahmed, I want a Submission whose confirmation was not sent to say it was because no mailbox is configured, so that I know the cause is the mailbox, not the form.
13. As Ahmed, I want to keep changing the confirmation email's subject and text from the CMS as today, so that this change takes nothing away from what I can edit.
14. As the team, I want to go on receiving alerts only once we have set the Alert address, so that we choose when requests start reaching our inbox.
15. As the team, I want a preview or test environment without mailbox credentials to send nothing, so that trying the site out never emails real people.
16. As the team, I want a failure to send a confirmation to be recorded rather than breaking the visitor's submission, so that a mailbox problem never loses a request.
17. As a developer adding a form to the submission pipeline, I want the new rule to apply to it automatically, so that no form has to opt in to confirmations.

## Implementation Decisions

- **One rule change, in the submission pipeline's email step.** The team alert is sent only when the form's Alert address is set. The visitor's confirmation is sent for every stored Submission, whether or not an Alert address is set. The pipeline's other steps — screening, checking, limiting, storing once — are unchanged.
- **Both emails still go out after the visitor is answered**, and each email's outcome is still written on the Submission: sent, not sent, or failed.
- **"Not sent" gains its reason**, so the admin distinguishes an alert not sent for want of an Alert address from any email not sent for want of a mailbox. Whether this becomes two outcome values or stays one with clearer wording is the implementer's choice, provided the admin shows the reason. If the stored values change, a migration carries existing records across.
- **Mailbox configuration is unchanged.** With no mailbox credentials on an environment, neither email is sent and both are recorded as not sent; the site works the same.
- **Every form in the pipeline follows the rule.** It lives in the shared pipeline, not in any Form definition, so the Referral Program signup, the Partnership Program application and the Pour Tracker download inherit it when they join.
- **Admin wording updated.** The Alert address description stops saying that nothing is sent while it is empty. The confirmation email section stops saying that it depends on the Alert address. Both descriptions are given in Arabic and English, like the rest of the admin.
- **Deployment documentation updated.** Its Forms section says the confirmation goes to every applicant once a mailbox is configured, and the Alert address governs only the team's alert. It keeps the advice to leave mailbox credentials off Preview.
- **No change** to the confirmation's content, its placeholder for the applicant's name, the alert's content, or which fields any form has.

## Testing Decisions

- **What makes a good test:** it asserts what a visitor or Editor can observe — the confirmation on the page, the mail that reaches the test outbox, the outcomes shown on the stored Submission. It never asserts the pipeline's internals.
- **One seam: the running application, driven by Playwright**, as the rest of the suite. Mail is observed through the test server's outbox, the adapter the tests already read. No new seam is needed.
- **The form submission test module is the place.** Its tests of mail and wording from the admin change the one Editors share, the demo request form's Alert address, one at a time. The case that asserts no mail at all while no Alert address is set becomes two assertions: the visitor's confirmation reaches the outbox, and no alert does, with the Submission recording the confirmation as sent and the alert as not sent for want of an address.
- **Kept as they are:** the case with an Alert address set (both emails sent, both recorded), and the cases proving a turned-away, invalid or repeated request produces no second Submission. To the last, add that such requests produce no confirmation email either.
- **Not tested end to end:** the "no mailbox configured" path. The test server always provides an outbox, and adding a second server configuration for one branch costs more than it proves. If it needs coverage, it belongs in a check that runs without the outbox, not in this module.
- **Prior art:** the form submission test module, including its outbox reading and its serial group for the shared form settings. The CMS suite shows how to put back what a test changed.

## Out of Scope

- Changing what the confirmation or the alert says, or who can edit it.
- A per-form Editor switch for turning confirmations off. If the founder wants the old behaviour available per form, that is a separate spec.
- Sending alerts to more than one address.
- How the site signs in to the Microsoft 365 mailbox (password versus a sign-in Microsoft still accepts).
- The Referral Program's referral code, which no ticket issues yet.
- Wiring the Referral Program signup, Partnership Program application or Pour Tracker download into the pipeline — tickets 28, 29 and 30.

## Further Notes

- **Deferred by the founder on 15 September 2026**, while ticket 27 was in review: its literal reading ships first, and this changes it at a later stage. Take it only once ticket 27 is merged.
- **Before implementing, confirm the timing with the founder.** Once this ships, any environment with mailbox credentials emails every applicant, even while no Alert address is set — including production before launch, if credentials are added early.
- Ticket 27's comments record the original reading, and say the change is a single condition in the pipeline's email step. This spec widens that note to cover the admin wording, the recorded reasons and the documentation, so that Editors are not misled.
