import { useState, useRef, useEffect } from "react";

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
  if (n.includes("beef") || n.includes("rind")) return "beef rice bowl";
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
    const results = data.results;
    if (results && results.length > 0) {
      const pick = results[Math.floor(Math.random() * Math.min(3, results.length))];
      const url = pick.urls.regular;
      imgCache[q] = url;
      return url;
    }
  } catch(e) {}
  return FALLBACK;
}

const FIXED = [
  { id:1, name:"High-Protein Omelette", emoji:"🍳", time:"10 Min", difficulty:"Einfach", tag:"Frühstück",
    macros:{cal:"420",prot:"38",carbs:"6",fat:"28"},
    ingredients:["4 Eier","100g Hüttenkäse","50g Spinat","30g Fetakäse","1 Tomate"],
    shopping:["Eier 10er","Hüttenkäse 200g","Babyspinat","Fetakäse 200g","Tomaten"],
    steps:["Eier mit Hüttenkäse verquirlen.","Pfanne erhitzen, Masse rein.","2 Min stocken lassen.","Spinat, Tomate und Feta drauf.","Zuklappen, 2 Min garen."],
    tip:"Hüttenkäse verdoppelt den Proteingehalt fast ohne Kalorien." },
  { id:2, name:"Chicken Power Bowl", emoji:"🥣", time:"25 Min", difficulty:"Mittel", tag:"Mittagessen",
    macros:{cal:"580",prot:"52",carbs:"42",fat:"14"},
    ingredients:["200g Hühnerbrust","80g Quinoa","½ Avocado","100g Cherrytomaten","50g Rucola"],
    shopping:["Hühnerbrust 500g","Quinoa 500g","Avocados","Cherrytomaten 250g","Rucola 100g"],
    steps:["Quinoa 15 Min kochen.","Hühnerbrust würzen und braten.","In Streifen schneiden.","Bowl zusammenstellen.","Mit Zitrone beträufeln."],
    tip:"Quinoa liefert alle essentiellen Aminosäuren." },
  { id:3, name:"Tuna Protein Wrap", emoji:"🌯", time:"8 Min", difficulty:"Einfach", tag:"Schnell",
    macros:{cal:"390",prot:"42",carbs:"28",fat:"10"},
    ingredients:["1 Dose Thunfisch","2 Vollkorn-Wraps","3 EL Magerquark","½ Gurke","Dill"],
    shopping:["Thunfisch 3er-Pack","Vollkorn-Wraps 6er","Magerquark 500g","Gurke"],
    steps:["Thunfisch mit Quark mischen.","Gemüse schneiden.","Wrap anwärmen.","Füllen und aufrollen."],
    tip:"Thunfisch: über 25g Protein pro 100g bei minimalem Fett." },
  { id:4, name:"Grüner Protein-Shake", emoji:"🥤", time:"5 Min", difficulty:"Einfach", tag:"Post-Workout",
    macros:{cal:"310",prot:"29",carbs:"32",fat:"6"},
    ingredients:["1 Scoop Whey Vanilla","150g Magerjoghurt","1 Banane","Spinat","200ml Mandelmilch"],
    shopping:["Whey Protein Vanille","Magerjoghurt 500g","Bananen","Babyspinat","Mandelmilch 1L"],
    steps:["Alle Zutaten in Mixer.","30 Sek mixen.","Sofort trinken."],
    tip:"Spinat liefert Eisen und Magnesium – ideal nach dem Training." },
];

const POOL = [
  { name:"Griechischer Lachs", emoji:"🐟", time:"20 Min", difficulty:"Mittel", tag:"Abendessen", kcal:480, protein:46, carbs:8, fat:22, ingredients:["200g Lachs","100g Quinoa","Feta","Gurke","Oliven"], shopping:["Lachsfilet 400g","Quinoa 500g","Fetakäse","Gurke","Oliven Glas"], steps:["Quinoa kochen.","Lachs würzen und braten.","Salat anrichten."], tip:"Omega-3 aus Lachs fördert Muskelregeneration." },
  { name:"Mexikanische Hack Bowl", emoji:"🌮", time:"22 Min", difficulty:"Einfach", tag:"Mittagessen", kcal:620, protein:48, carbs:45, fat:18, ingredients:["250g Rinderhack","80g Reis","Kidneybohnen","Paprika"], shopping:["Rinderhack 500g","Reis 1kg","Kidneybohnen Dose","Paprika"], steps:["Reis kochen.","Hack braten und würzen.","Mit Bohnen servieren."], tip:"Kidneybohnen stabilisieren den Blutzucker." },
  { name:"Post-Workout Reisbrei", emoji:"🍚", time:"10 Min", difficulty:"Einfach", tag:"Post-Workout", kcal:520, protein:38, carbs:72, fat:8, ingredients:["80g Reis","400ml Milch","Schokoprotein","Banane"], shopping:["Rundkornreis 1kg","Milch 1L","Whey Schokolade","Bananen"], steps:["Reis in Milch kochen.","Protein einrühren.","Mit Banane servieren."], tip:"Optimale Carb-Protein-Ratio nach dem Training." },
  { name:"Skyr Protein Bowl", emoji:"🍓", time:"5 Min", difficulty:"Einfach", tag:"Frühstück", kcal:340, protein:34, carbs:38, fat:4, ingredients:["250g Skyr","Vanilleprotein","150g Beeren","Granola"], shopping:["Skyr 500g","Whey Vanille","Beeren TK","Granola"], steps:["Skyr mit Protein rühren.","Beeren drauf.","Granola bestreuen."], tip:"Skyr hat doppelt so viel Protein wie Joghurt." },
  { name:"Thai Garnelen Stir-Fry", emoji:"🍤", time:"15 Min", difficulty:"Mittel", tag:"Abendessen", kcal:390, protein:44, carbs:22, fat:12, ingredients:["200g Garnelen","Reisnudeln","Zucchini","Sojasoße"], shopping:["Garnelen TK 400g","Reisnudeln 500g","Zucchini","Sojasoße"], steps:["Nudeln zubereiten.","Gemüse stir-fry.","Garnelen dazu würzen."], tip:"Garnelen: 85 kcal / 20g Protein." },
  { name:"Spinat Hähnchen Pasta", emoji:"🍝", time:"20 Min", difficulty:"Einfach", tag:"Abendessen", kcal:590, protein:50, carbs:55, fat:12, ingredients:["200g Hühnerbrust","Vollkorn-Penne","100g Spinat","Parmesan"], shopping:["Hühnerbrust 500g","Vollkorn-Penne 500g","Babyspinat 200g","Parmesan"], steps:["Pasta kochen.","Hähnchen braten.","Spinat unterheben.","Mit Parmesan servieren."], tip:"Vollkorn-Pasta: 3x mehr Ballaststoffe." },
  { name:"Hähnchen Souvlaki", emoji:"🥙", time:"25 Min", difficulty:"Einfach", tag:"Mittagessen", kcal:510, protein:54, carbs:28, fat:14, ingredients:["250g Hühnerbrust","Pita","Tzatziki","Tomate"], shopping:["Hühnerbrust 500g","Vollkorn Pita 6er","Tzatziki 200g","Tomaten"], steps:["Hähnchen marinieren.","Grillen.","In Pita einwickeln."], tip:"Zitrusmarinade macht Fleisch zart." },
  { name:"Türkische Eier", emoji:"🍳", time:"12 Min", difficulty:"Einfach", tag:"Frühstück", kcal:380, protein:28, carbs:12, fat:24, ingredients:["3 Eier","200g Joghurt","Knoblauch","Paprikabutter"], shopping:["Eier 10er","Magerjoghurt 500g","Knoblauch","Paprikapulver"], steps:["Joghurt mit Knoblauch.","Eier pochieren.","Paprikabutter drüber."], tip:"Eier + Joghurt = optimale Proteinsynthese." },
];

// ── Image component ──────────────────────────────────────────────────
function FoodImg({ name, tag, className, style }) {
  const [src, setSrc] = useState(FALLBACK);
  useEffect(() => {
    let alive = true;
    getImg(name, tag).then(url => { if (alive) setSrc(url); });
    return () => { alive = false; };
  }, [name]);
  return <img src={src} alt={name} className={className} style={style} loading="lazy" />;
}

// ── CSS ──────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#050505;color:#f0f0f0;font-family:'Inter',sans-serif;min-height:100vh}
.app{max-width:480px;margin:0 auto;padding-bottom:80px}
.hdr{padding:32px 20px 0;display:flex;align-items:center;gap:12px}
.hdr-icon{width:44px;height:44px;background:linear-gradient(135deg,#00ff87,#00cc6a);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 20px #00ff8740}
.hdr-title{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:3px;background:linear-gradient(135deg,#fff 40%,#00ff87);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hdr-sub{font-size:11px;color:#333;margin-top:2px;letter-spacing:.5px}
.tabs{display:flex;margin:24px 20px 0;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:5px;gap:5px}
.tab{flex:1;padding:11px 4px;border:none;background:transparent;color:#444;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;border-radius:12px;cursor:pointer;transition:all .25s}
.tab.on{background:linear-gradient(135deg,#00ff87,#00cc6a);color:#000;box-shadow:0 4px 16px #00ff8750}
.sec{padding:0 20px;margin-top:24px}
.slabel{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#333;font-weight:700;margin-bottom:14px}
.upload-box{border:2px dashed #1e1e1e;border-radius:24px;padding:40px 20px;display:flex;flex-direction:column;align-items:center;gap:12px;cursor:pointer;transition:all .3s;background:#0d0d0d;position:relative;overflow:hidden}
.upload-box:hover,.upload-box.drag{border-color:#00ff87;box-shadow:0 0 40px #00ff8715}
.upload-box.filled{padding:0;border-style:solid;border-color:#00ff87}
.upload-img{width:100%;border-radius:22px;display:block;max-height:280px;object-fit:cover}
.upload-badge{position:absolute;bottom:14px;right:14px;background:rgba(0,0,0,.85);backdrop-filter:blur(10px);padding:6px 14px;border-radius:20px;font-size:11px;color:#00ff87;font-weight:700;border:1px solid #00ff8740}
.upload-icon{font-size:52px;opacity:.15}
.upload-lbl{font-size:16px;font-weight:600;color:#666}
.upload-sub{font-size:12px;color:#222;text-align:center}
.cam-btn{width:100%;margin-top:12px;background:transparent;border:1px solid #1a1a1a;border-radius:16px;padding:14px;color:#444;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.cam-btn:hover{border-color:#333;color:#777}
.go-btn{width:100%;margin-top:16px;background:linear-gradient(135deg,#00ff87,#00cc6a);color:#000;border:none;border-radius:18px;padding:20px;font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;box-shadow:0 8px 32px #00ff8740}
.go-btn:hover:not([disabled]){transform:translateY(-2px);box-shadow:0 12px 40px #00ff8760}
.go-btn[disabled]{opacity:.25;cursor:not-allowed;box-shadow:none}
.reset-btn{width:100%;margin-top:10px;background:transparent;border:1px solid #1a1a1a;border-radius:14px;padding:13px;color:#333;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
.reset-btn:hover{border-color:#333;color:#666}
.loading{margin-top:24px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:24px;padding:40px 20px;display:flex;flex-direction:column;align-items:center;gap:16px}
.spinner{width:48px;height:48px;border:3px solid #1a1a1a;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite}
.spinner-sm{width:16px;height:16px;border:2px solid #1a1a1a;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-txt{font-size:14px;color:#444;text-align:center;line-height:1.7}
.loading-txt strong{color:#00ff87;display:block;font-size:15px;margin-bottom:4px}
.err{margin-top:16px;background:#120808;border:1px solid #2a1010;border-radius:16px;padding:16px;color:#ff6b6b;font-size:13px;line-height:1.5}
.rcard{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:24px;overflow:hidden;margin-top:20px;animation:fadeUp .4s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.hero{position:relative;height:200px;overflow:hidden}
.hero img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}
.hero:hover img{transform:scale(1.05)}
.hero-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.9),rgba(0,0,0,.1) 60%,transparent)}
.hero-ct{position:absolute;bottom:0;left:0;right:0;padding:16px 20px}
.rtag{display:inline-flex;align-items:center;gap:5px;background:rgba(0,255,135,.15);border:1px solid #00ff8440;border-radius:20px;padding:4px 12px;font-size:11px;color:#00ff87;font-weight:700;letter-spacing:.5px;margin-bottom:8px;backdrop-filter:blur(8px)}
.rname{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:1px;line-height:1;color:#fff}
.rmeta{display:flex;gap:14px;margin-top:6px}
.rmeta span{font-size:12px;color:rgba(255,255,255,.5)}
.mgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#1a1a1a}
.mcell{background:#0a0a0a;padding:16px 8px;display:flex;flex-direction:column;align-items:center;gap:4px}
.mval{font-family:'Bebas Neue',sans-serif;font-size:28px;background:linear-gradient(135deg,#00ff87,#00cc6a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.mlbl{font-size:9px;color:#333;letter-spacing:2px;text-transform:uppercase;font-weight:600}
.rbody{padding:22px}
.lbl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#333;font-weight:700;margin-bottom:12px}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:20px}
.chip{background:#111;border:1px solid #1e1e1e;border-radius:20px;padding:6px 13px;font-size:12px;color:#666}
.srow{display:flex;gap:14px;margin-bottom:16px;align-items:flex-start}
.snum{width:28px;height:28px;background:#0a1a0f;border:1px solid #00ff8330;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#00ff87;flex-shrink:0;margin-top:1px}
.stxt{font-size:13px;color:#777;line-height:1.65}
.tipbox{background:#0a1a0f;border:1px solid #00ff8225;border-radius:14px;padding:14px 16px;display:flex;gap:12px;margin-top:6px}
.tipbox p{font-size:12px;color:#7aff9e;line-height:1.6}
.shcard{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;padding:18px;margin-top:14px;animation:fadeUp .4s ease .1s both}
.shhdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.shlbl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#00ff87;font-weight:700}
.shprog{height:3px;background:#1a1a1a;border-radius:2px;margin-bottom:14px;overflow:hidden}
.shbar{height:100%;background:linear-gradient(90deg,#00ff87,#00cc6a);border-radius:2px;transition:width .3s}
.shitem{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #111;cursor:pointer;transition:padding .15s}
.shitem:last-child{border-bottom:none}
.shitem:hover{padding-left:4px}
.shcheck{width:20px;height:20px;border:1.5px solid #2a2a2a;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .2s;color:#000;font-weight:800}
.shcheck.on{background:linear-gradient(135deg,#00ff87,#00cc6a);border-color:#00ff87}
.shname{font-size:13px;color:#777;flex:1;transition:all .2s}
.shname.done{text-decoration:line-through;color:#2a2a2a}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.tile{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;cursor:pointer;transition:all .25s;overflow:hidden}
.tile:hover,.tile.on{border-color:#00ff87;box-shadow:0 4px 24px #00ff8720;transform:translateY(-2px)}
.tile.on{background:#0a1a0f}
.tile img{width:100%;height:110px;object-fit:cover;display:block;transition:transform .4s}
.tile:hover img,.tile.on img{transform:scale(1.07)}
.tilebody{padding:12px}
.tilename{font-family:'Bebas Neue',sans-serif;font-size:16px;color:#fff;line-height:1.1;margin-bottom:3px}
.tilemeta{font-size:11px;color:#444}
.tiletag{display:inline-block;background:#0f1f14;border:1px solid #00ff8220;border-radius:6px;padding:2px 8px;font-size:10px;color:#00ff87;font-weight:700;margin-top:7px}
.aigenbtn{width:100%;margin-top:16px;background:transparent;border:1px solid #1e1e1e;border-radius:16px;padding:16px;color:#00ff87;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .25s}
.aigenbtn:hover:not([disabled]){border-color:#00ff8660;background:#0a1a0f}
.aigenbtn[disabled]{opacity:.3;cursor:not-allowed}
.ailist{margin-top:14px;display:flex;flex-direction:column;gap:10px}
.airow{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:18px;cursor:pointer;transition:all .25s;overflow:hidden}
.airow:hover,.airow.on{border-color:#00ff87;box-shadow:0 4px 20px #00ff8720;transform:translateY(-1px)}
.airow.on{background:#0a1a0f}
.aiinner{display:flex;align-items:center}
.aiimg{width:80px;height:80px;object-fit:cover;flex-shrink:0}
.aiinfo{flex:1;padding:12px 14px}
.ainame{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff;line-height:1}
.aisub{font-size:11px;color:#444;margin-top:2px}
.aiprot{font-size:12px;color:#00ff87;font-weight:600;margin-top:5px}
.chev{color:#2a2a2a;font-size:12px;padding-right:14px;transition:transform .25s}
.airow.on .chev{transform:rotate(180deg);color:#00ff87}
.rewe-btn{width:100%;margin-top:14px;background:linear-gradient(135deg,#cc071e,#a30018);border:none;border-radius:14px;padding:14px 16px;color:#fff;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;box-shadow:0 4px 16px rgba(204,7,30,.3)}
.rewe-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(204,7,30,.4)}
.rewe-mini{background:#1a0a0a;border:1px solid #2a1010;border-radius:8px;cursor:pointer;padding:5px 9px;display:flex;align-items:center;color:#cc071e;font-size:10px;font-weight:700;font-family:'Inter',sans-serif;transition:all .2s;flex-shrink:0;letter-spacing:.3px}
.rewe-mini:hover{background:#cc071e;color:#fff}
.rewe-sheet{position:fixed;inset:0;z-index:999;display:flex;flex-direction:column;justify-content:flex-end}
.rewe-sheet-bg{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px)}
.rewe-sheet-box{position:relative;background:#0d0d0d;border-radius:24px 24px 0 0;border:1px solid #1a1a1a;border-bottom:none;padding:24px 20px 40px;max-height:75vh;overflow-y:auto;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.rewe-sheet-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.rewe-sheet-title{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#fff;letter-spacing:1px}
.rewe-sheet-close{background:transparent;border:1px solid #2a2a2a;border-radius:8px;color:#666;font-size:16px;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center}
.rewe-sheet-sub{font-size:12px;color:#444;margin-bottom:16px}
.rewe-product{display:flex;align-items:center;gap:12px;padding:12px;background:#111;border:1px solid #1a1a1a;border-radius:14px;margin-bottom:10px;cursor:pointer;transition:all .2s;text-decoration:none}
.rewe-product:hover{border-color:#cc071e;background:#1a0808}
.rewe-product-img{width:56px;height:56px;border-radius:10px;object-fit:cover;background:#1a1a1a;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:24px}
.rewe-product-info{flex:1}
.rewe-product-name{font-size:13px;color:#ddd;font-weight:500;line-height:1.3}
.rewe-product-brand{font-size:11px;color:#444;margin-top:2px}
.rewe-product-price{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#cc071e;letter-spacing:.5px;flex-shrink:0}
.rewe-product-unit{font-size:10px;color:#333;text-align:right;margin-top:2px}
.rewe-order-btn{width:100%;margin-top:4px;background:linear-gradient(135deg,#cc071e,#a30018);border:none;border-radius:14px;padding:15px;color:#fff;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(204,7,30,.3)}
.rewe-order-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(204,7,30,.5)}
.rewe-loading{text-align:center;padding:24px;color:#444;font-size:13px}
`;

// ── Helpers ──────────────────────────────────────────────────────────
async function callAPI(body) {
  const res = await fetch('/api/claude', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'API error');
  return data.content?.[0]?.text || '';
}

function parseMacros(t) {
  const n = rx => t.match(rx)?.[1] ?? '—';
  return {
    cal:   n(/(\d+)\s*kcal/i),
    prot:  n(/Protein[:\s]+(\d+)/i) !== '—' ? n(/Protein[:\s]+(\d+)/i) : n(/(\d+)\s*g\s*Protein/i),
    carbs: n(/Kohlenhydrate[:\s]+(\d+)/i) !== '—' ? n(/Kohlenhydrate[:\s]+(\d+)/i) : n(/(\d+)\s*g\s*Carbs/i),
    fat:   n(/Fett[:\s]+(\d+)/i) !== '—' ? n(/Fett[:\s]+(\d+)/i) : n(/(\d+)\s*g\s*Fett/i),
  };
}

function parseRecipe(raw) {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  let name='', ing=[], steps=[], tip='', shopping=[], time='~20 Min', diff='Einfach', mode=null;
  for (const l of lines) {
    const lo = l.toLowerCase();
    if (/^#+/.test(l)) { const cl = l.replace(/^#+\s*/,''); if (!name && cl.length<70 && !lo.includes('zutat') && !lo.includes('zubereitung') && !lo.includes('einkauf') && !lo.includes('tipp')) { name=cl; continue; } }
    if (lo.includes('einkauf')) { mode='shop'; continue; }
    if (lo.includes('zutat')) { mode='ing'; continue; }
    if (lo.includes('zubereitung') || lo.includes('schritt')) { mode='steps'; continue; }
    if (lo.includes('tipp')) { mode='tip'; continue; }
    if (lo.match(/zeit[:\s]/)) { time=l.replace(/.*?:/,'').trim(); continue; }
    if (lo.match(/schwierig/)) { diff=l.replace(/.*?:/,'').trim(); continue; }
    if (!name && l.length<70 && !/^[-*•\d]/.test(l)) { name=l; continue; }
    const cl = l.replace(/^[-*•]\s*/,'').replace(/^\d+[.)]\s*/,'');
    if (mode==='ing') ing.push(cl);
    else if (mode==='shop') shopping.push(cl);
    else if (mode==='steps') steps.push(cl);
    else if (mode==='tip') tip += ' ' + cl;
  }
  return { name: name||'Fitness Rezept', ingredients: ing, steps, tip: tip.trim(), shopping, time, difficulty: diff, macros: parseMacros(raw) };
}

// ── Rewe Produktdatenbank ─────────────────────────────────────────────
const REWE_DB = {
  "eier":        [{name:"Bio Eier 10 Stück",brand:"REWE Bio",price:"2,49 €",unit:"10 Stk",emoji:"🥚"},{name:"Freilandeier 6 Stück",brand:"Ja!",price:"1,19 €",unit:"6 Stk",emoji:"🥚"},{name:"Eier M 10 Stück",brand:"REWE",price:"1,79 €",unit:"10 Stk",emoji:"🥚"}],
  "hühnerbrust": [{name:"Hähnchenbrustfilet",brand:"REWE",price:"4,99 €",unit:"500g",emoji:"🍗"},{name:"Bio Hähnchenbrustfilet",brand:"REWE Bio",price:"6,49 €",unit:"400g",emoji:"🍗"},{name:"Hähnchenbrust natur",brand:"Wiesenhof",price:"3,99 €",unit:"400g",emoji:"🍗"}],
  "hähnchen":    [{name:"Hähnchenbrustfilet",brand:"REWE",price:"4,99 €",unit:"500g",emoji:"🍗"},{name:"Bio Hähnchenbrustfilet",brand:"REWE Bio",price:"6,49 €",unit:"400g",emoji:"🍗"},{name:"Hähnchenschenkel",brand:"REWE",price:"3,49 €",unit:"1kg",emoji:"🍗"}],
  "lachs":       [{name:"Lachsfilet",brand:"REWE",price:"3,99 €",unit:"200g",emoji:"🐟"},{name:"Bio Lachs",brand:"REWE Bio",price:"5,99 €",unit:"200g",emoji:"🐟"},{name:"Räucherlachs",brand:"Forsthaus Rungis",price:"2,49 €",unit:"100g",emoji:"🐟"}],
  "thunfisch":   [{name:"Thunfisch in Wasser",brand:"Nixe",price:"0,99 €",unit:"185g",emoji:"🐟"},{name:"Thunfisch natur",brand:"REWE",price:"1,29 €",unit:"185g",emoji:"🐟"},{name:"Bio Thunfisch",brand:"followfish",price:"2,49 €",unit:"185g",emoji:"🐟"}],
  "quinoa":      [{name:"Quinoa weiß",brand:"REWE Bio",price:"2,99 €",unit:"400g",emoji:"🌾"},{name:"Quinoa",brand:"Alnatura",price:"3,49 €",unit:"500g",emoji:"🌾"},{name:"Quinoa Trio",brand:"REWE Bio",price:"3,29 €",unit:"400g",emoji:"🌾"}],
  "avocado":     [{name:"Avocado reif",brand:"REWE",price:"1,29 €",unit:"Stück",emoji:"🥑"},{name:"Bio Avocado",brand:"REWE Bio",price:"1,79 €",unit:"Stück",emoji:"🥑"},{name:"Avocado 2er Pack",brand:"REWE",price:"2,29 €",unit:"2 Stk",emoji:"🥑"}],
  "spinat":      [{name:"Babyspinat",brand:"REWE",price:"1,49 €",unit:"150g",emoji:"🥬"},{name:"Bio Babyspinat",brand:"REWE Bio",price:"1,99 €",unit:"150g",emoji:"🥬"},{name:"Blattspinat TK",brand:"Iglo",price:"1,29 €",unit:"750g",emoji:"🥬"}],
  "joghurt":     [{name:"Magerjoghurt",brand:"REWE",price:"0,59 €",unit:"500g",emoji:"🥛"},{name:"Griechischer Joghurt",brand:"Fage",price:"1,99 €",unit:"500g",emoji:"🥛"},{name:"Bio Joghurt",brand:"REWE Bio",price:"0,99 €",unit:"500g",emoji:"🥛"}],
  "skyr":        [{name:"Skyr Natur",brand:"Arla",price:"1,49 €",unit:"500g",emoji:"🥛"},{name:"Isländischer Skyr",brand:"REWE",price:"1,29 €",unit:"500g",emoji:"🥛"},{name:"Bio Skyr",brand:"Siggi's",price:"2,49 €",unit:"450g",emoji:"🥛"}],
  "reis":        [{name:"Basmati Reis",brand:"REWE",price:"1,49 €",unit:"1kg",emoji:"🍚"},{name:"Bio Basmati",brand:"REWE Bio",price:"2,29 €",unit:"1kg",emoji:"🍚"},{name:"Jasmin Reis",brand:"Ja!",price:"1,29 €",unit:"1kg",emoji:"🍚"}],
  "pasta":       [{name:"Vollkorn Penne",brand:"REWE",price:"0,89 €",unit:"500g",emoji:"🍝"},{name:"Bio Vollkorn Spaghetti",brand:"Alnatura",price:"1,49 €",unit:"500g",emoji:"🍝"},{name:"Penne Rigate",brand:"Barilla",price:"1,19 €",unit:"500g",emoji:"🍝"}],
  "banane":      [{name:"Bananen",brand:"REWE",price:"1,49 €",unit:"~1kg",emoji:"🍌"},{name:"Bio Bananen",brand:"REWE Bio",price:"2,29 €",unit:"~1kg",emoji:"🍌"},{name:"Fairtrade Bananen",brand:"REWE",price:"1,79 €",unit:"~1kg",emoji:"🍌"}],
  "mandelmilch": [{name:"Mandelmilch ungesüßt",brand:"Alpro",price:"1,99 €",unit:"1L",emoji:"🥛"},{name:"Mandelmilch",brand:"REWE Bio",price:"1,79 €",unit:"1L",emoji:"🥛"},{name:"Mandel Drink",brand:"Oatly",price:"2,29 €",unit:"1L",emoji:"🥛"}],
  "erdnussbutter":[{name:"Erdnussmus",brand:"Alnatura",price:"2,99 €",unit:"500g",emoji:"🥜"},{name:"Erdnussbutter crunchy",brand:"Skippy",price:"3,49 €",unit:"454g",emoji:"🥜"},{name:"Bio Erdnussmus",brand:"REWE Bio",price:"2,49 €",unit:"500g",emoji:"🥜"}],
  "fetakäse":    [{name:"Feta",brand:"REWE",price:"1,49 €",unit:"200g",emoji:"🧀"},{name:"Bio Feta",brand:"Andechser",price:"2,29 €",unit:"200g",emoji:"🧀"},{name:"Griechischer Feta",brand:"Dodoni",price:"2,49 €",unit:"200g",emoji:"🧀"}],
  "hüttenkäse":  [{name:"Hüttenkäse",brand:"REWE",price:"0,99 €",unit:"200g",emoji:"🧀"},{name:"Hüttenkäse",brand:"Exquisa",price:"1,29 €",unit:"200g",emoji:"🧀"},{name:"Bio Hüttenkäse",brand:"REWE Bio",price:"1,49 €",unit:"200g",emoji:"🧀"}],
  "magerquark":  [{name:"Magerquark",brand:"REWE",price:"0,79 €",unit:"500g",emoji:"🧀"},{name:"Magerquark",brand:"Milbona",price:"0,69 €",unit:"500g",emoji:"🧀"},{name:"Bio Magerquark",brand:"REWE Bio",price:"1,19 €",unit:"500g",emoji:"🧀"}],
  "garnelen":    [{name:"Garnelen TK",brand:"REWE",price:"4,99 €",unit:"500g",emoji:"🦐"},{name:"Bio Garnelen",brand:"followfish",price:"6,99 €",unit:"300g",emoji:"🦐"},{name:"Riesengarnelen",brand:"REWE",price:"5,49 €",unit:"400g",emoji:"🦐"}],
  "rinderhack":  [{name:"Rinderhackfleisch",brand:"REWE",price:"3,99 €",unit:"500g",emoji:"🥩"},{name:"Bio Rinderhack",brand:"REWE Bio",price:"5,99 €",unit:"400g",emoji:"🥩"},{name:"Hackfleisch gemischt",brand:"REWE",price:"2,99 €",unit:"500g",emoji:"🥩"}],
  "default":     [{name:"Bei Rewe suchen",brand:"Rewe Lieferservice",price:"ab 0,99 €",unit:"",emoji:"🛒"}],
};

function getReweProducts(item) {
  const q = item.toLowerCase().replace(/\d+g|\d+ml|\d+x|\d+\s/g, '').trim();
  for (const [key, products] of Object.entries(REWE_DB)) {
    if (q.includes(key) || key.includes(q.split(' ')[0])) return products;
  }
  return REWE_DB.default;
}

// ── ReweSheet ─────────────────────────────────────────────────────────
function ReweSheet({ item, onClose }) {
  const query = item.replace(/\d+g|\d+ml|\d+x/g, '').replace(/\d+\s/g, '').trim();
  const products = getReweProducts(item);

  const openRewe = (productName) => {
    window.open('https://shop.rewe.de/suche/?search=' + encodeURIComponent(productName || query), '_blank');
  };

  return (
    <div className="rewe-sheet">
      <div className="rewe-sheet-bg" onClick={onClose} />
      <div className="rewe-sheet-box">
        <div className="rewe-sheet-hdr">
          <div className="rewe-sheet-title">🔴 {query}</div>
          <button className="rewe-sheet-close" onClick={onClose}>✕</button>
        </div>
        <div className="rewe-sheet-sub">Preisvergleich · verschiedene Hersteller</div>
        {products.map((p, i) => (
          <div key={i} className="rewe-product" onClick={() => openRewe(p.name)}>
            <div className="rewe-product-img">{p.emoji}</div>
            <div className="rewe-product-info">
              <div className="rewe-product-name">{p.name}</div>
              <div className="rewe-product-brand">{p.brand}{p.unit ? ' · ' + p.unit : ''}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div className="rewe-product-price">{p.price}</div>
              <div className="rewe-product-unit">→ Rewe</div>
            </div>
          </div>
        ))}
        <button className="rewe-order-btn" onClick={() => openRewe(query)}>
          BEI REWE KAUFEN
        </button>
      </div>
    </div>
  );
}

// ── RecipeView ────────────────────────────────────────────────────────
function RecipeView({ r }) {
  const [checked, setChecked] = useState({});
  const [reweItem, setReweItem] = useState(null);
  const list = r.shopping?.length ? r.shopping : r.ingredients;
  const toggle = i => setChecked(p => ({ ...p, [i]: !p[i] }));
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <>
      <div className="rcard">
        <div className="hero">
          <FoodImg name={r.name} tag={r.tag||''} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',transition:'transform .5s'}} />
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
          {r.ingredients.length>0 && <><div className="lbl">Zutaten</div><div className="chips">{r.ingredients.map((x,i) => <span className="chip" key={i}>{x}</span>)}</div></>}
          {r.steps.length>0 && <><div className="lbl">Zubereitung</div>{r.steps.map((s,i) => <div className="srow" key={i}><div className="snum">{i+1}</div><div className="stxt">{s}</div></div>)}</>}
          {r.tip && <div className="tipbox"><span style={{fontSize:18}}>💪</span><p>{r.tip}</p></div>}
        </div>
      </div>
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
              <button className="rewe-mini" onClick={() => setReweItem(item)}>REWE</button>
            </div>
          ))}
          <button className="rewe-btn" onClick={() => setReweItem(list[0])}>
            <span style={{fontSize:16}}>🔴</span>
            <span>Preise & Varianten bei Rewe</span>
            <span style={{fontSize:11,opacity:.6}}>→</span>
          </button>
          {reweItem && <ReweSheet item={reweItem} onClose={() => setReweItem(null)} />}
        </div>
      )}
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────
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
  const fileRef = useRef();
  const camRef = useRef();

  const loadFile = f => {
    if (!f?.type.startsWith('image/')) return;
    setImg(URL.createObjectURL(f)); setScanResult(null); setScanErr(null);
    const reader = new FileReader();
    reader.onload = e => {
      const image = new Image();
      image.onload = () => {
        const MAX = 1024; let w = image.width, h = image.height;
        if (w>MAX||h>MAX) { if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;} }
        const canvas = document.createElement('canvas'); canvas.width=w; canvas.height=h;
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
      const text = await callAPI({ model:'claude-haiku-4-5-20251001', max_tokens:1400, system:'Du bist ein Fitness-Koch. Antworte auf Deutsch.\nFormat:\n# Rezeptname\nZeit: X Min\nSchwierigkeit: Einfach\nX kcal | Protein: Xg | Kohlenhydrate: Xg | Fett: Xg\n## Zutaten\n- ...\n## Einkaufsliste\n- ...\n## Zubereitung\n1. ...\n## Tipp\n...', messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:b64}},{type:'text',text:'Erkenne alle Lebensmittel und erstelle ein Fitness-Rezept.'}]}] });
      setLoadStep('Rezept wird aufbereitet…');
      const recipe = parseRecipe(text); recipe.tag = 'Aus deinem Kühlschrank';
      setScanResult(recipe);
    } catch(e) { setScanErr('Fehler: ' + e.message); }
    finally { setLoading(false); setLoadStep(''); }
  };

  const genAi = async () => {
    setAiLoading(true); setAiRecipes([]); setSelAi(null);
    try {
      const themes = ['mediterran','asiatisch','mexikanisch','low-carb','vegetarisch','high-carb','nordisch'];
      const theme = themes[Math.floor(Math.random()*themes.length)];
      const text = await callAPI({ model:'claude-haiku-4-5-20251001', max_tokens:2000, messages:[{role:'user',content:'Erstelle 4 '+theme+'e Fitness-Rezepte. NUR JSON: [{name,emoji,time,difficulty,tag,kcal,protein,carbs,fat,ingredients:[],shopping:[],steps:[],tip}]. Tags:Fruehstueck,Mittagessen,Abendessen,Post-Workout. Seed:'+Date.now()}] });
      const a=text.indexOf('['), b=text.lastIndexOf(']');
      if(a===-1||b===-1) throw new Error('no json');
      const parsed = JSON.parse(text.slice(a,b+1));
      setAiRecipes(parsed.map(r => ({ ...r, ingredients:r.ingredients||[], shopping:r.shopping||r.ingredients||[], steps:r.steps||[], tip:r.tip||'', macros:{cal:String(r.kcal||'—'),prot:String(r.protein||'—'),carbs:String(r.carbs||'—'),fat:String(r.fat||'—')} })));
    } catch(e) {
      const shuffled = [...POOL].sort(()=>Math.random()-.5).slice(0,4);
      setAiRecipes(shuffled.map(r => ({ ...r, ingredients:r.ingredients||[], shopping:r.shopping||[], steps:r.steps||[], tip:r.tip||'', macros:{cal:String(r.kcal),prot:String(r.protein),carbs:String(r.carbs),fat:String(r.fat)} })));
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
          <button className={`tab${tab==='scan'?' on':''}`} onClick={()=>setTab('scan')}>📸 Kühlschrank scannen</button>
          <button className={`tab${tab==='samples'?' on':''}`} onClick={()=>setTab('samples')}>🍽 Beispiel-Rezepte</button>
        </div>

        {tab==='scan' && (
          <div className="sec">
            <div className={`upload-box${img?' filled':''}${drag?' drag':''}`}
              onClick={()=>!img&&fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0])}}>
              {img ? <><img src={img} className="upload-img" alt="Kühlschrank"/><div className="upload-badge">✓ FOTO GELADEN</div></>
                : <><div className="upload-icon">🧊</div><div className="upload-lbl">Kühlschrank-Foto hochladen</div><div className="upload-sub">Tippe zum Auswählen · JPG, PNG</div></>}
            </div>
            {!img && <button className="cam-btn" onClick={()=>camRef.current.click()}>📷 &nbsp;Kamera öffnen</button>}
            {img && !loading && <>
              <button className="go-btn" onClick={doScan} disabled={!b64}>⚡ REZEPT GENERIEREN</button>
              <button className="reset-btn" onClick={()=>{setImg(null);setB64(null);setScanResult(null);setScanErr(null)}}>↩ Neues Foto wählen</button>
            </>}
            {loading && <div className="loading"><div className="spinner"/><div className="loading-txt"><strong>{loadStep}</strong>KI analysiert deine Zutaten…</div></div>}
            {scanErr && <div className="err">⚠️ {scanErr}</div>}
            {scanResult && <RecipeView r={scanResult} />}
          </div>
        )}

        {tab==='samples' && (
          <div className="sec">
            <div className="slabel">Klassiker</div>
            <div className="grid2">
              {FIXED.map((r,i) => (
                <div key={r.id} className={`tile${selFixed===i?' on':''}`} onClick={()=>{setSelFixed(selFixed===i?null:i);setSelAi(null)}}>
                  <FoodImg name={r.name} tag={r.tag} />
                  <div className="tilebody">
                    <div className="tilename">{r.name}</div>
                    <div className="tilemeta">⏱ {r.time} · 💪 {r.macros.prot}g</div>
                    <div className="tiletag">{r.tag}</div>
                  </div>
                </div>
              ))}
            </div>
            {selFixed!==null && selAi===null && <RecipeView r={FIXED[selFixed]} />}

            <div style={{marginTop:28}}>
              <div className="slabel">KI-generiert</div>
              <button className="aigenbtn" onClick={genAi} disabled={aiLoading}>
                {aiLoading ? <><span className="spinner-sm"/> Generiere…</> : '✨  Neue Rezepte von KI generieren'}
              </button>
              {aiLoading && <div className="loading" style={{marginTop:14}}><div className="spinner"/><div className="loading-txt"><strong>KI erstellt Rezepte…</strong></div></div>}
              {aiRecipes.length>0 && (
                <div className="ailist">
                  {aiRecipes.map((r,i) => (
                    <div key={i} className={`airow${selAi===i?' on':''}`} onClick={()=>{setSelAi(selAi===i?null:i);setSelFixed(null)}}>
                      <div className="aiinner">
                        <FoodImg name={r.name} tag={r.tag} style={{width:80,height:80,objectFit:'cover',flexShrink:0}} />
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
              {selAi!==null && <RecipeView r={aiRecipes[selAi]} />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
