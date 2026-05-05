"use client";
import { useState, useEffect } from "react";

const COLORS = {
  bg: "#F7F4EF", surface: "#FFFFFF", ink: "#1A1612", inkLight: "#6B6560",
  accent: "#C85C2D", accentLight: "#F0E8E0", border: "#E2DDD8",
  success: "#2D7D46", successLight: "#E8F5ED",
};

const s = {
  app: { minHeight: "100vh", background: COLORS.bg, fontFamily: "'Georgia','Times New Roman',serif", color: COLORS.ink },
  nav: { background: COLORS.ink, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" },
  navLogo: { color: "#FFF", fontSize: "18px", fontWeight: "700" },
  navAccent: { color: COLORS.accent },
  navBadge: { background: COLORS.accent, color: "#FFF", fontSize: "12px", padding: "4px 12px", borderRadius: "4px" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "20px 24px", boxShadow: "0 1px 4px rgba(26,22,18,0.05)" },
  statLabel: { fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.inkLight, marginBottom: "8px" },
  statValue: { fontSize: "28px" },
  card: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(26,22,18,0.06)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.inkLight, padding: "12px 16px", borderBottom: `2px solid ${COLORS.border}` },
  td: { padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, fontSize: "14px", verticalAlign: "middle" },
  typeTag: { display: "inline-block", background: COLORS.accentLight, color: COLORS.accent, fontSize: "11px", padding: "2px 8px", borderRadius: "4px", marginRight: "4px", marginBottom: "2px", fontWeight: "600" },
  selectStatus: { border: `1px solid ${COLORS.border}`, borderRadius: "4px", padding: "4px 8px", fontSize: "12px", fontFamily: "'Georgia',serif", background: COLORS.bg, cursor: "pointer" },
  input: { width: "100%", padding: "11px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: "5px", fontSize: "15px", fontFamily: "'Georgia',serif", color: COLORS.ink, background: COLORS.bg, boxSizing: "border-box", outline: "none" },
  btnSecondary: { background: "none", color: COLORS.inkLight, border: `1.5px solid ${COLORS.border}`, padding: "10px 20px", borderRadius: "5px", fontSize: "14px", fontFamily: "'Georgia',serif", cursor: "pointer" },
  btnPrimary: { background: COLORS.accent, color: "#FFF", border: "none", padding: "10px 20px", borderRadius: "5px", fontSize: "14px", fontFamily: "'Georgia',serif", cursor: "pointer", fontWeight: "700" },
};

function statusBadge(status) {
  const map = {
    "New": { bg: "#EEF2FF", color: "#3730A3" },
    "In Progress": { bg: "#FFF7E6", color: "#B45309" },
    "Complete": { bg: COLORS.successLight, color: COLORS.success },
  };
  const c = map[status] || { bg: COLORS.accentLight, color: COLORS.accent };
  return { display: "inline-block", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px", background: c.bg, color: c.color };
}

function DetailView({ submission: s, onBack, onUpdate }) {
  const [status, setStatus] = useState(s.status);
  const [notes, setNotes] = useState(s.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch("/api/update-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, status, notes }),
    });
    onUpdate(s.id, { status, notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const utilities = Array.isArray(s.utilities) ? s.utilities : [];

  return (
    <div style={s.container}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button style={s.btnSecondary} onClick={onBack}>← Back to Dashboard</button>
        <button style={{ ...s.btnPrimary, opacity: saving ? 0.5 : 1 }} onClick={save}>{saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}</button>
      </div>
      <div style={{ ...s.card, padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "12px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
              {s.id} · {new Date(s.created_at).toLocaleDateString()}
            </div>
            <div style={{ fontSize: "24px" }}>{s.first_name} {s.last_name}</div>
            <div style={{ fontSize: "14px", color: COLORS.inkLight, marginTop: "4px" }}>{s.email} · {s.phone}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={statusBadge(status)}>{status}</span>
            <div style={{ marginTop: "12px" }}>
              <select style={s.selectStatus} value={status} onChange={(e) => setStatus(e.target.value)}>
                {["New", "In Progress", "Complete"].map((st) => <option key={st}>{st}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", paddingTop: "20px", borderTop: `1px solid ${COLORS.border}`, marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Property</div>
            <div style={{ fontSize: "14px", lineHeight: "1.5" }}>{s.property_address}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Transfer Date</div>
            <div style={{ fontSize: "14px" }}>{s.close_date || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Role / Fee</div>
            <div style={{ fontSize: "14px" }}>{s.role}{s.pm_direction ? ` · ${s.pm_direction}` : ""} · <strong style={{ color: COLORS.accent }}>${s.fee}</strong></div>
          </div>
          {s.forwarding_address && (
            <div>
              <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                {s.role === "PM Transition" ? "New Account Holder" : "Forwarding Address"}
              </div>
              <div style={{ fontSize: "14px" }}>{s.forwarding_address}</div>
            </div>
          )}
          {s.current_holder && (
            <div>
              <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Current Account Holder</div>
              <div style={{ fontSize: "14px" }}>{s.current_holder}</div>
            </div>
          )}
        </div>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Utilities</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {utilities.map((u, i) => (
              <div key={i} style={{ background: COLORS.accentLight, border: `1.5px solid #E0C8B8`, borderRadius: "6px", padding: "12px 16px" }}>
                <div style={{ fontWeight: "700", color: COLORS.accent, fontSize: "13px", marginBottom: "4px" }}>{u.type}</div>
                <div style={{ fontSize: "12px", color: COLORS.inkLight }}>{u.provider || "Provider not specified"}</div>
                {u.accountNumber && <div style={{ fontSize: "12px", color: COLORS.inkLight }}>Acct: {u.accountNumber}</div>}
                {u.accountHolder && <div style={{ fontSize: "12px", color: COLORS.inkLight }}>Holder: {u.accountHolder}</div>}
                <div style={{ fontSize: "11px", marginTop: "4px", color: COLORS.inkLight }}>
                  {u.autopay ? "✓ Autopay " : ""}{u.paperless ? "✓ Paperless" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: COLORS.bg, borderRadius: "6px", padding: "16px" }}>
          <div style={{ fontSize: "11px", color: COLORS.inkLight, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Internal Notes</div>
          <textarea
            style={{ ...s.input, minHeight: "80px", resize: "vertical", background: COLORS.surface }}
            placeholder="Add notes here (visible only to your team)…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default function OpsDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((data) => { setSubmissions(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = (id, updates) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const counts = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === "New").length,
    inProgress: submissions.filter((s) => s.status === "In Progress").length,
    complete: submissions.filter((s) => s.status === "Complete").length,
  };

  const revenue = submissions.filter((s) => s.status === "Complete").reduce((sum, s) => sum + (s.fee || 0), 0);

  if (selected) {
    const sub = submissions.find((x) => x.id === selected);
    return (
      <div style={s.app}>
        <nav style={s.nav}>
          <div style={s.navLogo}>Switch<span style={s.navAccent}>My</span>Utilities <span style={{ color: "#888", fontSize: "13px", fontWeight: "400" }}>· Ops</span></div>
        </nav>
        <DetailView submission={sub} onBack={() => setSelected(null)} onUpdate={handleUpdate} />
      </div>
    );
  }

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <div style={s.navLogo}>Switch<span style={s.navAccent}>My</span>Utilities <span style={{ color: "#888", fontSize: "13px", fontWeight: "400" }}>· Ops</span></div>
        <span style={s.navBadge}>Internal Dashboard</span>
      </nav>
      <div style={s.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "24px" }}>Operations Dashboard</div>
          <div style={{ fontSize: "13px", color: COLORS.inkLight }}>{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        </div>
        <div style={s.statsRow}>
          {[
            { label: "Total Submissions", value: loading ? "…" : counts.total },
            { label: "New", value: loading ? "…" : counts.new, accent: true },
            { label: "In Progress", value: loading ? "…" : counts.inProgress },
            { label: "Revenue Collected", value: loading ? "…" : `$${revenue}` },
          ].map((stat) => (
            <div key={stat.label} style={s.statCard}>
              <div style={s.statLabel}>{stat.label}</div>
              <div style={{ ...s.statValue, color: stat.accent ? COLORS.accent : COLORS.ink }}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div style={{ ...s.card, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: COLORS.inkLight }}>Loading submissions…</div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: COLORS.inkLight }}>No paid submissions yet. They'll appear here once customers pay.</div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>{["ID", "Date", "Customer", "Property", "Transfer Date", "Utilities", "Fee", "Status", ""].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} style={{ cursor: "pointer" }} onClick={() => setSelected(sub.id)}>
                    <td style={s.td}><span style={{ fontWeight: "700", color: COLORS.accent }}>{sub.id}</span></td>
                    <td style={s.td}>{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td style={s.td}>
                      <div style={{ fontWeight: "700" }}>{sub.first_name} {sub.last_name}</div>
                      <div style={{ fontSize: "12px", color: COLORS.inkLight }}>{sub.role}</div>
                    </td>
                    <td style={{ ...s.td, maxWidth: "180px" }}>
                      <div style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.property_address}</div>
                    </td>
                    <td style={s.td}>{sub.close_date || "—"}</td>
                    <td style={s.td}>{(sub.utilities || []).map((u, i) => <span key={i} style={s.typeTag}>{u.type}</span>)}</td>
                    <td style={s.td}><strong style={{ color: COLORS.accent }}>${sub.fee}</strong></td>
                    <td style={s.td} onClick={(e) => e.stopPropagation()}>
                      <select style={s.selectStatus} value={sub.status} onChange={async (e) => {
                        const newStatus = e.target.value;
                        handleUpdate(sub.id, { status: newStatus });
                        await fetch("/api/update-status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: sub.id, status: newStatus }) });
                      }}>
                        {["New", "In Progress", "Complete"].map((st) => <option key={st}>{st}</option>)}
                      </select>
                    </td>
                    <td style={s.td}><span style={{ color: COLORS.accent, fontSize: "13px" }}>View →</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
