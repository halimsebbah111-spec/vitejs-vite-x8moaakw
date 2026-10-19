import { useState, useEffect, useRef } from "react";

/* ضع رقمك هنا مع الرمز الدولي، أرقام فقط بدون + أو أصفار في البداية */
const WHATSAPP_NUMBER = "213675658079";

/* كود تفعيل واجهة الحلاق: غيّره كما تشاء وأعطه للحلاق بعد الدفع */
const ACTIVATION_CODE = "BARBER2026";

/* ===== الألوان والأنماط (Inline Styles فقط) ===== */
const C = {
  bg: "#121315", s1: "#1c1e22", s2: "#25282d", line: "#33373d",
  text: "#f1ede4", muted: "#9a9fa8", gold: "#c9a35c",
  ok: "#5fb37c", danger: "#e0654f", ink: "#1a1405",
};

const S = {
  shell: { maxWidth: 520, margin: "0 auto", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Tahoma, Arial, sans-serif", display: "flex", flexDirection: "column", position: "relative", direction: "rtl", textAlign: "right", boxSizing: "border-box" },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid " + C.line },
  brand: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: C.gold, fontSize: 20 },
  main: { flex: 1, padding: "16px 18px 90px" },
  card: { background: C.s1, border: "1px solid " + C.line, borderRadius: 14, padding: 14, marginBottom: 12 },
  row: { display: "flex", alignItems: "center", gap: 12 },
  between: { justifyContent: "space-between" },
  muted: { color: C.muted, fontSize: 13 },
  sec: { fontSize: 16, margin: "18px 0 10px", fontWeight: 700 },
  big: { fontSize: 22, fontWeight: 700 },
  avatar: { width: 48, height: 48, borderRadius: "50%", background: C.s2, border: "1px solid " + C.gold, color: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, flexShrink: 0 },
  iconbtn: { background: "transparent", border: "1px solid " + C.line, color: C.text, borderRadius: 10, padding: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  input: { width: "100%", boxSizing: "border-box", background: C.s2, border: "1px solid " + C.line, color: C.text, borderRadius: 12, padding: 12, fontFamily: "inherit", fontSize: 15 },
  timer: { fontSize: 34, fontWeight: 700, color: C.gold, direction: "ltr", textAlign: "center" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
};

const chip = (color) => ({ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: C.s2, color: color || C.muted, whiteSpace: "nowrap" });

const btn = (variant, small, disabled) => ({
  width: small ? "auto" : "100%",
  boxSizing: "border-box",
  padding: small ? "8px 14px" : 13,
  borderRadius: small ? 10 : 12,
  fontSize: small ? 14 : 16,
  fontWeight: 700,
  fontFamily: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.45 : 1,
  background: variant === "gold" ? C.gold : "transparent",
  color: variant === "gold" ? C.ink : variant === "danger" ? C.danger : C.text,
  border: variant === "gold" ? "none" : "1px solid " + (variant === "danger" ? C.danger : C.line),
});

/* ===== الأيقونات (SVG بدون مكتبات) ===== */
const ICONS = {
  scissors: (<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></>),
  star: (<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />),
  clock: (<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>),
  check: (<polyline points="20 6 9 17 4 12" />),
  x: (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>),
  send: (<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>),
  chat: (<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />),
  logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>),
  back: (<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>),
  play: (<polygon points="5 3 19 12 5 21 5 3" />),
  user: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>),
  bell: (<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>),
};

function Icon({ name, size = 20, fill = "none" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function Stars({ value, onChange, size = 18 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2, direction: "ltr" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= Math.round(value);
        return (
          <button
            key={n}
            type="button"
            disabled={!onChange}
            onClick={onChange ? () => onChange(n) : undefined}
            aria-label={n + " من 5"}
            style={{ background: "none", border: "none", padding: 0, display: "inline-flex", color: on ? C.gold : "#4a4e55", cursor: onChange ? "pointer" : "default" }}
          >
            <Icon name="star" size={size} fill={on ? "currentColor" : "none"} />
          </button>
        );
      })}
    </span>
  );
}

/* ===== البيانات التجريبية ===== */
const TONES = [
  ["#2b2d33", "#7a6338"], ["#1f2a3a", "#3e5f8a"], ["#33292b", "#8a5a3e"],
  ["#232a26", "#4e7a5c"], ["#2d2a38", "#6e5a8a"], ["#2a2a2a", "#8a8a8a"],
];

const BARBERS = [
  { id: 1, name: "أبو يوسف", shop: "صالون الأناقة", bio: "خبرة 12 سنة في القصات الكلاسيكية وتشذيب اللحية.",
    services: [
      { id: 1, name: "حلاقة", price: 800, minutes: 20 },
      { id: 2, name: "تشذيب اللحية", price: 400, minutes: 10 },
      { id: 3, name: "حلاقة ولحية", price: 1100, minutes: 30 },
      { id: 4, name: "تنظيف البشرة", price: 600, minutes: 20 },
    ] },
  { id: 2, name: "كريم", shop: "كريم للحلاقة العصرية", bio: "متخصص في القصات الحديثة والتدرج.",
    services: [
      { id: 1, name: "قصة عصرية", price: 1000, minutes: 25 },
      { id: 2, name: "تدرج", price: 1200, minutes: 30 },
      { id: 3, name: "حلاقة الرأس بالموس", price: 600, minutes: 15 },
    ] },
  { id: 3, name: "سليم", shop: "سليم كلاسيك", bio: "حلاقة تقليدية بالمنشفة الساخنة وعناية كاملة بالوجه.",
    services: [
      { id: 1, name: "حلاقة كلاسيكية", price: 900, minutes: 25 },
      { id: 2, name: "عناية بالوجه", price: 700, minutes: 20 },
    ] },
];

const SEED_REVIEWS = [
  { id: 1, barberId: 1, customer: "محمد", rating: 5, comment: "قصة ممتازة وتنظيم رائع." },
  { id: 2, barberId: 1, customer: "ياسين", rating: 4, comment: "دقيق في المواعيد." },
  { id: 3, barberId: 2, customer: "أمين", rating: 5, comment: "أفضل تدرج جربته." },
  { id: 4, barberId: 3, customer: "رضا", rating: 4, comment: "جو هادئ وخدمة محترمة." },
];

const SEED_BOOKINGS = [
  { id: 1, barberId: 1, serviceId: 1, customer: "عمر", status: "waiting", reviewed: false },
  { id: 2, barberId: 1, serviceId: 2, customer: "ياسين", status: "waiting", reviewed: false },
];

const STATUS = { waiting: "في الانتظار", progress: "جاري الحلاقة", done: "تم الانتهاء", cancelled: "ملغى" };

const fmt = (s) => {
  const t = Math.max(0, Math.round(s));
  return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
};

function readImage(file, max, done) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      done(c.toDataURL("image/jpeg", 0.8));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function Avatar({ barber }) {
  if (barber.photo) {
    return <img src={barber.photo} alt={barber.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "1px solid " + C.gold, flexShrink: 0 }} />;
  }
  return <div style={S.avatar}>{barber.name.charAt(0)}</div>;
}

/* ===== الدردشة ===== */
function ChatPanel({ title, messages, me, onSend, onClose }) {
  const [text, setText] = useState("");
  const end = useRef(null);
  useEffect(() => {
    if (end.current) end.current.scrollIntoView();
  }, [messages.length]);
  const send = () => {
    onSend(text);
    setText("");
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, height: "75vh", background: C.s1, borderRadius: "18px 18px 0 0", display: "flex", flexDirection: "column", direction: "rtl", color: C.text, fontFamily: "Tahoma, Arial, sans-serif" }}>
        <div style={{ ...S.row, ...S.between, padding: 14, borderBottom: "1px solid " + C.line }}>
          <b>{title}</b>
          <button style={S.iconbtn} onClick={onClose} aria-label="إغلاق"><Icon name="x" /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {messages.length === 0 && <div style={{ textAlign: "center", color: C.muted, padding: 32 }}>ابدأ المحادثة بسؤالك</div>}
          {messages.map((m, i) => {
            const mine = m.from === me;
            return (
              <div key={i} style={{ maxWidth: "78%", padding: "9px 12px", borderRadius: 14, background: mine ? C.gold : C.s2, color: mine ? C.ink : C.text, alignSelf: mine ? "flex-end" : "flex-start" }}>
                {m.text}
              </div>
            );
          })}
          <div ref={end} />
        </div>
        <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid " + C.line }}>
          <input style={S.input} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="اكتب رسالة" />
          <button style={btn("gold", true)} onClick={send} aria-label="إرسال"><Icon name="send" /></button>
        </div>
      </div>
    </div>
  );
}

/* ===== تسجيل الدخول ===== */
function Login({ onLogin, barbers, onCreate }) {
  const [mode, setMode] = useState(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [owner, setOwner] = useState("");
  const [shop, setShop] = useState("");
  const [error, setError] = useState("");
  const enter = () => {
    const n = name.trim();
    if (n) onLogin({ role: "customer", name: n });
  };
  const checkCode = () => {
    if (code.trim().toUpperCase() === ACTIVATION_CODE.toUpperCase()) {
      setError("");
      setCode("");
      setMode("barberMenu");
    } else {
      setError("كود التفعيل غير صحيح، تواصل معنا للحصول على الكود.");
    }
  };
  const create = () => {
    if (owner.trim() && shop.trim()) onCreate(owner.trim(), shop.trim());
  };
  const stack = { display: "flex", flexDirection: "column", gap: 12, marginTop: 28 };
  const waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("مرحباً، أريد الحصول على كود التفعيل والاشتراك كحلاق في التطبيق");
  const back = (to) => () => { setError(""); setMode(to); };
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, margin: "0 auto 14px", borderRadius: 20, background: C.s2, border: "1px solid " + C.gold, color: C.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="scissors" size={34} />
      </div>
      <h1 style={{ margin: "0 0 6px", fontSize: 28 }}>دوري</h1>
      <p style={{ ...S.muted, margin: 0 }}>احجز دورك عند حلاقك المفضل وتابعه لحظة بلحظة</p>

      {mode === null && (
        <div style={stack}>
          <button style={btn("gold")} onClick={() => setMode("customer")}><Icon name="user" /> تسجيل كزبون</button>
          <button style={btn("ghost")} onClick={() => setMode("barber")}><Icon name="scissors" /> تسجيل كحلاق</button>
        </div>
      )}

      {mode === "customer" && (
        <div style={stack}>
          <input style={S.input} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") enter(); }} placeholder="اكتب اسمك" />
          <button style={btn("gold", false, !name.trim())} disabled={!name.trim()} onClick={enter}>دخول</button>
          <button style={btn("ghost")} onClick={back(null)}>رجوع</button>
        </div>
      )}

      {mode === "barber" && (
        <div style={stack}>
          <div style={{ background: C.s1, border: "1px solid " + C.gold, borderRadius: 18, padding: 22, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 14px", borderRadius: 16, background: C.s2, color: C.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="scissors" size={28} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.9 }}>
              للحصول على حساب حلاق وتفعيل صالونك في التطبيق، يرجى التواصل معنا عبر الواتساب
            </div>
          </div>
          <div style={S.muted}>أدخل كود التفعيل لفتح واجهة الحلاق</div>
          <input style={{ ...S.input, textAlign: "center", direction: "ltr", letterSpacing: 2 }} value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") checkCode(); }} placeholder="كود التفعيل" />
          {error && <div style={{ color: C.danger, fontSize: 13 }}>{error}</div>}
          <button style={btn("gold", false, !code.trim())} disabled={!code.trim()} onClick={checkCode}>تفعيل ودخول</button>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ ...btn("gold"), background: "#25D366", color: "#06260f", textDecoration: "none", textAlign: "center", lineHeight: 1.6 }}>
            <Icon name="chat" size={20} /> تواصل معنا عبر الواتساب للحصول على كود التفعيل والاشتراك
          </a>
          <button style={btn("ghost")} onClick={back(null)}>رجوع</button>
        </div>
      )}

      {mode === "barberMenu" && (
        <div style={stack}>
          <div><span style={chip(C.ok)}>تم تفعيل الكود بنجاح</span></div>
          <div style={S.muted}>اختر حساب الحلاق</div>
          {barbers.map((b) => (
            <button key={b.id} style={btn("ghost")} onClick={() => onLogin({ role: "barber", name: b.name, barberId: b.id })}>
              {b.name} - {b.shop}
            </button>
          ))}
          <button style={btn("gold")} onClick={back("barberCreate")}>إنشاء صالون جديد</button>
          <button style={btn("ghost")} onClick={back(null)}>رجوع</button>
        </div>
      )}

      {mode === "barberCreate" && (
        <div style={stack}>
          <input style={S.input} value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="اسم الحلاق" />
          <input style={S.input} value={shop} onChange={(e) => setShop(e.target.value)} placeholder="اسم الصالون" />
          <button style={btn("gold", false, !owner.trim() || !shop.trim())} disabled={!owner.trim() || !shop.trim()} onClick={create}>إنشاء وفتح لوحة التحكم</button>
          <button style={btn("ghost")} onClick={back("barberMenu")}>رجوع</button>
        </div>
      )}
    </div>
  );
}

/* ===== شاشات الزبون ===== */
const LOOKBOOK = [
  { id: 1, name: "فيد منخفض" }, { id: 2, name: "كلاسيك جانبي" }, { id: 3, name: "كرو قصير" },
  { id: 4, name: "تدرج عالي" }, { id: 5, name: "بومبادور" }, { id: 6, name: "قصة نظيفة" },
];

const LOYALTY_GOAL = 5;
const LOYALTY_DISCOUNT = 20;
const isEntitled = (visits) => visits > 0 && visits % LOYALTY_GOAL === 0;

function Loyalty({ visits }) {
  const inCycle = visits % LOYALTY_GOAL;
  const earned = isEntitled(visits);
  const left = LOYALTY_GOAL - inCycle;
  return (
    <div style={{ ...S.card, border: "1px solid " + (earned ? C.gold : C.line) }}>
      <div style={{ ...S.row, ...S.between }}>
        <b>مكافآت الولاء</b>
        <span style={chip(C.gold)}>{visits} حجز ناجح</span>
      </div>
      {earned && (
        <div style={{ background: C.gold, color: C.ink, borderRadius: 12, padding: 12, marginTop: 12, fontWeight: 700, lineHeight: 1.7 }}>
          تهانينا! حصلت على خصم {LOYALTY_DISCOUNT}% على حجزك القادم، ويُطبَّق تلقائياً عند الحجز.
        </div>
      )}
      <div style={{ display: "flex", gap: 6, margin: "12px 0" }}>
        {[0, 1, 2, 3, 4].map((k) => (
          <div key={k} style={{ flex: 1, height: 8, borderRadius: 4, background: earned || k < inCycle ? C.gold : C.s2 }} />
        ))}
      </div>
      <div style={S.muted}>
        {earned
          ? "احجز الآن للاستفادة من خصمك"
          : (left === 1 ? "باقي حجز واحد ناجح" : "باقي " + left + " حجوزات ناجحة") + " للحصول على خصم " + LOYALTY_DISCOUNT + "%"}
      </div>
    </div>
  );
}

function Home({ app }) {
  return (
    <>
      <Loyalty visits={app.visitsOf(app.user.name)} />
      <h2 style={{ ...S.sec, marginTop: 0 }}>الحلاقون المتاحون</h2>
      {app.barbers.map((b) => {
        const r = app.ratingOf(b.id);
        const n = app.queueOf(b.id).length;
        const h = app.hours[b.id];
        return (
          <div key={b.id} style={{ ...S.card, cursor: "pointer" }} onClick={() => app.setSelected(b.id)}>
            <div style={S.row}>
              <Avatar barber={b} />
              <div style={{ flex: 1 }}>
                <b>{b.name}</b>
                <div style={S.muted}>{b.shop}</div>
                <div style={{ ...S.row, gap: 6, marginTop: 4 }}>
                  <Stars value={r.avg} size={14} />
                  <span style={S.muted}>{r.avg.toFixed(1)} ({r.count})</span>
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <span style={chip(h.isOpen ? C.ok : C.danger)}>{h.isOpen ? "مفتوح" : "مغلق"}</span>
                <div style={{ ...S.muted, marginTop: 6 }}>{n} في الانتظار</div>
              </div>
            </div>
            <div style={{ ...S.muted, marginTop: 8 }}>ساعات العمل: {h.open} - {h.close}</div>
          </div>
        );
      })}
    </>
  );
}

function Profile({ app, barber }) {
  const [ids, setIds] = useState([barber.services[0].id]);
  const [cutName, setCutName] = useState(null);
  const r = app.ratingOf(barber.id);
  const h = app.hours[barber.id];
  const n = app.queueOf(barber.id).length;
  const wait = Math.ceil(app.waitSecs(barber.id) / 60);
  const list = app.reviews.filter((x) => x.barberId === barber.id);
  const chosen = barber.services.filter((s) => ids.indexOf(s.id) !== -1);
  const totalPrice = chosen.reduce((t, s) => t + s.price, 0);
  const totalMin = chosen.reduce((t, s) => t + s.minutes, 0);
  const pct = isEntitled(app.visitsOf(app.user.name)) ? LOYALTY_DISCOUNT : 0;
  const finalPrice = Math.round((totalPrice * (100 - pct)) / 100);
  const looks = barber.lookbook && barber.lookbook.length ? barber.lookbook : LOOKBOOK;
  const toggle = (id) => setIds((cur) => (cur.indexOf(id) !== -1 ? cur.filter((x) => x !== id) : [...cur, id]));
  const banned = (app.blocked[barber.id] || []).indexOf(app.user.name) !== -1;
  const blocked = !!app.myBooking || !h.isOpen || chosen.length === 0 || banned;
  return (
    <>
      <button style={btn("ghost", true)} onClick={() => app.setSelected(null)}><Icon name="back" size={16} /> رجوع</button>

      <div style={{ ...S.card, marginTop: 12 }}>
        <div style={S.row}>
          <Avatar barber={barber} />
          <div style={{ flex: 1 }}>
            <div style={S.big}>{barber.name}</div>
            <div style={S.muted}>{barber.shop}</div>
            <div style={{ ...S.row, gap: 6, marginTop: 4 }}>
              <Stars value={r.avg} size={16} />
              <span style={S.muted}>{r.avg.toFixed(1)} ({r.count} تقييم)</span>
            </div>
          </div>
          <span style={chip(h.isOpen ? C.ok : C.danger)}>{h.isOpen ? "مفتوح" : "مغلق"}</span>
        </div>
        <p style={{ ...S.muted, marginBottom: 0 }}>{barber.bio}</p>
        <div style={{ ...S.muted, marginTop: 6 }}>ساعات العمل: {h.open} - {h.close}</div>
      </div>

      <h2 style={S.sec}>معرض أحدث القصات (اختر قصة)</h2>
      <div style={S.grid3}>
        {looks.map((l, i) => {
          const on = cutName === l.name;
          const t = TONES[i % TONES.length];
          return (
            <button key={l.id} onClick={() => setCutName(on ? null : l.name)} style={{ position: "relative", padding: 0, border: "2px solid " + (on ? C.gold : "transparent"), borderRadius: 12, background: C.s1, cursor: "pointer", color: C.text, fontFamily: "inherit", overflow: "hidden" }}>
              {l.src ? (
                <img src={l.src} alt={l.name} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.75)", background: "linear-gradient(135deg," + t[0] + "," + t[1] + ")" }}>
                  <Icon name="scissors" size={24} />
                </div>
              )}
              {on && (
                <div style={{ position: "absolute", top: 6, right: 6, background: C.gold, color: C.ink, borderRadius: 99, padding: 3, display: "flex" }}>
                  <Icon name="check" size={14} />
                </div>
              )}
              <div style={{ fontSize: 12, padding: "6px 4px" }}>{l.name}</div>
            </button>
          );
        })}
      </div>
      {cutName && <div style={{ ...S.muted, marginTop: 8 }}>القصة المختارة: {cutName}</div>}

      <h2 style={S.sec}>الخدمات (يمكن اختيار أكثر من خدمة)</h2>
      {barber.services.map((s) => {
        const on = ids.indexOf(s.id) !== -1;
        return (
          <button key={s.id} onClick={() => toggle(s.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: "1px solid " + (on ? C.gold : C.line), borderRadius: 12, marginBottom: 8, background: on ? C.s2 : C.s1, width: "100%", boxSizing: "border-box", color: C.text, textAlign: "right", fontSize: 15, fontFamily: "inherit", cursor: "pointer" }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (on ? C.gold : C.muted), background: on ? C.gold : "transparent", color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {on && <Icon name="check" size={14} />}
            </span>
            <span style={{ flex: 1 }}>
              {s.name}
              <div style={S.muted}>{s.minutes} دقيقة</div>
            </span>
            <b style={{ color: C.gold }}>{s.price} دج</b>
          </button>
        );
      })}

      <div style={{ ...S.card, border: "1px solid " + C.gold }}>
        <div style={{ ...S.row, ...S.between }}>
          <span>الإجمالي</span>
          <b style={{ color: C.gold, fontSize: 18 }}>{finalPrice} دج</b>
        </div>
        {pct > 0 && (
          <div style={{ ...S.row, ...S.between, marginTop: 6 }}>
            <span style={{ ...S.muted, color: C.ok }}>خصم الولاء {pct}%</span>
            <span style={{ ...S.muted, textDecoration: "line-through" }}>{totalPrice} دج</span>
          </div>
        )}
        <div style={{ ...S.row, ...S.between, marginTop: 6 }}>
          <span style={S.muted}>مدة الخدمة</span>
          <span style={S.muted}>{totalMin} دقيقة</span>
        </div>
        <div style={{ ...S.row, ...S.between, marginTop: 6 }}>
          <span style={S.muted}><Icon name="users" size={14} /> {n} في الانتظار</span>
          <span style={S.muted}>الانتظار قبل دورك: {wait} دقيقة</span>
        </div>
      </div>

      {banned && <div style={{ ...S.muted, marginBottom: 8, color: C.danger }}>لا يمكنك الحجز عند هذا الحلاق حالياً.</div>}
      {!h.isOpen && <div style={{ ...S.muted, marginBottom: 8, color: C.danger }}>الصالون مغلق حالياً، لا يمكن الحجز.</div>}
      {app.myBooking && <div style={{ ...S.muted, marginBottom: 8 }}>لديك حجز نشط بالفعل، أنهِه أو ألغِه قبل حجز دور جديد.</div>}
      <button style={btn("gold", false, blocked)} disabled={blocked} onClick={() => app.book(barber.id, ids, cutName)}>
        <Icon name="clock" size={18} /> احجز دوري
      </button>
      <div style={{ height: 8 }} />
      <button style={btn("ghost")} onClick={() => app.openChat(barber.id + ":" + app.user.name, barber.name)}>
        <Icon name="chat" size={18} /> محادثة مع الحلاق
      </button>

      <h2 style={S.sec}>آراء الزبائن</h2>
      {list.length === 0 && <div style={{ textAlign: "center", color: C.muted, padding: 32 }}>لا توجد تقييمات بعد</div>}
      {list.map((x) => (
        <div key={x.id} style={S.card}>
          <div style={{ ...S.row, ...S.between }}>
            <b>{x.customer}</b>
            <Stars value={x.rating} size={14} />
          </div>
          {x.comment && <div style={{ ...S.muted, marginTop: 6 }}>{x.comment}</div>}
        </div>
      ))}
    </>
  );
}

function ReviewForm({ app, booking }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const barber = app.barbers.find((x) => x.id === booking.barberId);
  return (
    <div style={S.card}>
      <h2 style={{ ...S.sec, marginTop: 0 }}>كيف كانت تجربتك مع {barber.name}؟</h2>
      <div style={{ margin: "12px 0" }}>
        <Stars value={rating} onChange={setRating} size={32} />
      </div>
      <textarea rows={3} style={S.input} placeholder="اكتب تعليقك (اختياري)" value={comment} onChange={(e) => setComment(e.target.value)} />
      <div style={{ height: 12 }} />
      <button style={btn("gold")} onClick={() => app.submitReview(booking, rating, comment)}>إرسال التقييم</button>
      <div style={{ height: 8 }} />
      <button style={btn("ghost")} onClick={() => app.skipReview(booking)}>تخطي</button>
    </div>
  );
}

function MyTurn({ app }) {
  const b = app.myBooking;
  const loyalty = <Loyalty visits={app.visitsOf(app.user.name)} />;
  if (!b) {
    if (app.pendingReview) return <ReviewForm app={app} booking={app.pendingReview} />;
    return (
      <>
        <div style={{ textAlign: "center", color: C.muted, padding: "32px 0" }}>
          <Icon name="clock" size={40} />
          <p>ليس لديك حجز حالياً</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button style={btn("gold", true)} onClick={() => app.setTab("home")}>تصفح الحلاقين</button>
          </div>
        </div>
        {loyalty}
      </>
    );
  }
  const barber = app.barbers.find((x) => x.id === b.barberId);
  const svc = app.svcOf(b);
  const queue = app.queueOf(b.barberId);
  const pos = queue.findIndex((x) => x.id === b.id);
  const secs = app.waitSecs(b.barberId, b.id);
  const mins = Math.ceil(secs / 60);
  let headline = "باقي " + pos + " أشخاص قبلك";
  if (b.status === "progress") headline = "جاري تنفيذ حلاقتك";
  else if (pos === 0) headline = "حان دورك، تفضل بالدخول";
  else if (pos === 1) headline = "باقي شخص واحد قبلك";
  const step = b.status === "progress" ? 1 : 0;
  const progress = b.status === "progress" ? 100 : Math.round(((queue.length - pos) / queue.length) * 100);
  const box = (label, value, sub) => (
    <div style={{ flex: 1, background: C.s2, borderRadius: 12, padding: 12, textAlign: "center" }}>
      <div style={S.muted}>{label}</div>
      <div style={{ fontSize: 38, fontWeight: 700, color: C.gold, lineHeight: 1.2 }}>{value}</div>
      <div style={S.muted}>{sub}</div>
    </div>
  );
  return (
    <>
      <div style={S.card}>
        <div style={{ ...S.row, ...S.between }}>
          <div>
            <b>{barber.name}</b>
            <div style={S.muted}>{svc.name} - {svc.price} دج</div>
            {b.cut && <div style={S.muted}>القصة المختارة: {b.cut}</div>}
            {svc.discount > 0 && <div style={{ ...S.muted, color: C.ok }}>تم تطبيق خصم الولاء {svc.discount}%</div>}
          </div>
          <span style={chip(C.gold)}>{STATUS[b.status]}</span>
        </div>
        <div style={{ ...S.big, margin: "16px 0 12px" }}>{headline}</div>
        <div style={{ display: "flex", gap: 10 }}>
          {box("رقمك في الطابور", b.status === "progress" ? "-" : pos + 1, "من " + queue.length)}
          {box("الوقت المتبقي", b.status === "progress" ? "الآن" : mins, "دقيقة")}
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.s2, margin: "14px 0 4px", overflow: "hidden" }}>
          <div style={{ width: progress + "%", height: "100%", background: C.gold }} />
        </div>
        {b.status === "waiting" && pos > 0 && <div style={S.timer}>{fmt(secs)}</div>}
        <div style={{ display: "flex", gap: 6, margin: "12px 0" }}>
          {["في الانتظار", "جاري الحلاقة", "تم الانتهاء"].map((x, i) => (
            <div key={x} style={{ flex: 1, textAlign: "center", fontSize: 12, padding: "8px 4px", borderRadius: 8, background: i === step ? C.gold : C.s2, color: i === step ? C.ink : C.muted, fontWeight: i === step ? 700 : 400 }}>
              {x}
            </div>
          ))}
        </div>
      </div>
      <button style={btn("ghost")} onClick={() => app.openChat(barber.id + ":" + app.user.name, barber.name)}>
        <Icon name="chat" size={18} /> محادثة مع الحلاق
      </button>
      {b.status === "waiting" && (
        <>
          <div style={{ height: 8 }} />
          <button style={btn("danger")} onClick={() => app.setStatus(b.id, "cancelled")}>إلغاء الحجز</button>
        </>
      )}
      <div style={{ height: 12 }} />
      {loyalty}
    </>
  );
}

function CustomerApp({ app }) {
  const { tab, setTab, selected, setSelected } = app;
  const barber = app.barbers.find((x) => x.id === selected);
  const navBtn = (on) => ({ flex: 1, padding: 10, background: "none", border: "none", color: on ? C.gold : C.muted, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 12, fontFamily: "inherit", cursor: "pointer" });
  return (
    <>
      <main style={S.main}>
        {tab === "home" && (barber ? <Profile key={barber.id} app={app} barber={barber} /> : <Home app={app} />)}
        {tab === "turn" && <MyTurn app={app} />}
      </main>
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, display: "flex", background: "#17181b", borderTop: "1px solid " + C.line, direction: "rtl" }}>
        <button style={navBtn(tab === "home")} onClick={() => { setTab("home"); setSelected(null); }}>
          <Icon name="scissors" size={22} />
          الحلاقون
        </button>
        <button style={navBtn(tab === "turn")} onClick={() => setTab("turn")}>
          <Icon name="clock" size={22} />
          دوري {app.myBooking || app.pendingReview ? "•" : ""}
        </button>
      </nav>
    </>
  );
}

/* ===== لوحة تحكم الحلاق ===== */
function BarberApp({ app }) {
  const barber = app.barbers.find((x) => x.id === app.user.barberId);
  const h = app.hours[barber.id];
  const q = app.queueOf(barber.id);
  const myLooks = barber.lookbook || [];
  const blockedHere = app.blocked[barber.id] || [];
  const cell = (f) => ({ ...S.input, flex: f + " 1 0", width: "auto", minWidth: 0, padding: 8 });
  const mine = app.bookings.filter((b) => b.barberId === barber.id);
  const doneList = mine.filter((b) => b.status === "done");
  const income = doneList.reduce((t, b) => t + app.svcOf(b).price, 0);
  const history = mine.filter((b) => b.status === "done" || b.status === "cancelled").slice(-5).reverse();
  const r = app.ratingOf(barber.id);
  const stat = (value, label) => (
    <div style={{ background: C.s1, border: "1px solid " + C.line, borderRadius: 12, padding: 12, textAlign: "center" }}>
      <b style={{ display: "block", fontSize: 22, color: C.gold }}>{value}</b>
      <span style={S.muted}>{label}</span>
    </div>
  );
  return (
    <main style={{ ...S.main, paddingBottom: 24 }}>
      <div style={{ ...S.card, ...S.row }}>
        <Avatar barber={barber} />
        <div>
          <div style={S.big}>{barber.shop}</div>
          <div style={S.muted}>لوحة تحكم الحلاق: {barber.name}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 12 }}>
        {stat(q.length, "في الطابور")}
        {stat(doneList.length, "تم إنجازهم")}
        {stat(income + " دج", "الدخل")}
        {stat(r.avg.toFixed(1), "التقييم")}
      </div>

      <div style={S.card}>
        <div style={{ ...S.row, ...S.between }}>
          <b>أوقات العمل</b>
          <button style={btn(h.isOpen ? "gold" : "ghost", true)} onClick={() => app.setHour(barber.id, { isOpen: !h.isOpen })}>
            {h.isOpen ? "مفتوح الآن" : "مغلق"}
          </button>
        </div>
        <div style={{ ...S.row, marginTop: 12 }}>
          <label style={{ flex: 1 }}>
            <div style={S.muted}>من</div>
            <input type="time" style={S.input} value={h.open} onChange={(e) => app.setHour(barber.id, { open: e.target.value })} />
          </label>
          <label style={{ flex: 1 }}>
            <div style={S.muted}>إلى</div>
            <input type="time" style={S.input} value={h.close} onChange={(e) => app.setHour(barber.id, { close: e.target.value })} />
          </label>
        </div>
      </div>

      <div style={S.card}>
        <b>صورة الحلاق ومعرض القصات</b>
        <div style={{ ...S.row, marginTop: 12 }}>
          <Avatar barber={barber} />
          <label style={btn("ghost", true)}>
            رفع صورة شخصية
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { app.uploadPhoto(barber.id, e.target.files[0]); e.target.value = ""; }} />
          </label>
        </div>
        <div style={{ ...S.muted, margin: "14px 0 8px" }}>صور القصات المرفوعة ({myLooks.length})</div>
        <div style={S.grid3}>
          {myLooks.map((l) => (
            <div key={l.id} style={{ position: "relative" }}>
              <img src={l.src} alt={l.name} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 10, display: "block" }} />
              <button aria-label="حذف الصورة" onClick={() => app.removeLook(barber.id, l.id)} style={{ ...S.iconbtn, position: "absolute", top: 4, left: 4, padding: 4, background: "rgba(0,0,0,0.6)" }}>
                <Icon name="x" size={14} />
              </button>
            </div>
          ))}
        </div>
        <label style={{ ...btn("gold", true), marginTop: 12, display: "inline-flex" }}>
          إضافة صورة قصة
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { app.addLook(barber.id, e.target.files[0]); e.target.value = ""; }} />
        </label>
      </div>

      <div style={S.card}>
        <div style={{ ...S.row, ...S.between }}>
          <b>الخدمات والأسعار</b>
          <button style={btn("gold", true)} onClick={() => app.addService(barber.id)}>إضافة خدمة</button>
        </div>
        <div style={{ ...S.muted, margin: "8px 0" }}>الاسم، السعر (دج)، المدة (دقيقة)</div>
        {barber.services.map((sv) => (
          <div key={sv.id} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
            <input style={cell(2)} value={sv.name} onChange={(e) => app.patchService(barber.id, sv.id, { name: e.target.value })} />
            <input type="number" min="0" style={{ ...cell(1), direction: "ltr" }} value={sv.price} onChange={(e) => app.patchService(barber.id, sv.id, { price: Math.max(0, Number(e.target.value) || 0) })} />
            <input type="number" min="0" style={{ ...cell(1), direction: "ltr" }} value={sv.minutes} onChange={(e) => app.patchService(barber.id, sv.id, { minutes: Math.max(0, Number(e.target.value) || 0) })} />
            <button aria-label="حذف الخدمة" disabled={barber.services.length <= 1} onClick={() => app.removeService(barber.id, sv.id)} style={{ ...S.iconbtn, opacity: barber.services.length <= 1 ? 0.4 : 1 }}>
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>

      <h2 style={S.sec}>طابور المواعيد</h2>
      {q.length === 0 && <div style={{ textAlign: "center", color: C.muted, padding: 32 }}>لا يوجد زبائن في الانتظار</div>}
      {q.map((b, i) => {
        const svc = app.svcOf(b);
        return (
          <div key={b.id} style={S.card}>
            <div style={{ ...S.row, ...S.between }}>
              <div>
                <b>{i + 1}. {b.customer}</b>
                <div style={S.muted}>{svc.name} - {svc.minutes} دقيقة - {svc.price} دج</div>
                {b.cut && <div style={S.muted}>القصة المطلوبة: {b.cut}</div>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <span style={chip(b.status === "progress" ? C.gold : C.muted)}>{STATUS[b.status]}</span>
                {svc.discount > 0 && <span style={chip(C.ok)}>خصم {svc.discount}%</span>}
              </div>
            </div>
            {b.status === "progress" && (
              <div style={{ ...S.timer, margin: "10px 0" }}>{fmt((app.now - b.startedAt) / 1000)}</div>
            )}
            <div style={{ ...S.row, marginTop: 10, flexWrap: "wrap" }}>
              {b.status === "waiting" && (
                <button style={btn("gold", true)} onClick={() => app.setStatus(b.id, "progress")}>
                  <Icon name="play" size={16} /> ابدأ الحلاقة
                </button>
              )}
              {b.status === "progress" && (
                <button style={btn("gold", true)} onClick={() => app.setStatus(b.id, "done")}>
                  <Icon name="check" size={16} /> تم الانتهاء
                </button>
              )}
              <button style={S.iconbtn} aria-label="محادثة" onClick={() => app.openChat(barber.id + ":" + b.customer, b.customer)}>
                <Icon name="chat" size={18} />
              </button>
              <button style={btn("danger", true)} onClick={() => app.setStatus(b.id, "cancelled")}>إلغاء الحجز</button>
              <button style={btn("ghost", true)} onClick={() => app.blockCustomer(barber.id, b.customer)}>حظر الزبون</button>
            </div>
          </div>
        );
      })}

      {blockedHere.length > 0 && <h2 style={S.sec}>الزبائن المحظورون</h2>}
      {blockedHere.map((name) => (
        <div key={name} style={{ ...S.card, ...S.row, ...S.between }}>
          <b>{name}</b>
          <button style={btn("ghost", true)} onClick={() => app.unblock(barber.id, name)}>إلغاء الحظر</button>
        </div>
      ))}

      {history.length > 0 && <h2 style={S.sec}>آخر العمليات</h2>}
      {history.map((b) => (
        <div key={b.id} style={{ ...S.card, ...S.row, ...S.between }}>
          <div>
            <b>{b.customer}</b>
            <div style={S.muted}>{app.svcOf(b).name}</div>
          </div>
          <span style={chip(b.status === "done" ? C.ok : C.danger)}>{STATUS[b.status]}</span>
        </div>
      ))}
    </main>
  );
}

/* ===== التطبيق الرئيسي ===== */
export default function App() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState(SEED_BOOKINGS);
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [chats, setChats] = useState({});
  const [toasts, setToasts] = useState([]);
  const [tab, setTab] = useState("home");
  const [selected, setSelected] = useState(null);
  const [chat, setChat] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [barbers, setBarbers] = useState(BARBERS);
  const [blocked, setBlocked] = useState({});
  const [hours, setHours] = useState({
    1: { isOpen: true, open: "09:00", close: "20:00" },
    2: { isOpen: true, open: "10:00", close: "21:00" },
    3: { isOpen: true, open: "09:00", close: "19:00" },
  });

  // تنظيف تنسيقات قالب StackBlitz الافتراضي (هوامش الصفحة والتوسيط)
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.display = "block";
    document.body.style.background = "#0c0d0f";
    const root = document.getElementById("root");
    if (root) {
      root.style.maxWidth = "none";
      root.style.margin = "0";
      root.style.padding = "0";
      root.style.textAlign = "right";
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const notify = (text) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const queueOf = (barberId) =>
    bookings.filter((b) => b.barberId === barberId && (b.status === "waiting" || b.status === "progress"));

  const svcOf = (b) => {
    let info = b.snap;
    if (!info) {
      const ids = b.serviceIds || [b.serviceId];
      const list = barbers.find((x) => x.id === b.barberId).services.filter((s) => ids.indexOf(s.id) !== -1);
      info = {
        name: list.map((s) => s.name).join(" + "),
        base: list.reduce((t, s) => t + s.price, 0),
        minutes: list.reduce((t, s) => t + s.minutes, 0),
      };
    }
    const pct = b.discount || 0;
    return {
      name: info.name,
      base: info.base,
      discount: pct,
      price: Math.round((info.base * (100 - pct)) / 100),
      minutes: info.minutes,
    };
  };

  const ratingOf = (barberId) => {
    const list = reviews.filter((r) => r.barberId === barberId);
    const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
    return { avg, count: list.length };
  };

  const waitSecs = (barberId, bookingId) => {
    const q = queueOf(barberId);
    const idx = bookingId ? q.findIndex((x) => x.id === bookingId) : q.length;
    return q.slice(0, idx).reduce((sum, x) => {
      const total = svcOf(x).minutes * 60;
      return sum + (x.status === "progress" ? Math.max(0, total - (now - x.startedAt) / 1000) : total);
    }, 0);
  };

  const setStatus = (id, status) =>
    setBookings((list) =>
      list.map((b) => (b.id === id ? { ...b, status, startedAt: status === "progress" ? Date.now() : b.startedAt } : b))
    );

  const book = (barberId, serviceIds, cut) => {
    const pct = isEntitled(visitsOf(user.name)) ? LOYALTY_DISCOUNT : 0;
    const picked = barbers.find((x) => x.id === barberId).services.filter((s) => serviceIds.indexOf(s.id) !== -1);
    const snap = {
      name: picked.map((s) => s.name).join(" + "),
      base: picked.reduce((t, s) => t + s.price, 0),
      minutes: picked.reduce((t, s) => t + s.minutes, 0),
    };
    setBookings((list) => [
      ...list,
      { id: Date.now(), barberId, serviceIds, cut, discount: pct, snap, customer: user.name, status: "waiting", reviewed: false },
    ]);
    setSelected(null);
    setTab("turn");
  };

  const submitReview = (booking, rating, comment) => {
    setReviews((list) => [
      ...list,
      { id: Date.now(), barberId: booking.barberId, customer: user.name, rating, comment: comment.trim() },
    ]);
    setBookings((list) => list.map((b) => (b.id === booking.id ? { ...b, reviewed: true } : b)));
    notify("شكراً لتقييمك");
  };

  const skipReview = (booking) =>
    setBookings((list) => list.map((b) => (b.id === booking.id ? { ...b, reviewed: true } : b)));

  const openChat = (key, title) => setChat({ key, title });

  const sendMsg = (key, from, text) => {
    const t = text.trim();
    if (!t) return;
    setChats((c) => ({ ...c, [key]: [...(c[key] || []), { from, text: t }] }));
  };

  const logout = () => {
    setUser(null);
    setTab("home");
    setSelected(null);
    setChat(null);
  };

  const patchBarber = (id, patch) => setBarbers((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const uploadPhoto = (id, file) => readImage(file, 300, (src) => patchBarber(id, { photo: src }));
  const addLook = (id, file) =>
    readImage(file, 600, (src) =>
      setBarbers((list) =>
        list.map((x) => {
          if (x.id !== id) return x;
          const cur = x.lookbook || [];
          return { ...x, lookbook: [...cur, { id: Date.now(), name: "قصة " + (cur.length + 1), src }] };
        })
      )
    );
  const removeLook = (id, lookId) =>
    setBarbers((list) => list.map((x) => (x.id === id ? { ...x, lookbook: (x.lookbook || []).filter((l) => l.id !== lookId) } : x)));
  const blockCustomer = (barberId, name) => {
    setBlocked((m) => ({ ...m, [barberId]: [...(m[barberId] || []), name] }));
    setBookings((list) =>
      list.map((b) =>
        b.barberId === barberId && b.customer === name && (b.status === "waiting" || b.status === "progress")
          ? { ...b, status: "cancelled" }
          : b
      )
    );
  };
  const unblock = (barberId, name) =>
    setBlocked((m) => ({ ...m, [barberId]: (m[barberId] || []).filter((x) => x !== name) }));
  const createBarber = (name, shop) => {
    const id = Date.now();
    const nb = {
      id, name, shop, bio: "صالون جديد في دوري.", lookbook: [],
      services: [
        { id: 1, name: "حلاقة", price: 800, minutes: 20 },
        { id: 2, name: "تشذيب اللحية", price: 400, minutes: 10 },
        { id: 3, name: "تنظيف البشرة", price: 600, minutes: 20 },
      ],
    };
    setBarbers((l) => [...l, nb]);
    setHours((h) => ({ ...h, [id]: { isOpen: true, open: "09:00", close: "20:00" } }));
    setUser({ role: "barber", name, barberId: id });
  };
  const patchService = (barberId, sid, patch) =>
    setBarbers((list) =>
      list.map((x) =>
        x.id === barberId ? { ...x, services: x.services.map((sv) => (sv.id === sid ? { ...sv, ...patch } : sv)) } : x
      )
    );
  const addService = (barberId) =>
    setBarbers((list) =>
      list.map((x) =>
        x.id === barberId
          ? { ...x, services: [...x.services, { id: Date.now(), name: "خدمة جديدة", price: 500, minutes: 15 }] }
          : x
      )
    );
  const removeService = (barberId, sid) =>
    setBarbers((list) =>
      list.map((x) => (x.id === barberId ? { ...x, services: x.services.filter((sv) => sv.id !== sid) } : x))
    );
  const setHour = (id, patch) => setHours((h) => ({ ...h, [id]: { ...h[id], ...patch } }));
  const visitsOf = (name) => bookings.filter((b) => b.customer === name && b.status === "done").length;

  const isCustomer = !!user && user.role === "customer";
  const myBooking = isCustomer
    ? bookings.find((b) => b.customer === user.name && (b.status === "waiting" || b.status === "progress"))
    : null;
  const pendingReview = isCustomer
    ? bookings.find((b) => b.customer === user.name && b.status === "done" && !b.reviewed)
    : null;
  const myPos = myBooking ? queueOf(myBooking.barberId).findIndex((b) => b.id === myBooking.id) : -1;
  const myStatus = myBooking ? myBooking.status : "";
  const myId = myBooking ? myBooking.id : 0;
  const reviewId = pendingReview ? pendingReview.id : 0;
  const myVisits = isCustomer ? visitsOf(user.name) : 0;
  const discountOn = isEntitled(myVisits);

  useEffect(() => {
    if (!myId) return;
    if (myStatus === "progress") notify("بدأت حلاقتك الآن");
    else if (myPos === 0) notify("حان دورك! تفضل بالدخول");
    else if (myPos === 1) notify("باقي شخص واحد قبلك");
  }, [myPos, myStatus, myId]);

  useEffect(() => {
    if (reviewId) notify("انتهت خدمتك، قيّم تجربتك");
  }, [reviewId]);

  useEffect(() => {
    if (discountOn) notify("تهانينا! حصلت على خصم " + LOYALTY_DISCOUNT + "% على حجزك القادم");
  }, [discountOn, myVisits]);

  if (!user) {
    return (
      <div style={S.shell} dir="rtl">
        <Login onLogin={setUser} barbers={barbers} onCreate={createBarber} />
      </div>
    );
  }

  const app = {
    user, bookings, reviews, now, tab, setTab, selected, setSelected,
    myBooking, pendingReview, queueOf, svcOf, ratingOf, waitSecs,
    setStatus, book, submitReview, skipReview, openChat,
    hours, setHour, visitsOf,
    barbers, blocked, uploadPhoto, addLook, removeLook, blockCustomer, unblock,
    patchService, addService, removeService,
  };

  return (
    <div style={S.shell} dir="rtl">
      <div style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 24px)", maxWidth: 480, zIndex: 50, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ background: C.gold, color: C.ink, padding: "12px 14px", borderRadius: 12, display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
            <Icon name="bell" size={18} />
            {t.text}
          </div>
        ))}
      </div>

      <header style={S.top}>
        <div style={S.brand}><Icon name="scissors" size={22} /> دوري</div>
        <div style={S.row}>
          <span style={S.muted}>{user.name}</span>
          <button style={S.iconbtn} onClick={logout} aria-label="تسجيل الخروج"><Icon name="logout" size={18} /></button>
        </div>
      </header>

      {isCustomer ? <CustomerApp app={app} /> : <BarberApp app={app} />}

      {chat && (
        <ChatPanel
          title={chat.title}
          messages={chats[chat.key] || []}
          me={user.role}
          onSend={(text) => sendMsg(chat.key, user.role, text)}
          onClose={() => setChat(null)}
        />
      )}
    </div>
  );
}