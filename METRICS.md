# SpendLens Success Metrics

To ensure SpendLens achieves its goal of generating high-intent leads for Credex, we must track specific engagement and conversion signals. Vanity metrics like DAU are disregarded in favor of revenue-mapping behaviors.

## 1. NORTH STAR METRIC
**"Qualified leads sent to Credex per week"**

*   **Why:** This is the primary measure of SpendLens' effectiveness as a lead-generation engine. 
*   **Rationalization:** Daily Active Users (DAU) is a misleading metric for a utility tool that is typically used once a quarter or during budgeting cycles. Email captures are a secondary signal; the only metric that directly maps to Credex revenue is the number of qualified consultations actually booked from the audit results.

---

## 2. THREE INPUT METRICS (THE DRIVERS)

To move the North Star, we monitor and optimize these three conversion thresholds:

| Metric | Definition | Target |
| :--- | :--- | :--- |
| **Audit Completion Rate** | Visitors who complete the full audit form. | **>35%** |
| **Email Capture Rate** | Auditors who share their email to save the report. | **>30%** |
| **High-Savings Rate** | Audits identifying >$500/month in potential savings. | **>20%** |

---

## 3. WHAT TO INSTRUMENT FIRST

We will prioritize visibility into the conversion funnel over deep behavioral analysis. 

*   **Tracking Path:** `Page Load` → `Tool Selected` → `Form Submitted` → `Results Viewed` → `Email Captured` → `Slug Shared`.
*   **Tools:** Leverage **Vercel Analytics** (built-in and lightweight).
*   **Implementation:** Store simple event markers in `localStorage` as each step completes to track persistent progress across sessions.
*   **Priority:** The most critical gap to instrument first is the **Form → Results** drop-off. We need to know if users find the inputs too burdensome before seeing value.

---

## 4. WHAT NUMBER TRIGGERS A PIVOT?

Data-driven decision points are set after the first **500 audits**. If performance falls below these floors, we pivot the strategy:

*   **Email Capture Rate < 10%:**
    *   *Problem:* The results page isn't perceived as valuable enough to warrant an email share.
    *   *Pivot:* Improve the UI of the audit results and add more specific "AI recommendations" logic.
*   **High-Savings Rate < 5%:**
    *   *Problem:* The audit engine is either too conservative or the pricing data benchmarks are incorrect.
    *   *Pivot:* Recalibrate the audit engine's thresholds and verify industry pricing trends.
*   **Consultation Booking Rate < 2%:**
    *   *Problem:* The CTA connecting the audit to Credex is not compelling or poorly placed.
    *   *Pivot:* Revise the CTA copy and experiment with placement/timing of the "Expert Consultation" offer.
