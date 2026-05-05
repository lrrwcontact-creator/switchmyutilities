"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const COLORS = {
  bg: "#F4F6FA", surface: "#FFFFFF", ink: "#1A2440", inkLight: "#5A6480",
  accent: "#C85C2D", accentLight: "#FAEDE6", border: "#DDE3EF",
  blue: "#2B4C8C", blueLight: "#EEF2FA", blueDark: "#1A3066",
  success: "#2D7D46", successLight: "#E8F5ED",
};

const s = {
  app: { minHeight: "100vh", background: COLORS.bg, fontFamily: "'Georgia','Times New Roman',serif", color: COLORS.ink },
  nav: { background: COLORS.blue, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" },
  navLogo: { color: "#FFF", fontSize: "18px", fontWeight: "700", letterSpacing: "0.5px" },
  navAccent: { color: COLORS.accent },
  hero: { background: COLORS.blue, padding: "60px 40px 80px", textAlign: "center", borderBottom: `4px solid ${COLORS.accent}` },
  heroEyebrow: { color: COLORS.accent, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" },
  heroTitle: { color: "#FFF", fontSize: "42px", fontWeight: "400", lineHeight: "1.2", maxWidth: "560px", margin: "0 auto 16px" },
  heroSub: { color: "#AAA9A8", fontSize: "16px", maxWidth: "440px", margin: "0 auto 32px", lineHeight: "1.6" },
  badge: { display: "inline-block", background: COLORS.accent, color: "#FFF", fontSize: "13px", padding: "6px 20px", borderRadius: "20px" },
  stepDots: { display: "flex", justifyContent: "center", gap: "8px", padding: "24px 0 0" },
  container: { maxWidth: "720px", margin: "0 auto", padding: "40px 24px" },
  card: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "32px", marginBottom: "20px", boxShadow: "0 2px 12px rgba(43,76,140,0.08)" },
  sectionTitle: { fontSize: "13px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: COLORS.accent, marginBottom: "20px", paddingBottom: "10px", borderBottom: `2px solid ${COLORS.accentLight}` },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" },
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "12px", fontWeight: "700", letterSpacing: "0.8px", textTransform: "uppercase", color: COLORS.inkLight, marginBottom: "6px" },
  input: { width: "100%", padding: "11px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: "5px", fontSize: "15px", fontFamily: "'Georgia',serif", color: COLORS.ink, background: COLORS.bg, boxSizing: "border-box", outline: "none" },
  select: { width: "100%", padding: "11px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: "5px", fontSize: "15px", fontFamily: "'Georgia',serif", color: COLORS.ink, background: COLORS.bg, boxSizing: "border-box", outline: "none", cursor: "pointer" },
  checkbox: { display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "12px" },
  checkboxInput: { width: "16px", height: "16px", accentColor: COLORS.accent, cursor: "pointer", marginTop: "2px", flexShrink: 0 },
  checkboxLabel: { fontSize: "14px", color: COLORS.ink, lineHeight: "1.5" },
  utilityCard: { background: COLORS.accentLight, border: `1.5px solid #E0C8B8`, borderRadius: "6px", padding: "20px", marginBottom: "14px" },
  addBtn: { background: "none", border: `1.5px dashed ${COLORS.accent}`, color: COLORS.accent, padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "13px", letterSpacing: "0.5px", width: "100%" },
  btnRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px", gap: "12px" },
  btnPrimary: { background: COLORS.accent, color: "#FFF", border: "none", padding: "13px 32px", borderRadius: "5px", fontSize: "14px", fontFamily: "'Georgia',serif", cursor: "pointer", fontWeight: "700" },
  btnSecondary: { background: "none", color: COLORS.inkLight, border: `1.5px solid ${COLORS.border}`, padding: "12px 24px", borderRadius: "5px", fontSize: "14px", fontFamily: "'Georgia',serif", cursor: "pointer" },
  feeBox: { background: COLORS.blue, borderRadius: "8px", padding: "24px", color: "#FFF", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  typeTag: { display: "inline-block", background: COLORS.accentLight, color: COLORS.accent, fontSize: "11px", padding: "2px 8px", borderRadius: "4px", marginRight: "4px", marginBottom: "2px", fontWeight: "600" },
  successBox: { textAlign: "center", padding: "60px 24px" },
  successIcon: { width: "64px", height: "64px", borderRadius: "50%", background: COLORS.successLight, border: `2px solid ${COLORS.success}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "28px" },
  errorBox: { background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#B91C1C" },
};

const UTILITY_TYPES = ["Electric", "Gas", "Water", "Sewer", "Trash", "Internet", "HOA"];
const emptyUtility = () => ({ id: Date.now() + Math.random(), type: "Electric", provider: "", accountNumber: "", accountHolder: "", autopay: false, paperless: false });

function StepDot({ active, done }) {
  return <div style={{ width: done ? "24px" : active ? "32px" : "24px", height: "8px", borderRadius: "4px", background: done ? COLORS.success : active ? COLORS.accent : COLORS.border, transition: "all 0.3s" }} />;
}

function PortalInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState(null);

  const [form, setForm] = useState({
    role: "", firstName: "", lastName: "", email: "", phone: "",
    forwardingAddress: "", propertyAddress: "", propertyType: "Single Family",
    closeDate: "", currentHolder: "", pmDirection: "PM → Owner (self-managing)",
    utilities: [emptyUtility()], agreeTerms: false, agreeAuth: false,
  });

  // Handle Stripe return
  useEffect(() => {
    const success = searchParams.get("success");
    const id = searchParams.get("id");
    const cancelled = searchParams.get("cancelled");
    if (success && id) setSuccessId(id);
    if (cancelled) setError("Payment was cancelled. Your information is saved — try again when ready.");
  }, [searchParams]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateU = (id, k, v) => set("utilities", form.utilities.map((u) => (u.id === id ? { ...u, [k]: v } : u)));
  const addU = () => set("utilities", [...form.utilities, emptyUtility()]);
  const removeU = (id) => set("utilities", form.utilities.filter((u) => u.id !== id));

  const fee = form.utilities.length <= 3 ? 79 : 99;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <div style={s.container}>
        <div style={s.card}>
          <div style={s.successBox}>
            <div style={s.successIcon}>✓</div>
            <div style={{ fontSize: "28px", fontWeight: "400", marginBottom: "12px" }}>You're all set.</div>
            <div style={{ fontSize: "16px", color: COLORS.inkLight, lineHeight: "1.6", maxWidth: "400px", margin: "0 auto 32px" }}>
              We've received your payment and will begin processing within 1 business day. Check your email for a confirmation.
            </div>
            <div style={{ ...s.card, background: COLORS.accentLight, border: `1px solid #E0C8B8`, textAlign: "left", maxWidth: "320px", margin: "0 auto" }}>
              <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Confirmation</div>
              <div style={{ fontSize: "22px", color: COLORS.accent }}>{successId}</div>
            </div>
            <button style={{ ...s.btnSecondary, marginTop: "24px" }} onClick={() => window.location.href = "/"}>← Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  const steps = ["Your Role", "Property & Contact", "Utility Accounts", "Review & Pay"];

  return (
    <div>
      <div style={s.hero}>
        
        <div style={s.heroTitle}>Utility transfers, handled for you.</div>
        <div style={s.heroSub}>Buying, selling, or switching property managers — we take care of every utility transfer so you don't have to.</div>
        <div style={s.badge}>Flat fee · No surprises · Hassle-free</div>
      </div>
      <div style={s.stepDots}>{steps.map((_, i) => <StepDot key={i} active={i === step} done={i < step} />)}</div>
      <div style={s.container}>
        {step === 0 && (
          <div style={{ ...s.card, marginBottom: "0", background: COLORS.blue, border: "none", borderRadius: "0" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.accent, marginBottom: "16px" }}>Why We Built This</div>
                  <div style={{ fontSize: "26px", color: "#FFF", fontFamily: "'Georgia',serif", lineHeight: "1.3", marginBottom: "20px", fontWeight: "400" }}>We got tired of being put on hold too.</div>
                  <div style={{ fontSize: "14px", color: "#AAA9A8", lineHeight: "1.8", marginBottom: "16px" }}>
                    As landlords and real estate investors, we've been through more utility transfers than we can count — sitting on hold, getting transferred between departments, calling back because the first rep gave us wrong information.
                  </div>
                  <div style={{ fontSize: "14px", color: "#AAA9A8", lineHeight: "1.8", marginBottom: "16px" }}>
                    Whether we were closing on a property, switching from a property manager to self-managing, or just trying to get utilities out of our name — it was always a painful, time-consuming process that nobody seemed to have solved.
                  </div>
                  <div style={{ fontSize: "14px", color: "#AAA9A8", lineHeight: "1.8" }}>
                    So we built SwitchMyUtilities. One flat fee, we handle every call, every transfer, every confirmation. You just tell us what needs to move and we take it from there.
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { icon: "🏡", title: "Built by landlords", desc: "We've experienced the same frustration firsthand across dozens of transactions." },
                    { icon: "📋", title: "We handle everything", desc: "Every utility, every provider, every phone call — we manage the full transfer process for you." },
                    { icon: "💰", title: "One flat fee", desc: "No hourly rates, no surprises. $79 for up to 3 utilities, $99 for 4 or more." },
                    { icon: "⚡", title: "Fast turnaround", desc: "We begin processing within 1 business day and keep you updated every step of the way." },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "20px", marginTop: "2px" }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#FFF", marginBottom: "4px" }}>{item.title}</div>
                        <div style={{ fontSize: "13px", color: "#AAA9A8", lineHeight: "1.6" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={s.container}>

        {/* STEP 0 */}
        {step === 0 && (
          <div style={s.card}>
            <div style={s.sectionTitle}>What best describes your situation?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "8px" }}>
              {[
                { role: "Seller", icon: "🏡", label: "Selling a Property", desc: "Transfer utilities out of my name at closing" },
                { role: "Buyer", icon: "🔑", label: "Buying a Property", desc: "Set up utilities in my name at closing" },
                { role: "PM Transition", icon: "🏢", label: "Changing Property Manager", desc: "Switch utilities between a PM and self-management" },
              ].map((r) => (
                <div key={r.role} onClick={() => set("role", r.role)} style={{ border: `2px solid ${form.role === r.role ? COLORS.accent : COLORS.border}`, borderRadius: "8px", padding: "24px 18px", cursor: "pointer", textAlign: "center", background: form.role === r.role ? COLORS.accentLight : COLORS.surface, transition: "all 0.2s" }}>
                  <div style={{ fontSize: "26px", marginBottom: "10px" }}>{r.icon}</div>
                  <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "6px" }}>{r.label}</div>
                  <div style={{ fontSize: "12px", color: COLORS.inkLight, lineHeight: "1.5" }}>{r.desc}</div>
                </div>
              ))}
            </div>
            <div style={s.btnRow}>
              <div />
              <button style={{ ...s.btnPrimary, opacity: form.role ? 1 : 0.4 }} onClick={() => form.role && setStep(1)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={s.card}>
              <div style={s.sectionTitle}>Property Details</div>
              <div style={s.field}>
                <label style={s.label}>Property Address</label>
                <input style={s.input} placeholder="123 Main St, City, State ZIP" value={form.propertyAddress} onChange={(e) => set("propertyAddress", e.target.value)} />
              </div>
              <div style={s.row2}>
                <div>
                  <label style={s.label}>Property Type</label>
                  <select style={s.select} value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
                    {["Single Family", "Condo/Townhome", "Multi-Unit", "Commercial"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>{form.role === "PM Transition" ? "Transition Date" : "Closing / Transfer Date"}</label>
                  <input style={s.input} type="date" value={form.closeDate} onChange={(e) => set("closeDate", e.target.value)} />
                </div>
              </div>
              {form.role === "PM Transition" && (
                <div style={s.row2}>
                  <div>
                    <label style={s.label}>Current Account Holder</label>
                    <input style={s.input} placeholder="Who utilities are currently under" value={form.currentHolder} onChange={(e) => set("currentHolder", e.target.value)} />
                  </div>
                  <div>
                    <label style={s.label}>Transfer Direction</label>
                    <select style={s.select} value={form.pmDirection} onChange={(e) => set("pmDirection", e.target.value)}>
                      <option>PM → Owner (self-managing)</option>
                      <option>Owner → New PM</option>
                      <option>PM → New PM</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div style={s.card}>
              <div style={s.sectionTitle}>Your Contact Info</div>
              <div style={s.row2}>
                <div><label style={s.label}>First Name</label><input style={s.input} placeholder="First" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} /></div>
                <div><label style={s.label}>Last Name</label><input style={s.input} placeholder="Last" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} /></div>
              </div>
              <div style={s.row2}>
                <div><label style={s.label}>Email</label><input style={s.input} type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
                <div><label style={s.label}>Phone</label><input style={s.input} type="tel" placeholder="(555) 555-0100" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              </div>
              {form.role === "Seller" && (
                <div style={s.field}><label style={s.label}>Forwarding Address (for final bills)</label><input style={s.input} placeholder="Where should final bills be sent?" value={form.forwardingAddress} onChange={(e) => set("forwardingAddress", e.target.value)} /></div>
              )}
              {form.role === "PM Transition" && (
                <div style={s.field}><label style={s.label}>New Account Holder Name</label><input style={s.input} placeholder="Legal name utilities will transfer into" value={form.forwardingAddress} onChange={(e) => set("forwardingAddress", e.target.value)} /></div>
              )}
            </div>
            <div style={s.btnRow}>
              <button style={s.btnSecondary} onClick={() => setStep(0)}>← Back</button>
              <button style={s.btnPrimary} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={s.card}>
              <div style={s.sectionTitle}>Utility Accounts</div>
              <p style={{ fontSize: "14px", color: COLORS.inkLight, marginBottom: "20px", lineHeight: "1.6" }}>
                Add each utility. Account numbers are on your most recent bill or in your online portal.
              </p>
              {form.utilities.map((u) => (
                <div key={u.id} style={s.utilityCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <select style={{ ...s.select, width: "auto", background: "transparent", border: "none", fontWeight: "700", color: COLORS.accent, fontSize: "14px", padding: "0" }} value={u.type} onChange={(e) => updateU(u.id, "type", e.target.value)}>
                      {UTILITY_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    {form.utilities.length > 1 && <button style={{ background: "none", border: "none", color: COLORS.inkLight, cursor: "pointer", fontSize: "18px" }} onClick={() => removeU(u.id)}>✕</button>}
                  </div>
                  <div style={s.row2}>
                    <div><label style={s.label}>Provider Name</label><input style={s.input} placeholder="e.g. Pacific Gas & Electric" value={u.provider} onChange={(e) => updateU(u.id, "provider", e.target.value)} /></div>
                    <div><label style={s.label}>Account Number</label><input style={s.input} placeholder="Found on your bill" value={u.accountNumber} onChange={(e) => updateU(u.id, "accountNumber", e.target.value)} /></div>
                  </div>
                  <div style={s.field}><label style={s.label}>Account Holder Name (if different)</label><input style={s.input} placeholder="Leave blank if same as your name" value={u.accountHolder} onChange={(e) => updateU(u.id, "accountHolder", e.target.value)} /></div>
                  <div style={{ display: "flex", gap: "24px" }}>
                    <label style={s.checkbox}><input type="checkbox" style={s.checkboxInput} checked={u.autopay} onChange={(e) => updateU(u.id, "autopay", e.target.checked)} /><span style={s.checkboxLabel}>Autopay enrolled</span></label>
                    <label style={s.checkbox}><input type="checkbox" style={s.checkboxInput} checked={u.paperless} onChange={(e) => updateU(u.id, "paperless", e.target.checked)} /><span style={s.checkboxLabel}>Paperless billing</span></label>
                  </div>
                </div>
              ))}
              <button style={s.addBtn} onClick={addU}>+ Add Another Utility</button>
            </div>
            <div style={s.btnRow}>
              <button style={s.btnSecondary} onClick={() => setStep(1)}>← Back</button>
              <button style={s.btnPrimary} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={s.feeBox}>
              <div>
                <div style={{ color: "#AAA9A8", fontSize: "13px", marginBottom: "4px" }}>Service Fee</div>
                <div style={{ color: "#FFF", fontSize: "32px" }}>${fee}</div>
                <div style={{ color: "#AAA9A8", fontSize: "12px", marginTop: "4px" }}>{form.utilities.length} utilit{form.utilities.length === 1 ? "y" : "ies"} · flat rate · no hidden fees</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#AAA9A8", fontSize: "12px", marginBottom: "4px" }}>Transfer Date</div>
                <div style={{ color: "#FFF", fontSize: "16px" }}>{form.closeDate || "—"}</div>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.sectionTitle}>Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.inkLight, marginBottom: "4px" }}>Role</div>
                  <div style={{ fontSize: "15px" }}>{form.role}{form.role === "PM Transition" && form.pmDirection ? ` · ${form.pmDirection}` : ""}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.inkLight, marginBottom: "4px" }}>Name</div>
                  <div style={{ fontSize: "15px" }}>{form.firstName} {form.lastName}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.inkLight, marginBottom: "4px" }}>Property</div>
                  <div style={{ fontSize: "15px" }}>{form.propertyAddress || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: COLORS.inkLight, marginBottom: "4px" }}>Utilities</div>
                  <div>{form.utilities.map((u) => <span key={u.id} style={s.typeTag}>{u.type}</span>)}</div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px" }}>
                <label style={s.checkbox}>
                  <input type="checkbox" style={s.checkboxInput} checked={form.agreeAuth} onChange={(e) => set("agreeAuth", e.target.checked)} />
                  <span style={s.checkboxLabel}>I authorize SwitchMyUtilities to act on my behalf to transfer, cancel, or establish the utility accounts listed above.</span>
                </label>
                <label style={s.checkbox}>
                  <input type="checkbox" style={s.checkboxInput} checked={form.agreeTerms} onChange={(e) => set("agreeTerms", e.target.checked)} />
                  <span style={s.checkboxLabel}>I agree to the service terms and the ${fee} flat fee charged today.</span>
                </label>
              </div>
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <div style={{ ...s.card, background: COLORS.accentLight, border: `1px solid #E0C8B8` }}>
              <div style={{ fontSize: "13px", color: COLORS.inkLight, lineHeight: "1.6" }}>
                <strong style={{ color: COLORS.ink }}>Payment handled securely via Stripe.</strong> You'll be redirected to Stripe to complete payment, then returned here with your confirmation.
              </div>
            </div>

            <div style={s.btnRow}>
              <button style={s.btnSecondary} onClick={() => setStep(2)}>← Back</button>
              <button
                style={{ ...s.btnPrimary, opacity: form.agreeAuth && form.agreeTerms && !loading ? 1 : 0.4 }}
                onClick={() => form.agreeAuth && form.agreeTerms && !loading && handleSubmit()}
              >
                {loading ? "Redirecting to payment…" : `Submit & Pay $${fee} →`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InstagramSection() {
  return (
    <div style={{ background: COLORS.blue, borderTop: `4px solid ${COLORS.accent}`, padding: "60px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.accent, marginBottom: "12px", fontFamily: "'Georgia',serif" }}>Follow Our Journey</div>
        <div style={{ fontSize: "32px", color: "#FFF", fontFamily: "'Georgia',serif", fontWeight: "400", marginBottom: "12px" }}>We're Chase & Ian.</div>
        <div style={{ fontSize: "15px", color: "#AAC4EF", lineHeight: "1.7", marginBottom: "32px", maxWidth: "440px", margin: "0 auto 32px" }}>
          SF Bay Area landlords & real estate investors. Follow along as we build, invest, and share everything we learn along the way.
        </div>
        <a
          href="https://www.instagram.com/collegecashflows/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: COLORS.accent, color: "#FFF", padding: "14px 28px", borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontFamily: "'Georgia',serif", fontWeight: "700", letterSpacing: "0.5px" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          @collegecashflows
        </a>
        <div style={{ marginTop: "16px", fontSize: "13px", color: "#7A9CC8" }}>2,700+ followers · Real estate investing content</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <div style={s.navLogo}>Switch<span style={s.navAccent}>My</span>Utilities</div>
      </nav>
      <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", color: COLORS.inkLight }}>Loading…</div>}>
        <PortalInner />
      </Suspense>
      <InstagramSection />
    </div>
  );
}
