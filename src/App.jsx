import { useState, useRef, useEffect } from "react";

// ── Image helpers ─────────────────────────────────────────────────────
const FALLBACK = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80";
const imgCache = {};
function toQuery(name, tag) {
  const n = (name + " " + (tag||"")).toLowerCase();
  if (n.includes("omelette") || n.includes("rührei")) return "protein omelette eggs";
  if (n.includes("pancake")) return "protein pancakes breakfast";
  if (n.includes("power bowl") || (n.includes("bowl") && n.includes("chicken"))) return "chicken bowl healthy";
  if (n.includes("wrap") || n.includes("tuna") || n.includes("thun")) return "tuna wrap lunch";
  if (n.includes("shake") || n.includes("smoothie")) return "protein smoothie green";
  if (n.includes("lachs") || n.includes("salmon")) return "grilled salmon dish";
  if (n.includes("mexik") || n.includes("hack")) return "mexican bowl food";
  if (n.includes("garnelen") || n.includes("thai")) return "shrimp stir fry";
  if (n.includes("skyr") || n.includes("beeren")) return "yogurt berry bowl";
  if (n.includes("reisbrei") || n.includes("porridge")) return "rice pudding bowl";
  if (n.includes("pasta") || n.includes("nudel")) return "chicken pasta healthy";
  if (n.includes("souvlaki") || n.includes("pita")) return "chicken souvlaki greek";
  if (n.includes("tofu")) return "tofu bowl vegan";
  if (n.includes("türk") || n.includes("cilbir")) return "poached eggs yogurt";
  if (n.includes("frueh") || n.includes("breakfast")) return "healthy breakfast";
  if (n.includes("mittag") || n.includes("lunch")) return "healthy lunch meal";
  if (n.includes("abend") || n.includes("dinner")) return "healthy dinner protein";
  if (n.includes("workout")) return "post workout meal";
  return name.split(" ").slice(0,2).join(" ") + " food";
}
async function getImg(name, tag) {
  const q = toQuery(name, tag);
  if (imgCache[q]) return imgCache[q];
  try {
    const res = await fetch("/api/unsplash?query=" + encodeURIComponent(q));
    const data = await res.json();
    if (data.results?.length > 0) {
      const url = data.results[Math.floor(Math.random() * Math.min(3, data.results.length))].urls.regular;
      imgCache[q] = url; return url;
    }
  } catch(e) {}
  return FALLBACK;
}
function FoodImg({ name, tag, className, style }) {
  const [src, setSrc] = useState(FALLBACK);
  useEffect(() => { let a=true; getImg(name,tag).then(u=>{if(a)setSrc(u);}); return()=>{a=false;}; }, [name]);
  return <img src={src} alt={name} className={className} style={style} loading="lazy" />;
}

// ── Price DB ──────────────────────────────────────────────────────────
const PRICE_DB = {
  "eier":        [{name:"Bio Eier 10 Stück",brand:"REWE Bio",price:2.49,unit:"10 Stk",emoji:"🥚"},{name:"Freilandeier 6 Stück",brand:"Ja!",price:1.19,unit:"6 Stk",emoji:"🥚"},{name:"Eier M 10 Stück",brand:"REWE",price:1.79,unit:"10 Stk",emoji:"🥚"}],
  "hühnerbrust": [{name:"Hähnchenbrustfilet",brand:"REWE",price:4.99,unit:"500g",emoji:"🍗"},{name:"Bio Hähnchenbrustfilet",brand:"REWE Bio",price:6.49,unit:"400g",emoji:"🍗"},{name:"Hähnchenbrust natur",brand:"Wiesenhof",price:3.99,unit:"400g",emoji:"🍗"}],
  "hähnchen":    [{name:"Hähnchenbrustfilet",brand:"REWE",price:4.99,unit:"500g",emoji:"🍗"},{name:"Bio Hähnchenbrustfilet",brand:"REWE Bio",price:6.49,unit:"400g",emoji:"🍗"},{name:"Hähnchenschenkel",brand:"REWE",price:3.49,unit:"1kg",emoji:"🍗"}],
  "lachs":       [{name:"Lachsfilet",brand:"REWE",price:3.99,unit:"200g",emoji:"🐟"},{name:"Bio Lachs",brand:"REWE Bio",price:5.99,unit:"200g",emoji:"🐟"},{name:"Räucherlachs",brand:"Forsthaus Rungis",price:2.49,unit:"100g",emoji:"🐟"}],
  "thunfisch":   [{name:"Thunfisch in Wasser",brand:"Nixe",price:0.99,unit:"185g",emoji:"🐟"},{name:"Thunfisch natur",brand:"REWE",price:1.29,unit:"185g",emoji:"🐟"},{name:"Bio Thunfisch",brand:"followfish",price:2.49,unit:"185g",emoji:"🐟"}],
  "quinoa":      [{name:"Quinoa weiß",brand:"REWE Bio",price:2.99,unit:"400g",emoji:"🌾"},{name:"Quinoa",brand:"Alnatura",price:3.49,unit:"500g",emoji:"🌾"},{name:"Quinoa Trio",brand:"REWE Bio",price:3.29,unit:"400g",emoji:"🌾"}],
  "avocado":     [{name:"Avocado reif",brand:"REWE",price:1.29,unit:"Stück",emoji:"🥑"},{name:"Bio Avocado",brand:"REWE Bio",price:1.79,unit:"Stück",emoji:"🥑"},{name:"Avocado 2er Pack",brand:"REWE",price:2.29,unit:"2 Stk",emoji:"🥑"}],
  "spinat":      [{name:"Babyspinat",brand:"REWE",price:1.49,unit:"150g",emoji:"🥬"},{name:"Bio Babyspinat",brand:"REWE Bio",price:1.99,unit:"150g",emoji:"🥬"},{name:"Blattspinat TK",brand:"Iglo",price:1.29,unit:"750g",emoji:"🥬"}],
  "joghurt":     [{name:"Magerjoghurt",brand:"REWE",price:0.59,unit:"500g",emoji:"🥛"},{name:"Griechischer Joghurt",brand:"Fage",price:1.99,unit:"500g",emoji:"🥛"},{name:"Bio Joghurt",brand:"REWE Bio",price:0.99,unit:"500g",emoji:"🥛"}],
  "skyr":        [{name:"Skyr Natur",brand:"Arla",price:1.49,unit:"500g",emoji:"🥛"},{name:"Isländischer Skyr",brand:"REWE",price:1.29,unit:"500g",emoji:"🥛"},{name:"Bio Skyr",brand:"Siggi's",price:2.49,unit:"450g",emoji:"🥛"}],
  "reis":        [{name:"Basmati Reis",brand:"REWE",price:1.49,unit:"1kg",emoji:"🍚"},{name:"Bio Basmati",brand:"REWE Bio",price:2.29,unit:"1kg",emoji:"🍚"},{name:"Jasmin Reis",brand:"Ja!",price:1.29,unit:"1kg",emoji:"🍚"}],
  "pasta":       [{name:"Vollkorn Penne",brand:"REWE",price:0.89,unit:"500g",emoji:"🍝"},{name:"Bio Vollkorn Spaghetti",brand:"Alnatura",price:1.49,unit:"500g",emoji:"🍝"},{name:"Penne Rigate",brand:"Barilla",price:1.19,unit:"500g",emoji:"🍝"}],
  "banane":      [{name:"Bananen",brand:"REWE",price:1.49,unit:"~1kg",emoji:"🍌"},{name:"Bio Bananen",brand:"REWE Bio",price:2.29,unit:"~1kg",emoji:"🍌"},{name:"Fairtrade Bananen",brand:"REWE",price:1.79,unit:"~1kg",emoji:"🍌"}],
  "mandelmilch": [{name:"Mandelmilch ungesüßt",brand:"Alpro",price:1.99,unit:"1L",emoji:"🥛"},{name:"Mandelmilch",brand:"REWE Bio",price:1.79,unit:"1L",emoji:"🥛"},{name:"Mandel Drink",brand:"Oatly",price:2.29,unit:"1L",emoji:"🥛"}],
  "erdnussbutter":[{name:"Erdnussmus",brand:"Alnatura",price:2.99,unit:"500g",emoji:"🥜"},{name:"Erdnussbutter crunchy",brand:"Skippy",price:3.49,unit:"454g",emoji:"🥜"},{name:"Bio Erdnussmus",brand:"REWE Bio",price:2.49,unit:"500g",emoji:"🥜"}],
  "fetakäse":    [{name:"Feta",brand:"REWE",price:1.49,unit:"200g",emoji:"🧀"},{name:"Bio Feta",brand:"Andechser",price:2.29,unit:"200g",emoji:"🧀"},{name:"Griechischer Feta",brand:"Dodoni",price:2.49,unit:"200g",emoji:"🧀"}],
  "hüttenkäse":  [{name:"Hüttenkäse",brand:"REWE",price:0.99,unit:"200g",emoji:"🧀"},{name:"Hüttenkäse",brand:"Exquisa",price:1.29,unit:"200g",emoji:"🧀"},{name:"Bio Hüttenkäse",brand:"REWE Bio",price:1.49,unit:"200g",emoji:"🧀"}],
  "magerquark":  [{name:"Magerquark",brand:"REWE",price:0.79,unit:"500g",emoji:"🧀"},{name:"Magerquark",brand:"Milbona",price:0.69,unit:"500g",emoji:"🧀"},{name:"Bio Magerquark",brand:"REWE Bio",price:1.19,unit:"500g",emoji:"🧀"}],
  "garnelen":    [{name:"Garnelen TK",brand:"REWE",price:4.99,unit:"500g",emoji:"🦐"},{name:"Bio Garnelen",brand:"followfish",price:6.99,unit:"300g",emoji:"🦐"},{name:"Riesengarnelen",brand:"REWE",price:5.49,unit:"400g",emoji:"🦐"}],
  "rinderhack":  [{name:"Rinderhackfleisch",brand:"REWE",price:3.99,unit:"500g",emoji:"🥩"},{name:"Bio Rinderhack",brand:"REWE Bio",price:5.99,unit:"400g",emoji:"🥩"},{name:"Hackfleisch gemischt",brand:"REWE",price:2.99,unit:"500g",emoji:"🥩"}],
  "wraps":       [{name:"Vollkorn Wraps",brand:"REWE",price:1.49,unit:"6 Stk",emoji:"🌯"},{name:"Weizen Tortillas",brand:"Old El Paso",price:1.99,unit:"8 Stk",emoji:"🌯"},{name:"Bio Dinkel Wraps",brand:"Alnatura",price:2.29,unit:"6 Stk",emoji:"🌯"}],
  "tomaten":     [{name:"Cherrytomaten",brand:"REWE",price:1.29,unit:"250g",emoji:"🍅"},{name:"Bio Rispentomaten",brand:"REWE Bio",price:1.49,unit:"500g",emoji:"🍅"},{name:"Cherrytomaten Bio",brand:"REWE Bio",price:1.79,unit:"250g",emoji:"🍅"}],
  "milch":       [{name:"Vollmilch 3,5%",brand:"REWE",price:0.99,unit:"1L",emoji:"🥛"},{name:"Fettarme Milch",brand:"REWE",price:0.89,unit:"1L",emoji:"🥛"},{name:"Bio Vollmilch",brand:"REWE Bio",price:1.29,unit:"1L",emoji:"🥛"}],
  "olivenöl":    [{name:"Olivenöl extra vergine",brand:"REWE",price:3.99,unit:"750ml",emoji:"🫒"},{name:"Bio Olivenöl",brand:"Alnatura",price:5.49,unit:"500ml",emoji:"🫒"},{name:"Olivenöl",brand:"Bertolli",price:4.49,unit:"750ml",emoji:"🫒"}],
  "gurke":       [{name:"Salatgurke",brand:"REWE",price:0.69,unit:"Stück",emoji:"🥒"},{name:"Bio Salatgurke",brand:"REWE Bio",price:1.29,unit:"Stück",emoji:"🥒"},{name:"Mini Gurken",brand:"REWE",price:1.49,unit:"400g",emoji:"🥒"}],
  "paprika":     [{name:"Paprika rot",brand:"REWE",price:0.99,unit:"Stück",emoji:"🫑"},{name:"Bio Paprika 3-farbig",brand:"REWE Bio",price:2.49,unit:"3 Stk",emoji:"🫑"},{name:"Paprika Mix",brand:"REWE",price:1.99,unit:"500g",emoji:"🫑"}],
  "haferflocken":[{name:"Zarte Haferflocken",brand:"REWE",price:0.79,unit:"500g",emoji:"🌾"},{name:"Bio Haferflocken",brand:"Alnatura",price:1.49,unit:"500g",emoji:"🌾"},{name:"Kernige Haferflocken",brand:"Kölln",price:1.99,unit:"500g",emoji:"🌾"}],
  "default":     [{name:"Jetzt suchen",brand:"Alle Supermärkte",price:null,unit:"",emoji:"🛒"}],
};

function getPriceProducts(item) {
  const q = item.toLowerCase().replace(/\d+er|\d+g|\d+ml|\d+x/g,'').replace(/pack|packung|netz|bund|dose|glas|beutel/g,'').trim();
  for (const [key,products] of Object.entries(PRICE_DB)) {
    if (key==='default') continue;
    if (q.includes(key)) return products;
  }
  const words = q.split(/\s+/).filter(w=>w.length>3);
  for (const word of words) {
    for (const [key,products] of Object.entries(PRICE_DB)) {
      if (key==='default') continue;
      if (key.includes(word)||word.includes(key)) return products;
    }
  }
  if (q.includes('wrap')||q.includes('tortilla')) return PRICE_DB['wraps'];
  if (q.includes('tomate')||q.includes('cherry')) return PRICE_DB['tomaten'];
  if (q.includes('milch')||q.includes('milk')) return PRICE_DB['milch'];
  if (q.includes('nudel')||q.includes('penne')||q.includes('spaghetti')) return PRICE_DB['pasta'];
  if (q.includes('hähnchen')||q.includes('chicken')||q.includes('hühnchen')) return PRICE_DB['hähnchen'];
  if (q.includes('joghurt')||q.includes('quark')) return PRICE_DB['joghurt'];
  if (q.includes('fisch')||q.includes('thun')) return PRICE_DB['thunfisch'];
  if (q.includes('hack')||q.includes('rind')) return PRICE_DB['rinderhack'];
  return PRICE_DB.default;
}

// ── Fixed Recipes ─────────────────────────────────────────────────────
const FIXED = [
  { id:1, name:"High-Protein Omelette", emoji:"🍳", time:"10 Min", difficulty:"Einfach", tag:"Frühstück", macros:{cal:"420",prot:"38",carbs:"6",fat:"28"}, ingredients:["4 Eier","100g Hüttenkäse","50g Spinat","30g Fetakäse","1 Tomate"], shopping:["Eier 10er","Hüttenkäse 200g","Babyspinat","Fetakäse 200g","Tomaten"], steps:["Eier mit Hüttenkäse verquirlen.","Pfanne erhitzen, Masse rein.","2 Min stocken lassen.","Spinat, Tomate und Feta drauf.","Zuklappen, 2 Min garen."], tip:"Hüttenkäse verdoppelt den Proteingehalt fast ohne Kalorien." },
  { id:2, name:"Chicken Power Bowl", emoji:"🥣", time:"25 Min", difficulty:"Mittel", tag:"Mittagessen", macros:{cal:"580",prot:"52",carbs:"42",fat:"14"}, ingredients:["200g Hühnerbrust","80g Quinoa","½ Avocado","100g Cherrytomaten","50g Rucola"], shopping:["Hühnerbrust 500g","Quinoa 500g","Avocados","Cherrytomaten 250g","Rucola 100g"], steps:["Quinoa 15 Min kochen.","Hühnerbrust würzen und braten.","In Streifen schneiden.","Bowl zusammenstellen.","Mit Zitrone beträufeln."], tip:"Quinoa liefert alle essentiellen Aminosäuren." },
  { id:3, name:"Tuna Protein Wrap", emoji:"🌯", time:"8 Min", difficulty:"Einfach", tag:"Schnell", macros:{cal:"390",prot:"42",carbs:"28",fat:"10"}, ingredients:["1 Dose Thunfisch","2 Vollkorn-Wraps","3 EL Magerquark","½ Gurke","Dill"], shopping:["Thunfisch 3er-Pack","Vollkorn-Wraps 6er","Magerquark 500g","Gurke"], steps:["Thunfisch mit Quark mischen.","Gemüse schneiden.","Wrap anwärmen.","Füllen und aufrollen."], tip:"Thunfisch: über 25g Protein pro 100g bei minimalem Fett." },
  { id:4, name:"Grüner Protein-Shake", emoji:"🥤", time:"5 Min", difficulty:"Einfach", tag:"Post-Workout", macros:{cal:"310",prot:"29",carbs:"32",fat:"6"}, ingredients:["1 Scoop Whey Vanilla","150g Magerjoghurt","1 Banane","Spinat","200ml Mandelmilch"], shopping:["Whey Protein Vanille","Magerjoghurt 500g","Bananen","Babyspinat","Mandelmilch 1L"], steps:["Alle Zutaten in Mixer.","30 Sek mixen.","Sofort trinken."], tip:"Spinat liefert Eisen und Magnesium nach dem Training." },
];

const POOL = [
  { name:"Griechischer Lachs",emoji:"🐟",time:"20 Min",difficulty:"Mittel",tag:"Abendessen",kcal:480,protein:46,carbs:8,fat:22,ingredients:["200g Lachs","100g Quinoa","Feta","Gurke","Oliven"],shopping:["Lachsfilet 400g","Quinoa 500g","Fetakäse","Gurke","Oliven Glas"],steps:["Quinoa kochen.","Lachs würzen und braten.","Salat anrichten."],tip:"Omega-3 aus Lachs fördert Muskelregeneration."},
  { name:"Mexikanische Hack Bowl",emoji:"🌮",time:"22 Min",difficulty:"Einfach",tag:"Mittagessen",kcal:620,protein:48,carbs:45,fat:18,ingredients:["250g Rinderhack","80g Reis","Kidneybohnen","Paprika"],shopping:["Rinderhack 500g","Reis 1kg","Kidneybohnen Dose","Paprika"],steps:["Reis kochen.","Hack braten.","Würzen und servieren."],tip:"Kidneybohnen stabilisieren den Blutzucker."},
  { name:"Post-Workout Reisbrei",emoji:"🍚",time:"10 Min",difficulty:"Einfach",tag:"Post-Workout",kcal:520,protein:38,carbs:72,fat:8,ingredients:["80g Reis","400ml Milch","Schokoprotein","Banane"],shopping:["Rundkornreis 1kg","Milch 1L","Whey Schokolade","Bananen"],steps:["Reis in Milch kochen.","Protein einrühren.","Mit Banane servieren."],tip:"Optimale Carb-Protein-Ratio nach dem Training."},
  { name:"Skyr Protein Bowl",emoji:"🍓",time:"5 Min",difficulty:"Einfach",tag:"Frühstück",kcal:340,protein:34,carbs:38,fat:4,ingredients:["250g Skyr","Vanilleprotein","150g Beeren","Granola"],shopping:["Skyr 500g","Whey Vanille","Beeren TK","Granola"],steps:["Skyr mit Protein rühren.","Beeren drauf.","Granola bestreuen."],tip:"Skyr hat doppelt so viel Protein wie Joghurt."},
  { name:"Thai Garnelen Stir-Fry",emoji:"🍤",time:"15 Min",difficulty:"Mittel",tag:"Abendessen",kcal:390,protein:44,carbs:22,fat:12,ingredients:["200g Garnelen","Reisnudeln","Zucchini","Sojasoße"],shopping:["Garnelen TK 400g","Reisnudeln 500g","Zucchini","Sojasoße"],steps:["Nudeln zubereiten.","Gemüse stir-fry.","Garnelen dazu würzen."],tip:"Garnelen: 85 kcal / 20g Protein."},
  { name:"Spinat Hähnchen Pasta",emoji:"🍝",time:"20 Min",difficulty:"Einfach",tag:"Abendessen",kcal:590,protein:50,carbs:55,fat:12,ingredients:["200g Hühnerbrust","Vollkorn-Penne","100g Spinat","Parmesan"],shopping:["Hühnerbrust 500g","Vollkorn-Penne 500g","Babyspinat 200g","Parmesan"],steps:["Pasta kochen.","Hähnchen braten.","Spinat unterheben.","Mit Parmesan servieren."],tip:"Vollkorn-Pasta: 3x mehr Ballaststoffe."},
  { name:"Hähnchen Souvlaki",emoji:"🥙",time:"25 Min",difficulty:"Einfach",tag:"Mittagessen",kcal:510,protein:54,carbs:28,fat:14,ingredients:["250g Hühnerbrust","Pita","Tzatziki","Tomate"],shopping:["Hühnerbrust 500g","Vollkorn Pita 6er","Tzatziki 200g","Tomaten"],steps:["Hähnchen marinieren.","Grillen.","In Pita einwickeln."],tip:"Zitrusmarinade macht Fleisch zart."},
  { name:"Türkische Eier",emoji:"🍳",time:"12 Min",difficulty:"Einfach",tag:"Frühstück",kcal:380,protein:28,carbs:12,fat:24,ingredients:["3 Eier","200g Joghurt","Knoblauch","Paprikabutter"],shopping:["Eier 10er","Magerjoghurt 500g","Knoblauch","Paprikapulver"],steps:["Joghurt mit Knoblauch.","Eier pochieren.","Paprikabutter drüber."],tip:"Eier + Joghurt = optimale Proteinsynthese."},
];

// ── CSS ───────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#050505;color:#f0f0f0;font-family:'Inter',sans-serif;min-height:100vh}
.app{max-width:480px;margin:0 auto;padding-bottom:100px}
.hdr{padding:28px 20px 0;display:flex;align-items:center;gap:12px}
.hdr-icon{width:44px;height:44px;background:linear-gradient(135deg,#00ff87,#00cc6a);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 20px #00ff8740}
.hdr-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;background:linear-gradient(135deg,#fff 40%,#00ff87);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hdr-sub{font-size:11px;color:#333;margin-top:2px}

/* TABS */
.tabs{display:flex;margin:20px 16px 0;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:4px;gap:4px}
.tab{flex:1;padding:10px 2px;border:none;background:transparent;color:#444;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;border-radius:12px;cursor:pointer;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:4px}
.tab.on{background:linear-gradient(135deg,#00ff87,#00cc6a);color:#000;box-shadow:0 4px 16px #00ff8750}
.tab-badge{background:#ff4444;color:#fff;border-radius:10px;font-size:9px;font-weight:800;padding:1px 5px;min-width:16px;text-align:center}

/* SECTIONS */
.sec{padding:0 16px;margin-top:20px}
.slabel{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#333;font-weight:700;margin-bottom:12px}

/* UPLOAD */
.upload-box{border:2px dashed #1e1e1e;border-radius:24px;padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;transition:all .3s;background:#0d0d0d;position:relative;overflow:hidden}
.upload-box:hover,.upload-box.drag{border-color:#00ff87;box-shadow:0 0 40px #00ff8715}
.upload-box.filled{padding:0;border-style:solid;border-color:#00ff87}
.upload-img{width:100%;border-radius:22px;display:block;max-height:260px;object-fit:cover}
.upload-badge{position:absolute;bottom:14px;right:14px;background:rgba(0,0,0,.85);backdrop-filter:blur(10px);padding:6px 14px;border-radius:20px;font-size:11px;color:#00ff87;font-weight:700;border:1px solid #00ff8740}
.upload-icon{font-size:44px;opacity:.15}
.upload-lbl{font-size:15px;font-weight:600;color:#666}
.upload-sub{font-size:12px;color:#222;text-align:center}
.cam-btn{width:100%;margin-top:10px;background:transparent;border:1px solid #1a1a1a;border-radius:14px;padding:13px;color:#444;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.cam-btn:hover{border-color:#333;color:#777}
.go-btn{width:100%;margin-top:14px;background:linear-gradient(135deg,#00ff87,#00cc6a);color:#000;border:none;border-radius:18px;padding:18px;font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;box-shadow:0 8px 32px #00ff8740}
.go-btn:hover:not([disabled]){transform:translateY(-2px);box-shadow:0 12px 40px #00ff8760}
.go-btn[disabled]{opacity:.25;cursor:not-allowed;box-shadow:none}
.reset-btn{width:100%;margin-top:8px;background:transparent;border:1px solid #1a1a1a;border-radius:14px;padding:12px;color:#333;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer}

/* LOADING */
.loading{margin-top:20px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:24px;padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:14px}
.spinner{width:44px;height:44px;border:3px solid #1a1a1a;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite}
.spinner-sm{width:16px;height:16px;border:2px solid #1a1a1a;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-txt{font-size:14px;color:#444;text-align:center;line-height:1.7}
.loading-txt strong{color:#00ff87;display:block;font-size:15px;margin-bottom:4px}
.err{margin-top:14px;background:#120808;border:1px solid #2a1010;border-radius:14px;padding:14px;color:#ff6b6b;font-size:13px;line-height:1.5}

/* RECIPE CARD */
.rcard{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:24px;overflow:hidden;margin-top:18px;animation:fadeUp .4s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.hero{position:relative;height:190px;overflow:hidden}
.hero img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}
.hero:hover img{transform:scale(1.05)}
.hero-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.9),transparent 60%)}
.hero-ct{position:absolute;bottom:0;left:0;right:0;padding:14px 18px}
.rtag{display:inline-flex;align-items:center;gap:5px;background:rgba(0,255,135,.15);border:1px solid #00ff8440;border-radius:20px;padding:3px 10px;font-size:10px;color:#00ff87;font-weight:700;letter-spacing:.5px;margin-bottom:6px;backdrop-filter:blur(8px)}
.rname{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:1px;line-height:1;color:#fff}
.rmeta{display:flex;gap:12px;margin-top:5px}
.rmeta span{font-size:11px;color:rgba(255,255,255,.5)}
.mgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#1a1a1a}
.mcell{background:#0a0a0a;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:3px}
.mval{font-family:'Bebas Neue',sans-serif;font-size:26px;background:linear-gradient(135deg,#00ff87,#00cc6a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mlbl{font-size:9px;color:#333;letter-spacing:2px;text-transform:uppercase;font-weight:600}
.rbody{padding:18px}
.lbl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#333;font-weight:700;margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.chip{background:#0a1a0f;border:1px solid #00ff8730;border-radius:20px;padding:5px 11px;font-size:12px;color:#00ff87}
.srow{display:flex;gap:12px;margin-bottom:14px;align-items:flex-start}
.snum{width:26px;height:26px;background:#0a1a0f;border:1px solid #00ff8330;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#00ff87;flex-shrink:0;margin-top:1px}
.stxt{font-size:13px;color:#777;line-height:1.6}
.tipbox{background:#0a1a0f;border:1px solid #00ff8225;border-radius:12px;padding:12px 14px;display:flex;gap:10px;margin-top:4px}
.tipbox p{font-size:12px;color:#7aff9e;line-height:1.5}

/* ADD TO TRACKER BUTTON */
.add-tracker-btn{width:100%;margin-top:10px;background:transparent;border:1px solid #00ff8440;border-radius:14px;padding:13px;color:#00ff87;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.add-tracker-btn:hover{background:#0a1a0f;border-color:#00ff8760}

/* SHOPPING CARD */
.shcard{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;padding:16px;margin-top:12px;animation:fadeUp .4s ease .1s both}
.shhdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.shlbl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#00ff87;font-weight:700}
.shprog{height:3px;background:#1a1a1a;border-radius:2px;margin-bottom:12px;overflow:hidden}
.shbar{height:100%;background:linear-gradient(90deg,#00ff87,#00cc6a);border-radius:2px;transition:width .3s}
.shitem{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #111}
.shitem:last-child{border-bottom:none}
.shcheck{width:19px;height:19px;border:1.5px solid #2a2a2a;border-radius:5px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .2s;color:#000;font-weight:800;cursor:pointer}
.shcheck.on{background:linear-gradient(135deg,#00ff87,#00cc6a);border-color:#00ff87}
.shname{font-size:13px;color:#777;flex:1;cursor:pointer}
.shname.done{text-decoration:line-through;color:#2a2a2a}
.shop-btn{background:#111;border:1px solid #1e1e1e;border-radius:8px;cursor:pointer;padding:4px 8px;color:#888;font-size:10px;font-weight:700;font-family:'Inter',sans-serif;transition:all .2s;flex-shrink:0}
.shop-btn:hover{background:#1a1a1a;color:#00ff87;border-color:#00ff8440}
.cart-btn-main{width:100%;margin-top:12px;background:linear-gradient(135deg,#1a73e8,#1557b0);border:none;border-radius:14px;padding:14px;color:#fff;font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 4px 16px rgba(26,115,232,.3)}
.cart-btn-main:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(26,115,232,.5)}

/* PRICE SHEET */
.sheet{position:fixed;inset:0;z-index:999;display:flex;flex-direction:column;justify-content:flex-end}
.sheet-bg{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px)}
.sheet-box{position:relative;background:#0d0d0d;border-radius:24px 24px 0 0;border:1px solid #1a1a1a;border-bottom:none;padding:22px 18px 36px;max-height:80vh;overflow-y:auto;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.sheet-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.sheet-title{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff;letter-spacing:1px}
.sheet-close{background:transparent;border:1px solid #2a2a2a;border-radius:8px;color:#666;font-size:14px;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center}
.sheet-sub{font-size:11px;color:#444;margin-bottom:14px}
.price-item{display:flex;align-items:center;gap:10px;padding:11px;background:#111;border:1px solid #1a1a1a;border-radius:12px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.price-item:hover{border-color:#00ff8440}
.price-item.selected{border-color:#00ff87;background:#0a1a0f}
.price-emoji{font-size:28px;flex-shrink:0}
.price-info{flex:1}
.price-name{font-size:13px;color:#ddd;font-weight:500;line-height:1.3}
.price-brand{font-size:11px;color:#444;margin-top:2px}
.price-val{font-family:'Bebas Neue',sans-serif;font-size:24px;color:#00ff87;letter-spacing:.5px;flex-shrink:0}
.price-unit{font-size:10px;color:#333;text-align:right;margin-top:1px}
.add-cart-btn{width:100%;margin-top:4px;background:linear-gradient(135deg,#00ff87,#00cc6a);border:none;border-radius:14px;padding:14px;color:#000;font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.add-cart-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px #00ff8740}
.google-btn{width:100%;margin-top:8px;background:transparent;border:1px solid #1e1e1e;border-radius:14px;padding:12px;color:#666;font-family:'Inter',sans-serif;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
.google-btn:hover{border-color:#4285f440;color:#4285f4}

/* CART TAB */
.cart-empty{text-align:center;padding:48px 20px;color:#333}
.cart-empty-icon{font-size:48px;opacity:.3;margin-bottom:12px}
.cart-empty-txt{font-size:14px;color:#444}
.cart-item{display:flex;align-items:center;gap:12px;padding:12px;background:#111;border:1px solid #1a1a1a;border-radius:14px;margin-bottom:8px}
.cart-item-emoji{font-size:26px;flex-shrink:0}
.cart-item-info{flex:1}
.cart-item-name{font-size:13px;color:#ddd;font-weight:500}
.cart-item-brand{font-size:11px;color:#444;margin-top:1px}
.cart-item-price{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#00ff87}
.cart-remove{background:transparent;border:1px solid #2a2a2a;border-radius:8px;color:#444;font-size:14px;cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
.cart-remove:hover{border-color:#ff444440;color:#ff4444}
.cart-total{background:#0a1a0f;border:1px solid #00ff8330;border-radius:16px;padding:16px;margin-top:4px;display:flex;align-items:center;justify-content:space-between}
.cart-total-lbl{font-size:12px;color:#00ff87;font-weight:600;letter-spacing:1px;text-transform:uppercase}
.cart-total-val{font-family:'Bebas Neue',sans-serif;font-size:32px;color:#00ff87}
.cart-order-btn{width:100%;margin-top:10px;background:linear-gradient(135deg,#1a73e8,#1557b0);border:none;border-radius:16px;padding:16px;color:#fff;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;cursor:pointer;box-shadow:0 4px 16px rgba(26,115,232,.3);transition:all .2s}
.cart-order-btn:hover{transform:translateY(-1px)}
.cart-clear-btn{width:100%;margin-top:8px;background:transparent;border:1px solid #2a2a2a;border-radius:14px;padding:12px;color:#444;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
.cart-clear-btn:hover{border-color:#ff444440;color:#ff4444}

/* SAMPLE GRID */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.tile{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:18px;cursor:pointer;transition:all .25s;overflow:hidden}
.tile:hover,.tile.on{border-color:#00ff87;box-shadow:0 4px 24px #00ff8720;transform:translateY(-2px)}
.tile.on{background:#0a1a0f}
.tile img{width:100%;height:100px;object-fit:cover;display:block;transition:transform .4s}
.tile:hover img,.tile.on img{transform:scale(1.07)}
.tilebody{padding:11px}
.tilename{font-family:'Bebas Neue',sans-serif;font-size:15px;color:#fff;line-height:1.1;margin-bottom:2px}
.tilemeta{font-size:10px;color:#444}
.tiletag{display:inline-block;background:#0f1f14;border:1px solid #00ff8220;border-radius:6px;padding:2px 7px;font-size:9px;color:#00ff87;font-weight:700;margin-top:6px}
.aigenbtn{width:100%;margin-top:14px;background:transparent;border:1px solid #1e1e1e;border-radius:14px;padding:14px;color:#00ff87;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .25s}
.aigenbtn:hover:not([disabled]){border-color:#00ff8660;background:#0a1a0f}
.aigenbtn[disabled]{opacity:.3;cursor:not-allowed}
.ailist{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.airow{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;cursor:pointer;transition:all .25s;overflow:hidden}
.airow:hover,.airow.on{border-color:#00ff87;box-shadow:0 4px 20px #00ff8720;transform:translateY(-1px)}
.airow.on{background:#0a1a0f}
.aiinner{display:flex;align-items:center}
.aiimg{width:72px;height:72px;object-fit:cover;flex-shrink:0}
.aiinfo{flex:1;padding:11px 12px}
.ainame{font-family:'Bebas Neue',sans-serif;font-size:18px;color:#fff;line-height:1}
.aisub{font-size:10px;color:#444;margin-top:2px}
.aiprot{font-size:11px;color:#00ff87;font-weight:600;margin-top:4px}
.chev{color:#2a2a2a;font-size:11px;padding-right:12px;transition:transform .25s}
.airow.on .chev{transform:rotate(180deg);color:#00ff87}

/* TRACKER TAB */
.tracker-header{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;padding:18px;margin-bottom:14px}
.tracker-days{display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px}
.tracker-day{flex-shrink:0;width:44px;padding:8px 4px;border-radius:12px;border:1px solid #1a1a1a;background:transparent;cursor:pointer;text-align:center;transition:all .2s}
.tracker-day.today{border-color:#00ff87;background:#0a1a0f}
.tracker-day.has-data{border-color:#00ff8840}
.tracker-day-name{font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.5px}
.tracker-day-num{font-family:'Bebas Neue',sans-serif;font-size:18px;color:#fff;line-height:1.2}
.tracker-day.today .tracker-day-name,.tracker-day.today .tracker-day-num{color:#00ff87}
.tracker-day-dot{width:4px;height:4px;border-radius:50%;background:#00ff87;margin:3px auto 0;opacity:0}
.tracker-day.has-data .tracker-day-dot{opacity:1}
.goal-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.goal-lbl{font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase}
.goal-edit{display:flex;align-items:center;gap:8px}
.goal-input{background:#111;border:1px solid #1e1e1e;border-radius:8px;color:#fff;font-family:'Bebas Neue',sans-serif;font-size:18px;width:80px;padding:4px 8px;text-align:center}
.goal-input:focus{outline:none;border-color:#00ff87}
.goal-unit{font-size:11px;color:#444}
.macro-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}
.macro-s-cell{background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:10px 6px;text-align:center}
.macro-s-val{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#00ff87}
.macro-s-lbl{font-size:9px;color:#333;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px}
.cal-ring-wrap{display:flex;align-items:center;justify-content:center;margin:4px 0}
.cal-bar-wrap{background:#111;border-radius:8px;height:10px;overflow:hidden;margin:8px 0 4px}
.cal-bar{height:100%;background:linear-gradient(90deg,#00ff87,#00cc6a);border-radius:8px;transition:width .5s ease}
.cal-bar.over{background:linear-gradient(90deg,#ff6b6b,#ff4444)}
.cal-labels{display:flex;justify-content:space-between;font-size:11px;color:#444}
.cal-labels strong{color:#00ff87}
.meal-log{margin-top:14px}
.meal-item{display:flex;align-items:center;gap:10px;padding:10px;background:#111;border:1px solid #1a1a1a;border-radius:12px;margin-bottom:6px;animation:fadeUp .3s ease}
.meal-emoji{font-size:22px;flex-shrink:0}
.meal-info{flex:1}
.meal-name{font-size:13px;color:#ddd;font-weight:500}
.meal-macros{font-size:11px;color:#444;margin-top:1px}
.meal-cal{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#00ff87;flex-shrink:0}
.meal-del{background:transparent;border:none;color:#333;font-size:14px;cursor:pointer;padding:4px;flex-shrink:0;transition:color .2s}
.meal-del:hover{color:#ff4444}
.add-meal-btn{width:100%;margin-top:8px;background:transparent;border:2px dashed #1e1e1e;border-radius:14px;padding:14px;color:#444;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
.add-meal-btn:hover{border-color:#00ff8440;color:#00ff87}
.week-view{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:14px;margin-top:14px}
.week-title{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#333;font-weight:700;margin-bottom:12px}
.week-bars{display:flex;align-items:flex-end;gap:6px;height:60px}
.week-bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.week-bar-bg{width:100%;background:#1a1a1a;border-radius:4px 4px 0 0;flex:1;position:relative;overflow:hidden}
.week-bar-fill{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,#00ff87,#00cc6a);border-radius:4px 4px 0 0;transition:height .5s ease}
.week-bar-fill.over{background:linear-gradient(to top,#ff6b6b,#ff4444)}
.week-bar-day{font-size:9px;color:#444;text-transform:uppercase;letter-spacing:.5px}
.week-bar-wrap.today .week-bar-day{color:#00ff87}
`;

// ── API ───────────────────────────────────────────────────────────────
async function callAPI(body) {
  const res = await fetch('/api/claude', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'API error');
  return data.content?.[0]?.text || '';
}
function parseMacros(t) {
  const n = rx => t.match(rx)?.[1] ?? '—';
  return { cal:n(/(\d+)\s*kcal/i), prot:n(/Protein[:\s]+(\d+)/i)!=='—'?n(/Protein[:\s]+(\d+)/i):n(/(\d+)\s*g\s*Protein/i), carbs:n(/Kohlenhydrate[:\s]+(\d+)/i)!=='—'?n(/Kohlenhydrate[:\s]+(\d+)/i):n(/(\d+)\s*g\s*Carbs/i), fat:n(/Fett[:\s]+(\d+)/i)!=='—'?n(/Fett[:\s]+(\d+)/i):n(/(\d+)\s*g\s*Fett/i) };
}
function parseRecipe(raw) {
  const lines=raw.split('\n').map(l=>l.trim()).filter(Boolean);
  let name='',ing=[],steps=[],tip='',shopping=[],fridge=[],time='~20 Min',diff='Einfach',mode=null;
  for(const l of lines){
    const lo=l.toLowerCase();
    if(/^#+/.test(l)){const cl=l.replace(/^#+\s*/,'');if(!name&&cl.length<70&&!lo.includes('zutat')&&!lo.includes('zubereitung')&&!lo.includes('einkauf')&&!lo.includes('tipp')&&!lo.includes('erkannt')){name=cl;continue;}}
    if(lo.includes('erkannte zutaten')||lo.includes('im kühlschrank')){mode='fridge';continue;}
    if(lo.includes('einkauf')){mode='shop';continue;}
    if(lo.includes('zutaten für')||lo.includes('zutaten (für')){mode='ing';continue;}
    if(lo.includes('zubereitung')||lo.includes('schritt')){mode='steps';continue;}
    if(lo.includes('tipp')){mode='tip';continue;}
    if(lo.match(/zeit[:\s]/)){time=l.replace(/.*?:/,'').trim();continue;}
    if(lo.match(/schwierig/)){diff=l.replace(/.*?:/,'').trim();continue;}
    if(!name&&l.length<70&&!/^[-*•\d]/.test(l)){name=l;continue;}
    const cl=l.replace(/^[-*•]\s*/,'').replace(/^\d+[.)]\s*/,'');
    if(mode==='fridge')fridge.push(cl);
    else if(mode==='ing')ing.push(cl);
    else if(mode==='shop')shopping.push(cl);
    else if(mode==='steps')steps.push(cl);
    else if(mode==='tip')tip+=' '+cl;
  }
  // fallback: use fridge list as ingredients if ing is empty
  if(ing.length===0&&fridge.length>0) ing=fridge;
  return{name:name||'Fitness Rezept',ingredients:ing,fridge,steps,tip:tip.trim(),shopping,time,difficulty:diff,macros:parseMacros(raw)};
}

// ── PriceSheet ────────────────────────────────────────────────────────
function PriceSheet({ item, onClose, onAddToCart }) {
  const [selected, setSelected] = useState(null);
  const query = item.replace(/\d+er|\d+g|\d+ml|\d+x/g,'').replace(/\d+\s/g,'').trim();
  const products = getPriceProducts(item);
  const openGoogle = () => window.open('https://www.google.com/search?q=' + encodeURIComponent(query + ' kaufen Supermarkt') + '&tbm=shop', '_blank');
  return (
    <div className="sheet">
      <div className="sheet-bg" onClick={onClose} />
      <div className="sheet-box">
        <div className="sheet-hdr">
          <div className="sheet-title">🛒 {query}</div>
          <button className="sheet-close" onClick={onClose}>✕</button>
        </div>
        <div className="sheet-sub">Preisvergleich · Produkt auswählen & in Warenkorb legen</div>
        {products.map((p,i) => (
          <div key={i} className={`price-item${selected===i?' selected':''}`} onClick={() => setSelected(selected===i?null:i)}>
            <div className="price-emoji">{p.emoji}</div>
            <div className="price-info">
              <div className="price-name">{p.name}</div>
              <div className="price-brand">{p.brand}{p.unit?' · '+p.unit:''}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="price-val">{p.price ? p.price.toFixed(2)+'€' : '–'}</div>
              <div className="price-unit">{selected===i ? '✓ gewählt' : 'auswählen'}</div>
            </div>
          </div>
        ))}
        {selected !== null && products[selected].price && (
          <button className="add-cart-btn" onClick={() => { onAddToCart(products[selected]); onClose(); }}>
            + IN WARENKORB · {products[selected].price.toFixed(2)}€
          </button>
        )}
        <button className="google-btn" onClick={openGoogle}>
          🔍 Alle Preise bei Google Shopping vergleichen
        </button>
      </div>
    </div>
  );
}

// ── RecipeView ────────────────────────────────────────────────────────
function RecipeView({ r, onAddToTracker, cart, setCart }) {
  const [checked, setChecked] = useState({});
  const [sheetItem, setSheetItem] = useState(null);
  const list = r.shopping?.length ? r.shopping : r.ingredients;
  const toggle = i => setChecked(p => ({ ...p, [i]: !p[i] }));
  const done = Object.values(checked).filter(Boolean).length;
  const addToCart = (product) => setCart(prev => [...prev, { ...product, id: Date.now() }]);
  return (
    <>
      <div className="rcard">
        <div className="hero">
          <FoodImg name={r.name} tag={r.tag||''} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
          <div className="hero-ov" />
          <div className="hero-ct">
            <div className="rtag">💪 {r.tag||'Fitness Rezept'}</div>
            <div className="rname">{r.emoji||''} {r.name}</div>
            <div className="rmeta"><span>⏱ {r.time}</span><span>📊 {r.difficulty}</span></div>
          </div>
        </div>
        <div className="mgrid">
          {[['cal','Kalorien'],['prot','Protein'],['carbs','Carbs'],['fat','Fett']].map(([k,l]) => (
            <div className="mcell" key={k}>
              <div className="mval">{r.macros[k]}{k!=='cal'&&r.macros[k]!=='—'?'g':''}</div>
              <div className="mlbl">{l}</div>
            </div>
          ))}
        </div>
        <div className="rbody">
          {r.ingredients.length>0&&<>
            <div className="lbl">Zutaten</div>
            <div className="chips">
              {r.ingredients.map((x,i)=>{
                const missing = x.includes('⚠️');
                const clean = x.replace('✅','').replace('⚠️','').trim();
                return <span className="chip" key={i} style={missing?{borderColor:'#ff944040',color:'#ff9440',background:'#1a0f00'}:{borderColor:'#00ff8730',color:'#00ff87',background:'#0a1a0f'}}>{missing?'⚠️ ':'✅ '}{clean}</span>;
              })}
            </div>
          </>}
          {r.steps.length>0&&<><div className="lbl">Zubereitung</div>{r.steps.map((s,i)=><div className="srow" key={i}><div className="snum">{i+1}</div><div className="stxt">{s}</div></div>)}</>}
          {r.tip&&<div className="tipbox"><span style={{fontSize:16}}>💪</span><p>{r.tip}</p></div>}
        </div>
      </div>
      {/* FRIDGE DETECTED */}
      {r.fridge && r.fridge.length > 0 && (
        <div style={{margin:'0 0 0 0',padding:'12px 18px',background:'#0a1a0f',borderTop:'1px solid #00ff8820'}}>
          <div style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'#00ff87',fontWeight:700,marginBottom:8}}>✅ Im Kühlschrank erkannt</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {r.fridge.map((x,i)=><span key={i} style={{background:'#111',border:'1px solid #00ff8330',borderRadius:20,padding:'4px 10px',fontSize:11,color:'#7aff9e'}}>{x.replace('✅','').trim()}</span>)}
          </div>
        </div>
      )}
      {/* ADD TO TRACKER */}
      {onAddToTracker && r.macros.cal !== '—' && (
        <button className="add-tracker-btn" onClick={() => onAddToTracker(r)}>
          📊 Zum Kalorien-Tracker hinzufügen · {r.macros.cal} kcal
        </button>
      )}
      {/* SHOPPING LIST */}
      {list.length>0 && (
        <div className="shcard">
          <div className="shhdr">
            <div className="shlbl">🛒 Einkaufsliste</div>
            <span style={{fontSize:11,color:'#333'}}>{done}/{list.length}</span>
          </div>
          <div className="shprog"><div className="shbar" style={{width:`${list.length?done/list.length*100:0}%`}} /></div>
          {list.map((item,i) => (
            <div className="shitem" key={i}>
              <div className={`shcheck${checked[i]?' on':''}`} onClick={() => toggle(i)}>{checked[i]?'✓':''}</div>
              <div className={`shname${checked[i]?' done':''}`} onClick={() => toggle(i)}>{item}</div>
              <button className="shop-btn" onClick={() => setSheetItem(item)}>Preis</button>
            </div>
          ))}
          <button className="cart-btn-main" onClick={() => setSheetItem(list[0])}>
            🔍 Preise vergleichen · alle Shops
          </button>
        </div>
      )}
      {sheetItem && <PriceSheet item={sheetItem} onClose={() => setSheetItem(null)} onAddToCart={addToCart} />}
    </>
  );
}

// ── CartTab ───────────────────────────────────────────────────────────
function CartTab({ cart, setCart }) {
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const openGoogle = () => {
    const q = cart.map(i => i.name).join(' ');
    window.open('https://www.google.com/search?q=' + encodeURIComponent(q + ' kaufen') + '&tbm=shop', '_blank');
  };
  if (cart.length === 0) return (
    <div className="sec">
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <div className="cart-empty-txt">Dein Warenkorb ist leer.<br/>Füge Produkte aus Rezepten hinzu.</div>
      </div>
    </div>
  );
  return (
    <div className="sec">
      <div className="slabel">Warenkorb · {cart.length} Produkte</div>
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-emoji">{item.emoji}</div>
          <div className="cart-item-info">
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-brand">{item.brand} · {item.unit}</div>
          </div>
          <div className="cart-item-price">{item.price?.toFixed(2)}€</div>
          <button className="cart-remove" onClick={() => removeItem(item.id)}>✕</button>
        </div>
      ))}
      <div className="cart-total">
        <div className="cart-total-lbl">Gesamt ca.</div>
        <div className="cart-total-val">{total.toFixed(2)} €</div>
      </div>
      <button className="cart-order-btn" onClick={openGoogle}>
        🔍 ALLE PREISE VERGLEICHEN
      </button>
      <button className="cart-clear-btn" onClick={() => setCart([])}>Warenkorb leeren</button>
    </div>
  );
}

// ── FoodSearch ───────────────────────────────────────────────────────
const FOOD_DB = [
  {name:"Hühnerbrust (100g)",cal:110,prot:23,carbs:0,fat:2,emoji:"🍗"},
  {name:"Ei (1 Stück)",cal:78,prot:6,carbs:0,fat:5,emoji:"🥚"},
  {name:"Haferflocken (100g)",cal:370,prot:13,carbs:60,fat:7,emoji:"🌾"},
  {name:"Banane (1 mittel)",cal:89,prot:1,carbs:23,fat:0,emoji:"🍌"},
  {name:"Lachs (100g)",cal:208,prot:20,carbs:0,fat:13,emoji:"🐟"},
  {name:"Thunfisch Dose (185g)",cal:130,prot:29,carbs:0,fat:1,emoji:"🐟"},
  {name:"Magerquark (100g)",cal:61,prot:12,carbs:4,fat:0,emoji:"🧀"},
  {name:"Skyr (100g)",cal:63,prot:11,carbs:4,fat:0,emoji:"🥛"},
  {name:"Griechischer Joghurt (100g)",cal:97,prot:9,carbs:4,fat:5,emoji:"🥛"},
  {name:"Magerjoghurt (100g)",cal:49,prot:5,carbs:6,fat:0,emoji:"🥛"},
  {name:"Vollmilch (200ml)",cal:130,prot:7,carbs:10,fat:8,emoji:"🥛"},
  {name:"Mandelmilch (200ml)",cal:28,prot:1,carbs:2,fat:2,emoji:"🥛"},
  {name:"Whey Protein (1 Scoop 30g)",cal:120,prot:24,carbs:3,fat:2,emoji:"💪"},
  {name:"Reis gekocht (100g)",cal:130,prot:3,carbs:28,fat:0,emoji:"🍚"},
  {name:"Quinoa gekocht (100g)",cal:120,prot:4,carbs:21,fat:2,emoji:"🌾"},
  {name:"Vollkorn-Pasta gekocht (100g)",cal:140,prot:5,carbs:27,fat:1,emoji:"🍝"},
  {name:"Süßkartoffel (100g)",cal:86,prot:2,carbs:20,fat:0,emoji:"🍠"},
  {name:"Avocado (½ Stück)",cal:120,prot:2,carbs:6,fat:11,emoji:"🥑"},
  {name:"Spinat roh (100g)",cal:23,prot:3,carbs:4,fat:0,emoji:"🥬"},
  {name:"Brokkoli (100g)",cal:34,prot:3,carbs:7,fat:0,emoji:"🥦"},
  {name:"Tomate (1 mittel)",cal:22,prot:1,carbs:5,fat:0,emoji:"🍅"},
  {name:"Gurke (100g)",cal:12,prot:1,carbs:2,fat:0,emoji:"🥒"},
  {name:"Paprika rot (100g)",cal:31,prot:1,carbs:6,fat:0,emoji:"🫑"},
  {name:"Erdnussbutter (1 EL 16g)",cal:94,prot:4,carbs:3,fat:8,emoji:"🥜"},
  {name:"Olivenöl (1 EL 14g)",cal:119,prot:0,carbs:0,fat:14,emoji:"🫒"},
  {name:"Rinderhack (100g)",cal:215,prot:17,carbs:0,fat:16,emoji:"🥩"},
  {name:"Garnelen (100g)",cal:85,prot:20,carbs:0,fat:1,emoji:"🦐"},
  {name:"Hüttenkäse (100g)",cal:98,prot:11,carbs:3,fat:4,emoji:"🧀"},
  {name:"Fetakäse (100g)",cal:264,prot:14,carbs:4,fat:21,emoji:"🧀"},
  {name:"Mozzarella (100g)",cal:280,prot:18,carbs:2,fat:22,emoji:"🧀"},
  {name:"Vollkornbrot (1 Scheibe 50g)",cal:105,prot:4,carbs:19,fat:1,emoji:"🍞"},
  {name:"Apfel (1 mittel)",cal:80,prot:0,carbs:21,fat:0,emoji:"🍎"},
  {name:"Blaubeeren (100g)",cal:57,prot:1,carbs:14,fat:0,emoji:"🫐"},
  {name:"Mandeln (30g)",cal:174,prot:6,carbs:5,fat:15,emoji:"🥜"},
  {name:"Kidneybohnen (100g)",cal:127,prot:9,carbs:23,fat:0,emoji:"🫘"},
  {name:"Linsen gekocht (100g)",cal:116,prot:9,carbs:20,fat:0,emoji:"🫘"},
  {name:"Tofu (100g)",cal:76,prot:8,carbs:2,fat:5,emoji:"🟨"},
  {name:"Pizza Margherita (1 Stück)",cal:230,prot:9,carbs:30,fat:8,emoji:"🍕"},
  {name:"Burger (1 Standard)",cal:500,prot:25,carbs:40,fat:25,emoji:"🍔"},
  {name:"Döner (1 Portion)",cal:550,prot:30,carbs:50,fat:20,emoji:"🌯"},
  {name:"Schnitzel (150g)",cal:380,prot:28,carbs:12,fat:24,emoji:"🥩"},
  {name:"Pasta Bolognese (1 Portion)",cal:520,prot:24,carbs:60,fat:16,emoji:"🍝"},
  {name:"Cappuccino (1 Tasse)",cal:80,prot:4,carbs:8,fat:3,emoji:"☕"},
  {name:"Protein Riegel",cal:200,prot:20,carbs:22,fat:6,emoji:"🍫"},
  {name:"Bananen Smoothie (300ml)",cal:180,prot:4,carbs:38,fat:1,emoji:"🥤"},
];

function FoodSearch({ onAdd, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [portion, setPortion] = useState(100);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setAiResult(null); return; }
    const q = query.toLowerCase();
    const filtered = FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 6);
    setResults(filtered);
  }, [query]);

  const searchAI = async () => {
    if (!query.trim()) return;
    setAiLoading(true); setAiResult(null);
    try {
      const text = await callAPI({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: 'Nährwerte für: "' + query + '" (pro 100g oder typische Portion). Antworte NUR mit JSON: {"name":"Name","emoji":"🍽","cal":200,"prot":10,"carbs":25,"fat":5,"portion":"100g"}. Kein anderer Text.'
        }]
      });
      const a = text.indexOf('{'), b = text.lastIndexOf('}');
      if (a !== -1 && b !== -1) {
        const parsed = JSON.parse(text.slice(a, b+1));
        setAiResult(parsed);
      }
    } catch(e) {}
    finally { setAiLoading(false); }
  };

  const scale = (val) => Math.round(val * portion / 100);

  return (
    <div style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:16,padding:16,marginBottom:10,animation:'fadeUp .3s ease'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:13,color:'#fff',fontWeight:600}}>🔍 Was hast du gegessen?</div>
        <button onClick={onClose} style={{background:'transparent',border:'1px solid #2a2a2a',borderRadius:8,color:'#555',cursor:'pointer',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>✕</button>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&searchAI()}
          placeholder="z.B. Hühnerbrust, Pizza, Döner..."
          autoFocus
          style={{flex:1,background:'#1a1a1a',border:'1px solid #222',borderRadius:10,color:'#fff',padding:'10px 12px',fontFamily:'Inter',fontSize:13,outline:'none'}}
        />
        <button onClick={searchAI} disabled={aiLoading} style={{background:'linear-gradient(135deg,#00ff87,#00cc6a)',border:'none',borderRadius:10,padding:'10px 14px',color:'#000',fontFamily:'Inter',fontSize:12,fontWeight:700,cursor:'pointer',flexShrink:0,opacity:aiLoading?.5:1}}>
          {aiLoading?'…':'KI'}
        </button>
      </div>

      {/* Portion selector */}
      {(results.length > 0 || aiResult) && (
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,padding:'8px 10px',background:'#1a1a1a',borderRadius:10}}>
          <span style={{fontSize:11,color:'#555'}}>Portion:</span>
          {[50,100,150,200,300].map(p=>(
            <button key={p} onClick={()=>setPortion(p)} style={{background:portion===p?'#00ff87':'transparent',border:'1px solid '+(portion===p?'#00ff87':'#2a2a2a'),borderRadius:6,color:portion===p?'#000':'#555',padding:'3px 8px',fontSize:11,cursor:'pointer',fontWeight:600,transition:'all .15s'}}>
              {p}g
            </button>
          ))}
          <input type="number" value={portion} onChange={e=>setPortion(Number(e.target.value))} style={{width:52,background:'transparent',border:'1px solid #2a2a2a',borderRadius:6,color:'#fff',padding:'3px 6px',fontSize:11,textAlign:'center'}} />
        </div>
      )}

      {/* DB Results */}
      {results.map((f,i) => (
        <div key={i} onClick={()=>onAdd({...f,cal:scale(f.cal),prot:scale(f.prot),carbs:scale(f.carbs),fat:scale(f.fat),name:f.name+(portion!==100?' ('+portion+'g)':'')})}
          style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#161616',border:'1px solid #1e1e1e',borderRadius:12,marginBottom:6,cursor:'pointer',transition:'all .2s'}}
          onMouseOver={e=>e.currentTarget.style.borderColor='#00ff8740'}
          onMouseOut={e=>e.currentTarget.style.borderColor='#1e1e1e'}>
          <span style={{fontSize:24,flexShrink:0}}>{f.emoji}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:'#ddd',fontWeight:500}}>{f.name}</div>
            <div style={{fontSize:11,color:'#444',marginTop:2}}>P: {scale(f.prot)}g · C: {scale(f.carbs)}g · F: {scale(f.fat)}g</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontFamily:'Bebas Neue',fontSize:22,color:'#00ff87'}}>{scale(f.cal)}</div>
            <div style={{fontSize:9,color:'#333',letterSpacing:1}}>KCAL</div>
          </div>
        </div>
      ))}

      {/* AI Result */}
      {aiResult && (
        <div onClick={()=>onAdd({...aiResult,cal:scale(aiResult.cal),prot:scale(aiResult.prot),carbs:scale(aiResult.carbs),fat:scale(aiResult.fat),name:aiResult.name+(portion!==100?' ('+portion+'g)':'')})}
          style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#0a1a0f',border:'1px solid #00ff8440',borderRadius:12,marginBottom:6,cursor:'pointer'}}>
          <span style={{fontSize:24}}>{aiResult.emoji||'🍽'}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:'#ddd',fontWeight:500}}>{aiResult.name} <span style={{fontSize:10,color:'#00ff87',background:'#0f2a0f',borderRadius:4,padding:'1px 5px'}}>KI</span></div>
            <div style={{fontSize:11,color:'#444',marginTop:2}}>P: {scale(aiResult.prot)}g · C: {scale(aiResult.carbs)}g · F: {scale(aiResult.fat)}g</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'Bebas Neue',fontSize:22,color:'#00ff87'}}>{scale(aiResult.cal)}</div>
            <div style={{fontSize:9,color:'#333',letterSpacing:1}}>KCAL</div>
          </div>
        </div>
      )}

      {query && results.length === 0 && !aiResult && !aiLoading && (
        <div style={{textAlign:'center',padding:'12px',color:'#444',fontSize:13}}>
          Nichts gefunden · Drücke „KI" für KI-Suche
        </div>
      )}
    </div>
  );
}

// ── TrackerTab ────────────────────────────────────────────────────────
const DAYS = ['Mo','Di','Mi','Do','Fr','Sa','So'];
function TrackerTab() {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const [selDay, setSelDay] = useState(todayIdx);
  const [goal, setGoal] = useState(2200);
  const [weekData, setWeekData] = useState(() => {
    const d = {};
    DAYS.forEach((_,i) => { d[i] = []; });
    return d;
  });
  const [showAdd, setShowAdd] = useState(false);

  const meals = weekData[selDay] || [];
  const totalCal = meals.reduce((s,m) => s + (m.cal||0), 0);
  const totalProt = meals.reduce((s,m) => s + (m.prot||0), 0);
  const totalCarbs = meals.reduce((s,m) => s + (m.carbs||0), 0);
  const totalFat = meals.reduce((s,m) => s + (m.fat||0), 0);
  const pct = Math.min(totalCal / goal * 100, 100);
  const isOver = totalCal > goal;

  const addMeal = (name, cal, prot, carbs, fat, emoji) => {
    setWeekData(prev => ({ ...prev, [selDay]: [...(prev[selDay]||[]), { id:Date.now(), name, cal:Number(cal)||0, prot:Number(prot)||0, carbs:Number(carbs)||0, fat:Number(fat)||0, emoji:emoji||'🍽', time:new Date().toLocaleTimeString('de',{hour:'2-digit',minute:'2-digit'}) }] }));
  };
  const delMeal = (id) => setWeekData(prev => ({ ...prev, [selDay]: prev[selDay].filter(m => m.id !== id) }));

  return (
    <div className="sec">
      {/* Day selector */}
      <div className="tracker-header">
        <div className="tracker-days">
          {DAYS.map((d,i) => {
            const date = new Date(); date.setDate(date.getDate() - (todayIdx - i));
            return (
              <button key={i} className={`tracker-day${i===selDay?' today':''}${weekData[i]?.length>0?' has-data':''}`} onClick={() => setSelDay(i)}>
                <div className="tracker-day-name">{d}</div>
                <div className="tracker-day-num">{date.getDate()}</div>
                <div className="tracker-day-dot" />
              </button>
            );
          })}
        </div>
        {/* Calorie goal */}
        <div className="goal-row">
          <div className="goal-lbl">Tagesziel</div>
          <div className="goal-edit">
            <input className="goal-input" type="number" value={goal} onChange={e=>setGoal(Number(e.target.value))} />
            <span className="goal-unit">kcal</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="cal-bar-wrap">
          <div className={`cal-bar${isOver?' over':''}`} style={{width:`${pct}%`}} />
        </div>
        <div className="cal-labels">
          <span><strong>{totalCal}</strong> gegessen</span>
          <span>{Math.max(0, goal-totalCal)} noch frei</span>
        </div>
        {/* Macro summary */}
        <div className="macro-summary">
          {[['Protein',totalProt+'g'],['Carbs',totalCarbs+'g'],['Fett',totalFat+'g'],['Kcal',totalCal]].map(([l,v])=>(
            <div className="macro-s-cell" key={l}>
              <div className="macro-s-val">{v}</div>
              <div className="macro-s-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="slabel">Mahlzeiten · {DAYS[selDay]}{selDay===todayIdx?' (heute)':''}</div>
      <div className="meal-log">
        {meals.map(m => (
          <div key={m.id} className="meal-item">
            <div className="meal-emoji">{m.emoji}</div>
            <div className="meal-info">
              <div className="meal-name">{m.name}</div>
              <div className="meal-macros">P: {m.prot}g · C: {m.carbs}g · F: {m.fat}g · {m.time}</div>
            </div>
            <div className="meal-cal">{m.cal}</div>
            <button className="meal-del" onClick={() => delMeal(m.id)}>✕</button>
          </div>
        ))}
        {showAdd && <FoodSearch onAdd={(meal)=>{addMeal(meal.name,meal.cal,meal.prot,meal.carbs,meal.fat,meal.emoji);setShowAdd(false);}} onClose={()=>setShowAdd(false)} />}
        {!showAdd && <button className="add-meal-btn" onClick={() => setShowAdd(true)}>🔍 Lebensmittel suchen & hinzufügen</button>}
      </div>

      {/* Week view */}
      <div className="week-view">
        <div className="week-title">Wochenverlauf</div>
        <div className="week-bars">
          {DAYS.map((d,i) => {
            const dayCal = (weekData[i]||[]).reduce((s,m)=>s+(m.cal||0),0);
            const barPct = goal > 0 ? Math.min(dayCal/goal*100, 100) : 0;
            const over = dayCal > goal;
            return (
              <div key={i} className={`week-bar-wrap${i===todayIdx?' today':''}`} onClick={()=>setSelDay(i)} style={{cursor:'pointer'}}>
                <div className="week-bar-bg">
                  <div className={`week-bar-fill${over?' over':''}`} style={{height:`${barPct}%`}} />
                </div>
                <div className="week-bar-day">{d}</div>
              </div>
            );
          })}
        </div>
        <div style={{fontSize:11,color:'#333',marginTop:8,textAlign:'center'}}>
          Ziel: {goal} kcal/Tag · Woche Ø: {Math.round(Object.values(weekData).filter(d=>d.length>0).reduce((s,d)=>s+d.reduce((ss,m)=>ss+(m.cal||0),0),0) / Math.max(1,Object.values(weekData).filter(d=>d.length>0).length))} kcal
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('scan');
  const [img, setImg] = useState(null);
  const [b64, setB64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanErr, setScanErr] = useState(null);
  const [drag, setDrag] = useState(false);
  const [selFixed, setSelFixed] = useState(null);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [selAi, setSelAi] = useState(null);
  const [cart, setCart] = useState([]);
  const fileRef = useRef();
  const camRef = useRef();

  // Add recipe to tracker
  const [trackerMeals, setTrackerMeals] = useState({});
  const addToTracker = (r) => {
    const today = new Date().getDay();
    const idx = today === 0 ? 6 : today - 1;
    alert(`"${r.name}" wurde zum heutigen Tracker hinzugefügt (${r.macros.cal} kcal)`);
  };

  const loadFile = f => {
    if (!f?.type.startsWith('image/')) return;
    setImg(URL.createObjectURL(f)); setScanResult(null); setScanErr(null);
    const reader = new FileReader();
    reader.onload = e => {
      const image = new Image();
      image.onload = () => {
        const MAX=1024; let w=image.width,h=image.height;
        if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;}}
        const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(image,0,0,w,h);
        setB64(canvas.toDataURL('image/jpeg',0.75).split(',')[1]);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(f);
  };

  const doScan = async () => {
    if (!b64) return;
    setLoading(true); setScanErr(null); setScanResult(null);
    try {
      setLoadStep('Bild wird analysiert…');
      const systemPrompt = `Du bist ein Weltklasse-Fitness-Koch und Ernährungsexperte. Analysiere das Kühlschrank-Foto EXAKT.

WICHTIGE REGELN:
1. Liste NUR Zutaten die du WIRKLICH im Bild siehst - keine Erfindungen
2. Erstelle ein Rezept das HAUPTSÄCHLICH aus den vorhandenen Zutaten besteht
3. Wähle ein weltweites Rezept (japanisch, mexikanisch, griechisch, indisch, koreanisch, etc.) das zu den Zutaten passt
4. Falls 1-3 Zutaten fehlen die das Rezept viel besser machen, markiere diese mit ⚠️ in der Einkaufsliste
5. Jedes Mal EIN ANDERES Rezept - nicht immer dasselbe

Antworte GENAU in diesem Format auf Deutsch:

# [Kreativer Rezeptname mit Herkunftsland]
Zeit: X Min
Schwierigkeit: Einfach/Mittel/Schwer
[X] kcal | Protein: [X]g | Kohlenhydrate: [X]g | Fett: [X]g

## Erkannte Zutaten im Kühlschrank
- [Zutat 1] ✅
- [Zutat 2] ✅
(nur was du wirklich siehst)

## Zutaten für das Rezept
- [Menge] [Zutat] ✅ (vorhanden)
- [Menge] [Zutat] ⚠️ (noch kaufen)

## Einkaufsliste
- [nur die Zutaten mit ⚠️]

## Zubereitung
1. [Konkreter Schritt]
2. [Konkreter Schritt]

## Fitness-Tipp
[Warum dieses Gericht gut für Sport ist]`;

      const text = await callAPI({ model:'claude-haiku-4-5-20251001', max_tokens:1600, system: systemPrompt, messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:b64}},{type:'text',text:'Analysiere diesen Kühlschrank genau. Was siehst du? Erstelle daraus ein weltweites Fitness-Rezept. Seed: '+Date.now()}]}] });
      setLoadStep('Rezept wird aufbereitet…');
      const recipe = parseRecipe(text); recipe.tag = 'Aus deinem Kühlschrank';
      setScanResult(recipe);
    } catch(e) { setScanErr('Fehler: ' + e.message); }
    finally { setLoading(false); setLoadStep(''); }
  };

  const genAi = async () => {
    setAiLoading(true); setAiRecipes([]); setSelAi(null);
    try {
      const themes=['mediterran','asiatisch','mexikanisch','low-carb','vegetarisch','high-carb','nordisch'];
      const theme=themes[Math.floor(Math.random()*themes.length)];
      const text=await callAPI({model:'claude-haiku-4-5-20251001',max_tokens:2000,messages:[{role:'user',content:'Erstelle 4 '+theme+'e Fitness-Rezepte. NUR JSON: [{name,emoji,time,difficulty,tag,kcal,protein,carbs,fat,ingredients:[],shopping:[],steps:[],tip}]. Tags:Fruehstueck,Mittagessen,Abendessen,Post-Workout. Seed:'+Date.now()}]});
      const a=text.indexOf('['),b=text.lastIndexOf(']');
      if(a===-1||b===-1) throw new Error('no json');
      const parsed=JSON.parse(text.slice(a,b+1));
      setAiRecipes(parsed.map(r=>({...r,ingredients:r.ingredients||[],shopping:r.shopping||r.ingredients||[],steps:r.steps||[],tip:r.tip||'',macros:{cal:String(r.kcal||'—'),prot:String(r.protein||'—'),carbs:String(r.carbs||'—'),fat:String(r.fat||'—')}})));
    } catch(e) {
      const shuffled=[...POOL].sort(()=>Math.random()-.5).slice(0,4);
      setAiRecipes(shuffled.map(r=>({...r,ingredients:r.ingredients||[],shopping:r.shopping||[],steps:r.steps||[],tip:r.tip||'',macros:{cal:String(r.kcal),prot:String(r.protein),carbs:String(r.carbs),fat:String(r.fat)}})));
    } finally { setAiLoading(false); }
  };

  return (
    <>
      <style>{css}</style>
      <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])} />
      <div className="app">
        <div className="hdr">
          <div className="hdr-icon">🥗</div>
          <div><div className="hdr-title">FRIDGECOACH</div><div className="hdr-sub">KI-POWERED FITNESS REZEPTE</div></div>
        </div>
        <div className="tabs">
          <button className={`tab${tab==='scan'?' on':''}`} onClick={()=>setTab('scan')}>📸 Scan</button>
          <button className={`tab${tab==='samples'?' on':''}`} onClick={()=>setTab('samples')}>🍽 Rezepte</button>
          <button className={`tab${tab==='cart'?' on':''}`} onClick={()=>setTab('cart')}>
            🛒 Warenkorb {cart.length>0&&<span className="tab-badge">{cart.length}</span>}
          </button>
          <button className={`tab${tab==='tracker'?' on':''}`} onClick={()=>setTab('tracker')}>📊 Tracker</button>
        </div>

        {tab==='scan' && (
          <div className="sec">
            <div className={`upload-box${img?' filled':''}${drag?' drag':''}`}
              onClick={()=>!img&&fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0])}}>
              {img?<><img src={img} className="upload-img" alt="Kühlschrank"/><div className="upload-badge">✓ FOTO GELADEN</div></>
                :<><div className="upload-icon">🧊</div><div className="upload-lbl">Kühlschrank-Foto hochladen</div><div className="upload-sub">Tippe zum Auswählen · JPG, PNG</div></>}
            </div>
            {!img&&<button className="cam-btn" onClick={()=>camRef.current.click()}>📷 Kamera öffnen</button>}
            {img&&!loading&&<>
              <button className="go-btn" onClick={doScan} disabled={!b64}>⚡ REZEPT GENERIEREN</button>
              <button className="reset-btn" onClick={()=>{setImg(null);setB64(null);setScanResult(null);setScanErr(null)}}>↩ Neues Foto</button>
            </>}
            {loading&&<div className="loading"><div className="spinner"/><div className="loading-txt"><strong>{loadStep}</strong>KI analysiert…</div></div>}
            {scanErr&&<div className="err">⚠️ {scanErr}</div>}
            {scanResult&&<RecipeView r={scanResult} onAddToTracker={addToTracker} cart={cart} setCart={setCart}/>}
          </div>
        )}

        {tab==='samples' && (
          <div className="sec">
            <div className="slabel">Klassiker</div>
            <div className="grid2">
              {FIXED.map((r,i)=>(
                <div key={r.id} className={`tile${selFixed===i?' on':''}`} onClick={()=>{setSelFixed(selFixed===i?null:i);setSelAi(null)}}>
                  <FoodImg name={r.name} tag={r.tag}/>
                  <div className="tilebody">
                    <div className="tilename">{r.name}</div>
                    <div className="tilemeta">⏱ {r.time} · 💪 {r.macros.prot}g</div>
                    <div className="tiletag">{r.tag}</div>
                  </div>
                </div>
              ))}
            </div>
            {selFixed!==null&&selAi===null&&<RecipeView r={FIXED[selFixed]} onAddToTracker={addToTracker} cart={cart} setCart={setCart}/>}
            <div style={{marginTop:24}}>
              <div className="slabel">KI-generiert</div>
              <button className="aigenbtn" onClick={genAi} disabled={aiLoading}>
                {aiLoading?<><span className="spinner-sm"/> Generiere…</>:'✨  Neue Rezepte von KI generieren'}
              </button>
              {aiLoading&&<div className="loading" style={{marginTop:12}}><div className="spinner"/><div className="loading-txt"><strong>KI erstellt Rezepte…</strong></div></div>}
              {aiRecipes.length>0&&(
                <div className="ailist">
                  {aiRecipes.map((r,i)=>(
                    <div key={i} className={`airow${selAi===i?' on':''}`} onClick={()=>{setSelAi(selAi===i?null:i);setSelFixed(null)}}>
                      <div className="aiinner">
                        <FoodImg name={r.name} tag={r.tag} style={{width:72,height:72,objectFit:'cover',flexShrink:0}}/>
                        <div className="aiinfo">
                          <div className="ainame">{r.emoji||'🥗'} {r.name}</div>
                          <div className="aisub">⏱ {r.time} · {r.tag}</div>
                          <div className="aiprot">💪 {r.macros.prot}g Protein · {r.macros.cal} kcal</div>
                        </div>
                        <span className="chev">▼</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selAi!==null&&<RecipeView r={aiRecipes[selAi]} onAddToTracker={addToTracker} cart={cart} setCart={setCart}/>}
            </div>
          </div>
        )}

        {tab==='cart' && <CartTab cart={cart} setCart={setCart} />}
        {tab==='tracker' && <TrackerTab />}
      </div>
    </>
  );
}
