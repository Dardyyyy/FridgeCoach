import { useState, useRef } from "react";

// ─── FIXED RECIPES ───────────────────────────────────────────────────
const FIXED_RECIPES = [
  {
    id:1, name:"High-Protein Omelette", emoji:"🍳", time:"10 Min", difficulty:"Einfach", tag:"Frühstück",
    macros:{cal:"420",prot:"38",carbs:"6",fat:"28"},
    ingredients:["4 Eier","100g Hüttenkäse","50g Spinat","30g Fetakäse","1 Tomate","Salz, Pfeffer, Oregano"],
    shopping:["Eier (10er Packung)","Hüttenkäse 200g","Babyspinat 100g","Fetakäse 200g","Tomaten"],
    steps:["Eier mit Hüttenkäse, Salz und Pfeffer verquirlen.","Pfanne auf mittlere Hitze erhitzen, etwas Butter.","Ei-Masse eingießen, 2 Min stocken lassen.","Spinat, Tomate und Feta auf eine Hälfte geben.","Omelette zuklappen, weitere 2 Min garen."],
    tip:"Hüttenkäse verdoppelt den Proteingehalt fast ohne Kalorien – perfekt als Pre-Workout Frühstück."
  },
  {
    id:2, name:"Chicken Power Bowl", emoji:"🥣", time:"25 Min", difficulty:"Mittel", tag:"Mittagessen",
    macros:{cal:"580",prot:"52",carbs:"42",fat:"14"},
    ingredients:["200g Hühnerbrust","80g Quinoa roh","½ Avocado","100g Cherrytomaten","50g Rucola","Zitrone, Olivenöl","Paprikapulver, Knoblauch"],
    shopping:["Hühnerbrust 500g","Quinoa 500g","Avocados 2 Stück","Cherrytomaten 250g","Rucola 100g","Zitronen"],
    steps:["Quinoa in doppelter Menge Wasser 15 Min kochen.","Hühnerbrust würzen und 6–7 Min je Seite braten.","Hähnchen ruhen lassen, in Streifen schneiden.","Bowl aufbauen: Quinoa, Rucola, Tomaten, Avocado, Hähnchen.","Mit Zitronensaft und Olivenöl beträufeln."],
    tip:"Quinoa liefert alle essentiellen Aminosäuren – kombiniert mit Hähnchen ideal für Muskelaufbau."
  },
  {
    id:3, name:"Tuna Protein Wrap", emoji:"🌯", time:"8 Min", difficulty:"Einfach", tag:"Schnell",
    macros:{cal:"390",prot:"42",carbs:"28",fat:"10"},
    ingredients:["1 Dose Thunfisch (natural)","2 Vollkorn-Wraps","3 EL Magerquark","½ Gurke","1 Karotte","Salat, Zitrone, Dill"],
    shopping:["Thunfisch in Wasser 3er-Pack","Vollkorn-Wraps 6er","Magerquark 500g","Salatgurke","Karotten 500g"],
    steps:["Thunfisch abtropfen, mit Magerquark und Dill mischen.","Gurke und Karotte in Streifen schneiden.","Wrap kurz trocken anwärmen.","Thunfisch-Creme aufstreichen, Gemüse drauf.","Fest aufrollen, diagonal schneiden."],
    tip:"Thunfisch in Wasser: kaum Fett, über 25g Protein pro 100g – ideal in der Diätphase."
  },
  {
    id:4, name:"Grüner Protein-Shake", emoji:"🥤", time:"5 Min", difficulty:"Einfach", tag:"Post-Workout",
    macros:{cal:"310",prot:"29",carbs:"32",fat:"6"},
    ingredients:["1 Scoop Whey Vanilla","150g Magerjoghurt","1 Banane","Handvoll Spinat","200ml Mandelmilch","1 TL Erdnussbutter"],
    shopping:["Whey Protein Vanille","Magerjoghurt 500g","Bananen","Babyspinat 100g","Mandelmilch 1L","Erdnussbutter natur"],
    steps:["Alle Zutaten in den Mixer geben.","30 Sekunden auf höchster Stufe mixen.","Sofort trinken."],
    tip:"Spinat schmeckt man kaum, liefert aber Eisen und Magnesium – ideal direkt nach dem Training."
  }
];

// ─── AI RECIPE POOL (fallback if needed) ────────────────────────────
const RECIPE_POOL = [
  { name:"Griechischer Lachs", emoji:"🐟", time:"20 Min", difficulty:"Mittel", tag:"Abendessen", kcal:480, protein:46, carbs:8, fat:22, ingredients:["200g Lachsfilet","100g Quinoa","50g Feta","½ Gurke","10 Oliven","Zitrone","Oregano"], shopping:["Lachsfilet 400g","Quinoa 500g","Fetakäse 200g","Gurke","Oliven Glas","Zitronen"], steps:["Quinoa 15 Min kochen.","Lachs würzen, 4 Min je Seite braten.","Gurke würfeln, mit Feta und Oliven mischen.","Alles anrichten."], tip:"Lachs liefert Omega-3 für Muskelregeneration." },
  { name:"Türkische Eier", emoji:"🍳", time:"12 Min", difficulty:"Einfach", tag:"Frühstück", kcal:380, protein:28, carbs:12, fat:24, ingredients:["3 Eier","200g Magerjoghurt","2 Knoblauchzehen","Butter","Paprikapulver"], shopping:["Eier 10er","Magerjoghurt 500g","Knoblauch","Butter 250g","Paprikapulver"], steps:["Joghurt mit Knoblauch verrühren.","Eier pochieren.","Paprikabutter schmelzen.","Alles zusammen anrichten."], tip:"Kombination Eier + Joghurt = optimale Proteinsynthese." },
  { name:"Mexikanische Hack Bowl", emoji:"🌮", time:"22 Min", difficulty:"Einfach", tag:"Mittagessen", kcal:620, protein:48, carbs:45, fat:18, ingredients:["250g Rinderhack","80g Reis","½ Dose Kidneybohnen","1 Paprika","Chili, Kreuzkümmel"], shopping:["Rinderhack 500g (5% Fett)","Basmati Reis 1kg","Kidneybohnen Dose","Paprika rot"], steps:["Reis kochen.","Hack krümelig braten.","Gewürze und Bohnen dazu.","Mit Limette servieren."], tip:"Kidneybohnen stabilisieren den Blutzucker." },
  { name:"Thai Garnelen Stir-Fry", emoji:"🍤", time:"15 Min", difficulty:"Mittel", tag:"Abendessen", kcal:390, protein:44, carbs:22, fat:12, ingredients:["200g Garnelen","100g Reisnudeln","1 Zucchini","Sojasoße","Ingwer"], shopping:["Garnelen TK 400g","Reisnudeln 500g","Zucchini","Sojasoße","Ingwer frisch"], steps:["Nudeln zubereiten.","Gemüse stir-fry.","Garnelen dazu.","Mit Sojasoße abschmecken."], tip:"Garnelen: 85 kcal / 20g Protein – perfekt zum Cutten." },
  { name:"Skyr Protein Bowl", emoji:"🍓", time:"5 Min", difficulty:"Einfach", tag:"Frühstück", kcal:340, protein:34, carbs:38, fat:4, ingredients:["250g Skyr","1 Scoop Vanilleprotein","150g Beeren","30g Granola","Chiasamen"], shopping:["Skyr Natur 500g","Whey Vanille","Beeren TK 500g","Granola ohne Zucker","Chiasamen"], steps:["Skyr mit Protein rühren.","Beeren drauf.","Mit Granola und Chiasamen bestreuen."], tip:"Skyr hat doppelt so viel Protein wie normaler Joghurt." },
  { name:"Post-Workout Reisbrei", emoji:"🍚", time:"10 Min", difficulty:"Einfach", tag:"Post-Workout", kcal:520, protein:38, carbs:72, fat:8, ingredients:["80g Rundkornreis","400ml Milch","1 Scoop Schokoprotein","1 Banane","Erdnussbutter"], shopping:["Rundkornreis 1kg","Milch 1,5% 1L","Whey Schokolade","Bananen","Erdnussbutter natur"], steps:["Reis in Milch cremig kochen.","Protein einrühren.","Mit Banane und Erdnussbutter servieren."], tip:"Schnelle Carbs + Protein direkt nach dem Training." },
  { name:"Hähnchen Souvlaki", emoji:"🥙", time:"25 Min", difficulty:"Einfach", tag:"Mittagessen", kcal:510, protein:54, carbs:28, fat:14, ingredients:["250g Hühnerbrust","2 Pitabrote","100g Tzatziki","Tomate","Zwiebel","Oregano"], shopping:["Hühnerbrust 500g","Vollkorn Pita 6er","Tzatziki 200g","Tomaten","Rote Zwiebeln"], steps:["Hähnchen marinieren.","10 Min grillen/braten.","Pita erwärmen.","Mit Tzatziki und Gemüse servieren."], tip:"Zitrusmarinade macht Fleisch zart ohne Kalorien." },
  { name:"Spinat-Hähnchen Pasta", emoji:"🍝", time:"20 Min", difficulty:"Einfach", tag:"Abendessen", kcal:590, protein:50, carbs:55, fat:12, ingredients:["200g Hühnerbrust","100g Vollkorn-Penne","100g Spinat","Knoblauch","Parmesan"], shopping:["Hühnerbrust 500g","Vollkorn-Penne 500g","Babyspinat 200g","Parmesan am Stück"], steps:["Pasta kochen.","Hähnchen in Streifen braten.","Spinat unterheben.","Mit Parmesan servieren."], tip:"Vollkorn-Pasta: 3x mehr Ballaststoffe." },
];

// ─── STYLES ──────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#080808;color:#f0f0f0;font-family:'Inter',sans-serif;min-height:100vh}
.app{max-width:480px;margin:0 auto;padding-bottom:60px}
.hdr{padding:24px 20px 0;display:flex;align-items:center;gap:10px}
.hdr-icon{width:38px;height:38px;background:#00ff87;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.hdr-title{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px}
.hdr-title em{color:#00ff87;font-style:normal}
.hdr-sub{font-size:11px;color:#333;margin-top:1px}
.tabs{display:flex;margin:20px 20px 0;background:#111;border-radius:14px;padding:4px;gap:4px}
.tab{flex:1;padding:10px 4px;border:none;background:transparent;color:#555;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;border-radius:11px;cursor:pointer;transition:all .2s}
.tab.on{background:#1a1a1a;color:#00ff87}
.sec{padding:0 20px;margin-top:20px}
.upload-box{border:2px dashed #222;border-radius:20px;padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:all .2s;background:#111;position:relative;overflow:hidden}
.upload-box:hover,.upload-box.drag{border-color:#00ff87;background:#0a180f}
.upload-box.filled{padding:0;border-style:solid;border-color:#00ff87;cursor:default}
.upload-img{width:100%;border-radius:18px;display:block;max-height:260px;object-fit:cover}
.upload-badge{position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);padding:5px 12px;border-radius:20px;font-size:11px;color:#00ff87;font-weight:600;border:1px solid #00ff8740}
.upload-icon{font-size:44px;opacity:.3}
.upload-lbl{font-size:15px;font-weight:500;color:#bbb}
.upload-sub{font-size:12px;color:#333;text-align:center}
.cam-btn,.reset-btn{width:100%;margin-top:10px;background:transparent;border:1px solid #1e1e1e;border-radius:14px;padding:13px;color:#555;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.cam-btn:hover,.reset-btn:hover{border-color:#333;color:#888}
.go-btn{width:100%;margin-top:14px;background:#00ff87;color:#000;border:none;border-radius:16px;padding:18px;font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .15s}
.go-btn:hover:not([disabled]){transform:translateY(-1px);box-shadow:0 8px 28px #00ff8740}
.go-btn[disabled]{opacity:.3;cursor:not-allowed}
.loading{margin-top:20px;background:#111;border:1px solid #1e1e1e;border-radius:20px;padding:32px 20px;display:flex;flex-direction:column;align-items:center;gap:14px}
.spinner{width:44px;height:44px;border:3px solid #1e1e1e;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite}
.spinner-sm{width:16px;height:16px;border:2px solid #1e1e1e;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-txt{font-size:14px;color:#555;text-align:center;line-height:1.6}
.loading-txt strong{color:#00ff87}
.err-box{margin-top:16px;background:#180808;border:1px solid #3a1010;border-radius:14px;padding:14px 16px;color:#ff6b6b;font-size:13px;line-height:1.5}
.recipe-card{background:#111;border:1px solid #1e1e1e;border-radius:20px;overflow:hidden;margin-top:20px}
.rc-top{padding:20px 20px 0}
.rc-tag{display:inline-flex;align-items:center;gap:5px;background:#0a180f;border:1px solid #00ff8730;border-radius:20px;padding:4px 10px;font-size:11px;color:#00ff87;font-weight:600;letter-spacing:.5px;margin-bottom:10px}
.rc-name{font-family:'Bebas Neue',sans-serif;font-size:34px;letter-spacing:1px;line-height:1;color:#fff}
.rc-meta{display:flex;gap:14px;margin-top:8px}
.rc-meta span{font-size:12px;color:#555}
.macro-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#1a1a1a;margin-top:20px}
.macro-cell{background:#0d0d0d;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:3px}
.macro-val{font-family:'Bebas Neue',sans-serif;font-size:26px;color:#00ff87;letter-spacing:.5px}
.macro-lbl{font-size:9px;color:#444;letter-spacing:1.5px;text-transform:uppercase}
.rc-body{padding:20px}
.lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#444;font-weight:600;margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
.chip{background:#161616;border:1px solid #222;border-radius:20px;padding:5px 11px;font-size:12px;color:#bbb}
.step-row{display:flex;gap:12px;margin-bottom:14px;align-items:flex-start}
.step-n{width:26px;height:26px;background:#161616;border:1px solid #222;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#00ff87;flex-shrink:0;margin-top:1px}
.step-t{font-size:13px;color:#bbb;line-height:1.6}
.tip-box{background:#0a180f;border:1px solid #00ff8725;border-radius:12px;padding:12px 14px;display:flex;gap:10px;margin-top:4px}
.tip-box p{font-size:12px;color:#7aff9e;line-height:1.5}
.shop-card{background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:16px;margin-top:12px}
.shop-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.shop-lbl{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#00ff87;font-weight:600}
.shop-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #161616;cursor:pointer}
.shop-item:last-child{border-bottom:none}
.shop-check{width:18px;height:18px;border:1.5px solid #333;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .15s;color:#000;font-weight:700}
.shop-check.on{background:#00ff87;border-color:#00ff87}
.shop-name{font-size:13px;color:#bbb;flex:1}
.shop-name.done{text-decoration:line-through;color:#333}
.section-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#444;font-weight:600;margin-bottom:10px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.tile{background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:14px;cursor:pointer;transition:all .2s;text-align:left}
.tile:hover,.tile.on{border-color:#00ff87;background:#0a180f}
.tile-emoji{font-size:26px;margin-bottom:6px}
.tile-name{font-family:'Bebas Neue',sans-serif;font-size:17px;color:#fff;line-height:1.1;margin-bottom:3px}
.tile-meta{font-size:11px;color:#444}
.tile-tag{display:inline-block;background:#161616;border-radius:6px;padding:2px 7px;font-size:10px;color:#00ff87;font-weight:600;margin-top:6px}
.ai-gen-btn{width:100%;margin-top:14px;background:transparent;border:1px solid #00ff8330;border-radius:14px;padding:14px;color:#00ff87;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.ai-gen-btn:hover:not([disabled]){background:#0a180f;border-color:#00ff8360}
.ai-gen-btn[disabled]{opacity:.4;cursor:not-allowed}
.ai-list{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.ai-row{background:#111;border:1px solid #1e1e1e;border-radius:14px;padding:14px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px}
.ai-row:hover,.ai-row.on{border-color:#00ff87;background:#0a180f}
.ai-emoji{font-size:28px}
.ai-info{flex:1}
.ai-name{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff;line-height:1}
.ai-sub{font-size:11px;color:#444;margin-top:2px}
.ai-prot{font-size:12px;color:#00ff87;font-weight:600;margin-top:4px}
.chevron{color:#2a2a2a;font-size:14px}
`;

// ─── API CALL (via serverless proxy) ─────────────────────────────────
async function callAPI(body) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'API error');
  return data.content?.[0]?.text || '';
}

// ─── PARSE HELPERS ───────────────────────────────────────────────────
function parseMacros(t) {
  const n = (rx) => t.match(rx)?.[1] ?? '—';
  return {
    cal:   n(/(\d+)\s*kcal/i),
    prot:  n(/Protein[:\s]+(\d+)/i) !== '—' ? n(/Protein[:\s]+(\d+)/i) : n(/(\d+)\s*g\s*Protein/i),
    carbs: n(/Kohlenhydrate[:\s]+(\d+)/i) !== '—' ? n(/Kohlenhydrate[:\s]+(\d+)/i) : n(/(\d+)\s*g\s*Carbs/i),
    fat:   n(/Fett[:\s]+(\d+)/i) !== '—' ? n(/Fett[:\s]+(\d+)/i) : n(/(\d+)\s*g\s*Fett/i),
  };
}

function parseRecipe(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  let name = '', ing = [], steps = [], tip = '', shopping = [], time = '~20 Min', diff = 'Einfach', mode = null;
  for (const l of lines) {
    const lo = l.toLowerCase();
    if (/^#+/.test(l)) { const cl = l.replace(/^#+\s*/,''); if (!name && cl.length < 70 && !lo.includes('zutat') && !lo.includes('zubereitung') && !lo.includes('einkauf') && !lo.includes('tipp')) { name = cl; continue; } }
    if (lo.includes('einkauf')) { mode = 'shop'; continue; }
    if (lo.includes('zutat')) { mode = 'ing'; continue; }
    if (lo.includes('zubereitung') || lo.includes('schritt')) { mode = 'steps'; continue; }
    if (lo.includes('tipp')) { mode = 'tip'; continue; }
    if (lo.match(/zeit[:\s]/)) { time = l.replace(/.*?:/,'').trim(); continue; }
    if (lo.match(/schwierig/)) { diff = l.replace(/.*?:/,'').trim(); continue; }
    if (!name && l.length < 70 && !/^[-*•\d]/.test(l)) { name = l; continue; }
    const cl = l.replace(/^[-*•]\s*/,'').replace(/^\d+[.)]\s*/,'');
    if (mode === 'ing') ing.push(cl);
    else if (mode === 'shop') shopping.push(cl);
    else if (mode === 'steps') steps.push(cl);
    else if (mode === 'tip') tip += ' ' + cl;
  }
  return { name: name || 'Fitness Rezept', ingredients: ing, steps, tip: tip.trim(), shopping, time, difficulty: diff, macros: parseMacros(raw) };
}

// ─── RECIPE VIEW ─────────────────────────────────────────────────────
function RecipeView({ r }) {
  const [checked, setChecked] = useState({});
  const list = r.shopping?.length ? r.shopping : r.ingredients;
  const toggle = i => setChecked(p => ({ ...p, [i]: !p[i] }));
  return (
    <>
      <div className="recipe-card">
        <div className="rc-top">
          <div className="rc-tag">💪 {r.tag || 'Fitness Rezept'}</div>
          <div className="rc-name">{r.emoji || ''} {r.name}</div>
          <div className="rc-meta"><span>⏱ {r.time}</span><span>📊 {r.difficulty}</span></div>
        </div>
        <div className="macro-grid">
          {[['cal','Kalorien'],['prot','Protein'],['carbs','Carbs'],['fat','Fett']].map(([k,l]) => (
            <div className="macro-cell" key={k}>
              <div className="macro-val">{r.macros[k]}{k!=='cal'&&r.macros[k]!=='—'?'g':''}</div>
              <div className="macro-lbl">{l}</div>
            </div>
          ))}
        </div>
        <div className="rc-body">
          {r.ingredients.length > 0 && <><div className="lbl">Zutaten</div><div className="chips">{r.ingredients.map((x,i)=><span className="chip" key={i}>{x}</span>)}</div></>}
          {r.steps.length > 0 && <><div className="lbl">Zubereitung</div>{r.steps.map((s,i)=>(
            <div className="step-row" key={i}><div className="step-n">{i+1}</div><div className="step-t">{s}</div></div>
          ))}</>}
          {r.tip && <div className="tip-box"><span>💪</span><p>{r.tip}</p></div>}
        </div>
      </div>
      {list.length > 0 && (
        <div className="shop-card">
          <div className="shop-hdr">
            <div className="shop-lbl">🛒 Einkaufsliste</div>
            <span style={{fontSize:11,color:'#444'}}>{Object.values(checked).filter(Boolean).length}/{list.length}</span>
          </div>
          {list.map((item,i) => (
            <div className="shop-item" key={i} onClick={()=>toggle(i)}>
              <div className={`shop-check${checked[i]?' on':''}`}>{checked[i]?'✓':''}</div>
              <div className={`shop-name${checked[i]?' done':''}`}>{item}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('scan');
  const [img, setImg] = useState(null);
  const [b64, setB64] = useState(null);
  const [b64Type, setB64Type] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanErr, setScanErr] = useState(null);
  const [drag, setDrag] = useState(false);
  const [selFixed, setSelFixed] = useState(null);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(null);
  const [selAi, setSelAi] = useState(null);
  const fileRef = useRef();
  const camRef = useRef();

  const loadFile = f => {
    if (!f?.type.startsWith('image/')) return;
    setImg(URL.createObjectURL(f));
    setScanResult(null); setScanErr(null);
    setB64Type('image/jpeg');

    // Compress image to max 1024px and quality 0.7 before sending
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1024;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        setB64(compressed.split(',')[1]);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(f);
  };

  const doScan = async () => {
    if (!b64) return;
    setLoading(true); setScanErr(null); setScanResult(null);
    try {
      setLoadStep('Bild wird analysiert…');
      const text = await callAPI({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1400,
        system: 'Du bist ein Fitness-Koch. Antworte auf Deutsch. Format:\n# Rezeptname\nZeit: X Min\nSchwierigkeit: Einfach\nX kcal | Protein: Xg | Kohlenhydrate: Xg | Fett: Xg\n## Zutaten\n- ...\n## Einkaufsliste\n- ...\n## Zubereitung\n1. ...\n## Tipp\n...',
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: (['image/jpeg','image/png','image/gif','image/webp'].includes(b64Type) ? b64Type : 'image/jpeg'), data: b64 } },
            { type: 'text', text: 'Erkenne alle Lebensmittel in diesem Bild und erstelle daraus ein proteinreiches Fitness-Rezept.' }
          ]
        }]
      });
      setLoadStep('Rezept wird aufbereitet…');
      const recipe = parseRecipe(text);
      recipe.tag = 'Aus deinem Kühlschrank';
      setScanResult(recipe);
    } catch (e) {
      setScanErr('Fehler: ' + e.message);
    } finally {
      setLoading(false); setLoadStep('');
    }
  };

  const genAiRecipes = async () => {
    setAiLoading(true); setAiRecipes([]); setSelAi(null); setAiErr(null);
    try {
      const themes = ['mediterran','asiatisch','mexikanisch','low-carb','vegetarisch','high-carb','deutsch','nordisch'];
      const theme = themes[Math.floor(Math.random() * themes.length)];

      const text = await callAPI({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: 'Erstelle 4 ' + theme + 'e Fitness-Rezepte auf Deutsch. Antworte NUR mit JSON-Array. Format: [{name,emoji,time,difficulty,tag,kcal,protein,carbs,fat,ingredients:[],shopping:[],steps:[],tip}]. Tags: Fruehstueck, Mittagessen, Abendessen, Post-Workout. Seed:' + Date.now()
        }]
      });

      const a = text.indexOf('['), b = text.lastIndexOf(']');
      if (a === -1 || b === -1) throw new Error('Kein JSON erhalten');
      const parsed = JSON.parse(text.slice(a, b + 1));
      setAiRecipes(parsed.map(r => ({
        ...r,
        ingredients: r.ingredients || [],
        shopping: r.shopping || r.ingredients || [],
        steps: r.steps || [],
        tip: r.tip || '',
        macros: { cal: String(r.kcal||'—'), prot: String(r.protein||'—'), carbs: String(r.carbs||'—'), fat: String(r.fat||'—') }
      })));
    } catch(e) {
      // Fallback to local pool
      const shuffled = [...RECIPE_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
      setAiRecipes(shuffled.map(r => ({
        ...r, ingredients: r.ingredients||[], shopping: r.shopping||[], steps: r.steps||[], tip: r.tip||'',
        macros: { cal: String(r.kcal), prot: String(r.protein), carbs: String(r.carbs), fat: String(r.fat) }
      })));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])} />
      <div className="app">
        <div className="hdr">
          <div className="hdr-icon">🥗</div>
          <div>
            <div className="hdr-title">FRIDGE<em>COACH</em></div>
            <div className="hdr-sub">KI-powered Fitness-Rezepte</div>
          </div>
        </div>
        <div className="tabs">
          <button className={`tab${tab==='scan'?' on':''}`} onClick={()=>setTab('scan')}>📸 Kühlschrank scannen</button>
          <button className={`tab${tab==='samples'?' on':''}`} onClick={()=>setTab('samples')}>🍽 Beispiel-Rezepte</button>
        </div>

        {tab==='scan' && (
          <div className="sec">
            <div className={`upload-box${img?' filled':''}${drag?' drag':''}`}
              onClick={()=>!img&&fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0])}}>
              {img ? <><img src={img} className="upload-img" alt="Kühlschrank"/><div className="upload-badge">✓ Foto geladen</div></>
                : <><div className="upload-icon">🧊</div><div className="upload-lbl">Kühlschrank-Foto hochladen</div><div className="upload-sub">Tippe zum Auswählen · JPG, PNG</div></>}
            </div>
            {!img && <button className="cam-btn" onClick={()=>camRef.current.click()}>📷 Kamera öffnen</button>}
            {img && !loading && <>
              <button className="go-btn" onClick={doScan} disabled={!b64}>⚡ REZEPT GENERIEREN</button>
              <button className="reset-btn" onClick={()=>{setImg(null);setB64(null);setScanResult(null);setScanErr(null)}}>↩ Neues Foto</button>
            </>}
            {loading && <div className="loading"><div className="spinner"/><div className="loading-txt"><strong>{loadStep}</strong><br/>KI analysiert deine Zutaten…</div></div>}
            {scanErr && <div className="err-box">⚠️ {scanErr}</div>}
            {scanResult && <RecipeView r={scanResult}/>}
          </div>
        )}

        {tab==='samples' && (
          <div className="sec">
            <div className="section-title">Klassiker</div>
            <div className="grid2">
              {FIXED_RECIPES.map((r,i) => (
                <div key={r.id} className={`tile${selFixed===i?' on':''}`} onClick={()=>{setSelFixed(selFixed===i?null:i);setSelAi(null)}}>
                  <div className="tile-emoji">{r.emoji}</div>
                  <div className="tile-name">{r.name}</div>
                  <div className="tile-meta">⏱ {r.time} · 💪 {r.macros.prot}g</div>
                  <div className="tile-tag">{r.tag}</div>
                </div>
              ))}
            </div>
            {selFixed !== null && selAi === null && <RecipeView r={FIXED_RECIPES[selFixed]}/>}

            <div style={{marginTop:24}}>
              <div className="section-title">KI-generiert</div>
              <button className="ai-gen-btn" onClick={genAiRecipes} disabled={aiLoading}>
                {aiLoading ? <><span className="spinner-sm"/> Generiere…</> : '✨ Neue Rezepte generieren'}
              </button>
              {aiLoading && <div className="loading" style={{marginTop:12}}><div className="spinner"/><div className="loading-txt"><strong>KI erstellt Rezepte…</strong></div></div>}
              {aiErr && <div className="err-box">⚠️ {aiErr}</div>}
              {aiRecipes.length > 0 && (
                <div className="ai-list">
                  {aiRecipes.map((r,i) => (
                    <div key={i} className={`ai-row${selAi===i?' on':''}`} onClick={()=>{setSelAi(selAi===i?null:i);setSelFixed(null)}}>
                      <div className="ai-emoji">{r.emoji||'🥗'}</div>
                      <div className="ai-info">
                        <div className="ai-name">{r.name}</div>
                        <div className="ai-sub">⏱ {r.time} · {r.tag}</div>
                        <div className="ai-prot">💪 {r.macros.prot}g Protein · {r.macros.cal} kcal</div>
                      </div>
                      <span className="chevron">{selAi===i?'▲':'▼'}</span>
                    </div>
                  ))}
                </div>
              )}
              {selAi !== null && <RecipeView r={aiRecipes[selAi]}/>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
