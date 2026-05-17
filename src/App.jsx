import { useState, useRef, useEffect } from "react";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80";
const imageCache = {};

// Translate German food names to English for better search results
function toEnglishQuery(name="", tag="") {
  const n = (name+" "+tag).toLowerCase();
  if(n.includes("omelette")||n.includes("rührei")) return "protein omelette eggs fitness";
  if(n.includes("pancake")) return "protein pancakes healthy breakfast";
  if(n.includes("power bowl")||n.includes("chicken bowl")) return "chicken rice bowl healthy";
  if(n.includes("wrap")||n.includes("thun")||n.includes("tuna")) return "tuna wrap healthy lunch";
  if(n.includes("shake")||n.includes("smoothie")) return "green protein smoothie fitness";
  if(n.includes("lachs")||n.includes("salmon")) return "grilled salmon healthy food";
  if(n.includes("mexik")||n.includes("hack bowl")||n.includes("burrito")) return "mexican bowl healthy food";
  if(n.includes("garnelen")||n.includes("thai")||n.includes("stir")) return "shrimp stir fry asian";
  if(n.includes("skyr")||n.includes("beeren")||n.includes("joghurt bowl")) return "yogurt berry bowl breakfast";
  if(n.includes("reisbrei")||n.includes("porridge")) return "rice porridge healthy breakfast";
  if(n.includes("pasta")||n.includes("nudel")) return "chicken spinach pasta healthy";
  if(n.includes("souvlaki")||n.includes("pita")||n.includes("gyros")) return "chicken souvlaki greek food";
  if(n.includes("tofu")) return "tofu bowl vegan healthy";
  if(n.includes("türk")||n.includes("cilbir")||n.includes("eier")) return "poached eggs yogurt turkish";
  if(n.includes("reisbrei")||n.includes("brei")) return "rice pudding protein bowl";
  if(n.includes("beef")||n.includes("rind")) return "beef rice bowl asian";
  if(n.includes("hummus")) return "hummus wrap healthy lunch";
  // Generic fallback based on tag
  if(n.includes("frueh")||n.includes("breakfast")) return "healthy breakfast fitness food";
  if(n.includes("mittag")||n.includes("lunch")) return "healthy lunch meal prep";
  if(n.includes("abend")||n.includes("dinner")) return "healthy dinner protein meal";
  if(n.includes("post-workout")||n.includes("workout")) return "post workout meal healthy";
  return name.split(" ").slice(0,3).join(" ") + " healthy food";
}

async function fetchUnsplashImage(query) {
  if(imageCache[query]) return imageCache[query];
  try {
    const url = "/api/unsplash?query=" + encodeURIComponent(query);
    const res = await fetch(url);
    const data = await res.json();
    const results = data.results;
    if(results && results.length > 0) {
      // Pick a random one from top 5 for variety
      const pick = results[Math.floor(Math.random() * Math.min(3, results.length))];
      const imgUrl = pick.urls.regular + "&w=600&q=80";
      imageCache[query] = imgUrl;
      return imgUrl;
    }
  } catch(e) { console.warn("Unsplash fetch failed:", e); }
  return FALLBACK_IMG;
}

const FIXED_RECIPES = [
  { id:1, name:"High-Protein Omelette", emoji:"🍳", time:"10 Min", difficulty:"Einfach", tag:"Frühstück", macros:{cal:"420",prot:"38",carbs:"6",fat:"28"}, ingredients:["4 Eier","100g Hüttenkäse","50g Spinat","30g Fetakäse","1 Tomate","Salz, Pfeffer"], shopping:["Eier 10er","Hüttenkäse 200g","Babyspinat 100g","Fetakäse 200g","Tomaten"], steps:["Eier mit Hüttenkäse verquirlen.","Pfanne erhitzen, Ei-Masse rein.","2 Min stocken lassen.","Spinat, Tomate und Feta drauf.","Omelette zuklappen, 2 Min garen."], tip:"Hüttenkäse verdoppelt den Proteingehalt ohne extra Kalorien." },
  { id:2, name:"Chicken Power Bowl", emoji:"🥣", time:"25 Min", difficulty:"Mittel", tag:"Mittagessen", macros:{cal:"580",prot:"52",carbs:"42",fat:"14"}, ingredients:["200g Hühnerbrust","80g Quinoa","½ Avocado","100g Cherrytomaten","50g Rucola"], shopping:["Hühnerbrust 500g","Quinoa 500g","Avocados","Cherrytomaten 250g","Rucola 100g"], steps:["Quinoa 15 Min kochen.","Hühnerbrust würzen und braten.","In Streifen schneiden.","Bowl aufbauen.","Mit Zitrone beträufeln."], tip:"Quinoa liefert alle Aminosäuren – perfekt für Muskelaufbau." },
  { id:3, name:"Tuna Protein Wrap", emoji:"🌯", time:"8 Min", difficulty:"Einfach", tag:"Schnell", macros:{cal:"390",prot:"42",carbs:"28",fat:"10"}, ingredients:["1 Dose Thunfisch","2 Vollkorn-Wraps","3 EL Magerquark","½ Gurke","Dill"], shopping:["Thunfisch 3er-Pack","Vollkorn-Wraps 6er","Magerquark 500g","Gurke"], steps:["Thunfisch mit Quark mischen.","Gemüse schneiden.","Wrap anwärmen.","Füllen und aufrollen."], tip:"Thunfisch: über 25g Protein pro 100g bei minimalem Fett." },
  { id:4, name:"Grüner Protein-Shake", emoji:"🥤", time:"5 Min", difficulty:"Einfach", tag:"Post-Workout", macros:{cal:"310",prot:"29",carbs:"32",fat:"6"}, ingredients:["1 Scoop Whey Vanilla","150g Magerjoghurt","1 Banane","Spinat","200ml Mandelmilch"], shopping:["Whey Protein Vanille","Magerjoghurt 500g","Bananen","Babyspinat","Mandelmilch 1L"], steps:["Alle Zutaten in Mixer.","30 Sek mixen.","Sofort trinken."], tip:"Spinat liefert Eisen und Magnesium – ideal nach dem Training." },
];

const RECIPE_POOL = [
  { name:"Griechischer Lachs", emoji:"🐟", time:"20 Min", difficulty:"Mittel", tag:"Abendessen", kcal:480, protein:46, carbs:8, fat:22, ingredients:["200g Lachs","100g Quinoa","Feta","Gurke","Oliven"], shopping:["Lachsfilet 400g","Quinoa 500g","Fetakäse 200g","Gurke","Oliven Glas"], steps:["Quinoa kochen.","Lachs braten.","Salat zusammenstellen.","Anrichten."], tip:"Omega-3 aus Lachs fördert Muskelregeneration." },
  { name:"Mexikanische Hack Bowl", emoji:"🌮", time:"22 Min", difficulty:"Einfach", tag:"Mittagessen", kcal:620, protein:48, carbs:45, fat:18, ingredients:["250g Rinderhack","80g Reis","Kidneybohnen","Paprika"], shopping:["Rinderhack 500g","Reis 1kg","Kidneybohnen Dose","Paprika"], steps:["Reis kochen.","Hack braten.","Würzen.","Servieren."], tip:"Kidneybohnen stabilisieren den Blutzucker." },
  { name:"Post-Workout Reisbrei", emoji:"🍚", time:"10 Min", difficulty:"Einfach", tag:"Post-Workout", kcal:520, protein:38, carbs:72, fat:8, ingredients:["80g Reis","400ml Milch","Schokoprotein","Banane"], shopping:["Rundkornreis 1kg","Milch 1L","Whey Schokolade","Bananen"], steps:["Reis in Milch kochen.","Protein einrühren.","Mit Banane servieren."], tip:"Optimale Carb-Protein-Ratio nach dem Training." },
  { name:"Skyr Bowl", emoji:"🍓", time:"5 Min", difficulty:"Einfach", tag:"Frühstück", kcal:340, protein:34, carbs:38, fat:4, ingredients:["250g Skyr","Vanilleprotein","150g Beeren","Granola"], shopping:["Skyr 500g","Whey Vanille","Beeren TK 500g","Granola"], steps:["Skyr mit Protein rühren.","Beeren drauf.","Granola bestreuen."], tip:"Skyr hat doppelt so viel Protein wie normaler Joghurt." },
  { name:"Thai Garnelen Stir-Fry", emoji:"🍤", time:"15 Min", difficulty:"Mittel", tag:"Abendessen", kcal:390, protein:44, carbs:22, fat:12, ingredients:["200g Garnelen","Reisnudeln","Zucchini","Sojasoße"], shopping:["Garnelen TK 400g","Reisnudeln 500g","Zucchini","Sojasoße"], steps:["Nudeln zubereiten.","Gemüse stir-fry.","Garnelen dazu.","Würzen."], tip:"Garnelen: 85 kcal / 20g Protein." },
  { name:"Spinat Hähnchen Pasta", emoji:"🍝", time:"20 Min", difficulty:"Einfach", tag:"Abendessen", kcal:590, protein:50, carbs:55, fat:12, ingredients:["200g Hühnerbrust","Vollkorn-Penne","100g Spinat","Parmesan"], shopping:["Hühnerbrust 500g","Vollkorn-Penne 500g","Babyspinat 200g","Parmesan"], steps:["Pasta kochen.","Hähnchen braten.","Spinat unterheben.","Mit Parmesan servieren."], tip:"Vollkorn-Pasta hat 3x mehr Ballaststoffe." },
  { name:"Hähnchen Souvlaki", emoji:"🥙", time:"25 Min", difficulty:"Einfach", tag:"Mittagessen", kcal:510, protein:54, carbs:28, fat:14, ingredients:["250g Hühnerbrust","Pita","Tzatziki","Tomate"], shopping:["Hühnerbrust 500g","Vollkorn Pita 6er","Tzatziki 200g","Tomaten"], steps:["Hähnchen marinieren.","Grillen.","In Pita einwickeln."], tip:"Zitrusmarinade macht Fleisch zart ohne Kalorien." },
  { name:"Türkische Eier", emoji:"🍳", time:"12 Min", difficulty:"Einfach", tag:"Frühstück", kcal:380, protein:28, carbs:12, fat:24, ingredients:["3 Eier","200g Joghurt","Knoblauch","Paprikabutter"], shopping:["Eier 10er","Magerjoghurt 500g","Knoblauch","Paprikapulver"], steps:["Joghurt mit Knoblauch.","Eier pochieren.","Paprikabutter schmelzen.","Anrichten."], tip:"Eier + Joghurt = optimale Proteinsynthese." },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#050505;color:#f0f0f0;font-family:'Inter',sans-serif;min-height:100vh}
.app{max-width:480px;margin:0 auto;padding-bottom:80px}
.hdr{padding:32px 20px 0;display:flex;align-items:center;gap:12px}
.hdr-icon{width:44px;height:44px;background:linear-gradient(135deg,#00ff87,#00cc6a);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 20px #00ff8740}
.hdr-title{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:3px;background:linear-gradient(135deg,#fff 40%,#00ff87);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hdr-sub{font-size:11px;color:#333;margin-top:2px;letter-spacing:.5px}
.tabs{display:flex;margin:24px 20px 0;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;padding:5px;gap:5px}
.tab{flex:1;padding:11px 4px;border:none;background:transparent;color:#444;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;border-radius:12px;cursor:pointer;transition:all .25s;letter-spacing:.3px}
.tab.on{background:linear-gradient(135deg,#00ff87,#00cc6a);color:#000;box-shadow:0 4px 16px #00ff8750}
.sec{padding:0 20px;margin-top:24px}
.section-label{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#333;font-weight:700;margin-bottom:14px}
.upload-box{border:2px dashed #1e1e1e;border-radius:24px;padding:40px 20px;display:flex;flex-direction:column;align-items:center;gap:12px;cursor:pointer;transition:all .3s;background:linear-gradient(135deg,#0d0d0d,#111);position:relative;overflow:hidden}
.upload-box:hover,.upload-box.drag{border-color:#00ff87;box-shadow:0 0 40px #00ff8715}
.upload-box.filled{padding:0;border-style:solid;border-color:#00ff87}
.upload-img{width:100%;border-radius:22px;display:block;max-height:280px;object-fit:cover}
.upload-badge{position:absolute;bottom:14px;right:14px;background:rgba(0,0,0,.85);backdrop-filter:blur(10px);padding:6px 14px;border-radius:20px;font-size:11px;color:#00ff87;font-weight:700;border:1px solid #00ff8740;letter-spacing:.5px}
.upload-icon{font-size:52px;opacity:.15}
.upload-lbl{font-size:16px;font-weight:600;color:#666}
.upload-sub{font-size:12px;color:#222;text-align:center}
.cam-btn{width:100%;margin-top:12px;background:transparent;border:1px solid #1a1a1a;border-radius:16px;padding:14px;color:#444;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s}
.cam-btn:hover{border-color:#333;color:#777}
.go-btn{width:100%;margin-top:16px;background:linear-gradient(135deg,#00ff87,#00cc6a);color:#000;border:none;border-radius:18px;padding:20px;font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:3px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;box-shadow:0 8px 32px #00ff8740}
.go-btn:hover:not([disabled]){transform:translateY(-2px);box-shadow:0 12px 40px #00ff8760}
.go-btn[disabled]{opacity:.25;cursor:not-allowed;box-shadow:none}
.reset-btn{width:100%;margin-top:10px;background:transparent;border:1px solid #1a1a1a;border-radius:14px;padding:13px;color:#333;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
.reset-btn:hover{border-color:#333;color:#666}
.loading{margin-top:24px;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:24px;padding:40px 20px;display:flex;flex-direction:column;align-items:center;gap:16px}
.spinner{width:48px;height:48px;border:3px solid #1a1a1a;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite}
.spinner-sm{width:16px;height:16px;border:2px solid #1a1a1a;border-top-color:#00ff87;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-txt{font-size:14px;color:#444;text-align:center;line-height:1.7}
.loading-txt strong{color:#00ff87;display:block;font-size:16px;margin-bottom:4px}
.err-box{margin-top:16px;background:#120808;border:1px solid #2a1010;border-radius:16px;padding:16px 18px;color:#ff6b6b;font-size:13px;line-height:1.5}
.recipe-card{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:24px;overflow:hidden;margin-top:20px;animation:fadeUp .4s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.rc-hero{position:relative;height:200px;overflow:hidden}
.rc-hero img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s}
.rc-hero:hover img{transform:scale(1.05)}
.rc-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.1) 60%,transparent 100%)}
.rc-hero-content{position:absolute;bottom:0;left:0;right:0;padding:16px 20px}
.rc-tag{display:inline-flex;align-items:center;gap:5px;background:rgba(0,255,135,.15);border:1px solid #00ff8440;border-radius:20px;padding:4px 12px;font-size:11px;color:#00ff87;font-weight:700;letter-spacing:.5px;margin-bottom:8px;backdrop-filter:blur(8px)}
.rc-name{font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:1px;line-height:1;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.5)}
.rc-meta{display:flex;gap:14px;margin-top:6px}
.rc-meta span{font-size:12px;color:rgba(255,255,255,.5)}
.macro-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#1a1a1a}
.macro-cell{background:#0a0a0a;padding:16px 8px;display:flex;flex-direction:column;align-items:center;gap:4px}
.macro-val{font-family:'Bebas Neue',sans-serif;font-size:28px;background:linear-gradient(135deg,#00ff87,#00cc6a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.macro-lbl{font-size:9px;color:#333;letter-spacing:2px;text-transform:uppercase;font-weight:600}
.rc-body{padding:22px}
.lbl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#333;font-weight:700;margin-bottom:12px}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:20px}
.chip{background:#111;border:1px solid #1e1e1e;border-radius:20px;padding:6px 13px;font-size:12px;color:#666;transition:all .2s}
.chip:hover{border-color:#00ff8440;color:#00ff87}
.step-row{display:flex;gap:14px;margin-bottom:16px;align-items:flex-start}
.step-n{width:28px;height:28px;background:#0a1a0f;border:1px solid #00ff8330;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#00ff87;flex-shrink:0;margin-top:1px}
.step-t{font-size:13px;color:#777;line-height:1.65}
.tip-box{background:linear-gradient(135deg,#0a1a0f,#0f200f);border:1px solid #00ff8225;border-radius:14px;padding:14px 16px;display:flex;gap:12px;margin-top:6px}
.tip-box p{font-size:12px;color:#7aff9e;line-height:1.6}
.shop-card{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;padding:18px;margin-top:14px;animation:fadeUp .4s ease .1s both}
.shop-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.shop-lbl{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#00ff87;font-weight:700}
.shop-progress{height:3px;background:#1a1a1a;border-radius:2px;margin-bottom:14px;overflow:hidden}
.shop-bar{height:100%;background:linear-gradient(90deg,#00ff87,#00cc6a);border-radius:2px;transition:width .3s ease}
.shop-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #111;cursor:pointer;transition:padding .15s}
.shop-item:last-child{border-bottom:none}
.shop-item:hover{padding-left:4px}
.shop-check{width:20px;height:20px;border:1.5px solid #2a2a2a;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .2s;color:#000;font-weight:800}
.shop-check.on{background:linear-gradient(135deg,#00ff87,#00cc6a);border-color:#00ff87;box-shadow:0 2px 8px #00ff8740}
.shop-name{font-size:13px;color:#777;flex:1;transition:all .2s}
.shop-name.done{text-decoration:line-through;color:#2a2a2a}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.tile{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:20px;cursor:pointer;transition:all .25s;overflow:hidden}
.tile:hover,.tile.on{border-color:#00ff87;box-shadow:0 4px 24px #00ff8720;transform:translateY(-2px)}
.tile.on{background:#0a1a0f}
.tile-img{width:100%;height:110px;object-fit:cover;display:block;transition:transform .4s}
.tile:hover .tile-img,.tile.on .tile-img{transform:scale(1.07)}
.tile-body{padding:12px}
.tile-name{font-family:'Bebas Neue',sans-serif;font-size:16px;color:#fff;line-height:1.1;margin-bottom:3px}
.tile-meta{font-size:11px;color:#444}
.tile-tag{display:inline-block;background:#0f1f14;border:1px solid #00ff8220;border-radius:6px;padding:2px 8px;font-size:10px;color:#00ff87;font-weight:700;margin-top:7px;letter-spacing:.3px}
.ai-gen-btn{width:100%;margin-top:16px;background:transparent;border:1px solid #1e1e1e;border-radius:16px;padding:16px;color:#00ff87;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .25s;letter-spacing:.3px}
.ai-gen-btn:hover:not([disabled]){border-color:#00ff8660;background:#0a1a0f;box-shadow:0 4px 20px #00ff8715}
.ai-gen-btn[disabled]{opacity:.3;cursor:not-allowed}
.ai-list{margin-top:14px;display:flex;flex-direction:column;gap:10px}
.ai-row{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:18px;cursor:pointer;transition:all .25s;overflow:hidden}
.ai-row:hover,.ai-row.on{border-color:#00ff87;box-shadow:0 4px 20px #00ff8720;transform:translateY(-1px)}
.ai-row.on{background:#0a1a0f}
.ai-row-inner{display:flex;align-items:center}
.ai-row-img{width:80px;height:80px;object-fit:cover;flex-shrink:0}
.ai-row-info{flex:1;padding:12px 14px}
.ai-name{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#fff;line-height:1}
.ai-sub{font-size:11px;color:#444;margin-top:2px}
.ai-prot{font-size:12px;color:#00ff87;font-weight:600;margin-top:5px}
.chevron{color:#2a2a2a;font-size:12px;padding-right:14px;transition:transform .25s}
.ai-row.on .chevron{transform:rotate(180deg);color:#00ff87}
`;

async function callAPI(body) {
  const res = await fetch('/api/claude', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  const data = await res.json();
  if(!res.ok||data.error) throw new Error(data.error?.message||'API error');
  return data.content?.[0]?.text||'';
}

function parseMacros(t) {
  const n = rx => t.match(rx)?.[1]??'—';
  return { cal:n(/(\d+)\s*kcal/i), prot:n(/Protein[:\s]+(\d+)/i)!=='—'?n(/Protein[:\s]+(\d+)/i):n(/(\d+)\s*g\s*Protein/i), carbs:n(/Kohlenhydrate[:\s]+(\d+)/i)!=='—'?n(/Kohlenhydrate[:\s]+(\d+)/i):n(/(\d+)\s*g\s*Carbs/i), fat:n(/Fett[:\s]+(\d+)/i)!=='—'?n(/Fett[:\s]+(\d+)/i):n(/(\d+)\s*g\s*Fett/i) };
}

function parseRecipe(raw) {
  const lines=raw.split('\n').map(l=>l.trim()).filter(Boolean);
  let name='',ing=[],steps=[],tip='',shopping=[],time='~20 Min',diff='Einfach',mode=null;
  for(const l of lines){
    const lo=l.toLowerCase();
    if(/^#+/.test(l)){const cl=l.replace(/^#+\s*/,'');if(!name&&cl.length<70&&!lo.includes('zutat')&&!lo.includes('zubereitung')&&!lo.includes('einkauf')&&!lo.includes('tipp')){name=cl;continue;}}
    if(lo.includes('einkauf')){mode='shop';continue;}
    if(lo.includes('zutat')){mode='ing';continue;}
    if(lo.includes('zubereitung')||lo.includes('schritt')){mode='steps';continue;}
    if(lo.includes('tipp')){mode='tip';continue;}
    if(lo.match(/zeit[:\s]/)){time=l.replace(/.*?:/,'').trim();continue;}
    if(lo.match(/schwierig/)){diff=l.replace(/.*?:/,'').trim();continue;}
    if(!name&&l.length<70&&!/^[-*•\d]/.test(l)){name=l;continue;}
    const cl=l.replace(/^[-*•]\s*/,'').replace(/^\d+[.)]\s*/,'');
    if(mode==='ing')ing.push(cl);
    else if(mode==='shop')shopping.push(cl);
    else if(mode==='steps')steps.push(cl);
    else if(mode==='tip')tip+=' '+cl;
  }
  return{name:name||'Fitness Rezept',ingredients:ing,steps,tip:tip.trim(),shopping,time,difficulty:diff,macros:parseMacros(raw)};
}

function RecipeView({r}) {
  const [checked,setChecked]=useState({});
  const [heroImg,setHeroImg]=useState(FALLBACK_IMG);
  const list=r.shopping?.length?r.shopping:r.ingredients;
  const toggle=i=>setChecked(p=>({...p,[i]:!p[i]}));
  const done=Object.values(checked).filter(Boolean).length;
  
  useEffect(()=>{
    const query=toEnglishQuery(r.name,r.tag||"");
    fetchUnsplashImage(query).then(url=>setHeroImg(url));
  },[r.name]);
  return (
    <>
      <div className="recipe-card">
        <div className="rc-hero">
          <img src={heroImg} alt={r.name} loading="lazy"/>
          <div className="rc-hero-overlay"/>
          <div className="rc-hero-content">
            <div className="rc-tag">💪 {r.tag||'Fitness Rezept'}</div>
            <div className="rc-name">{r.emoji||''} {r.name}</div>
            <div className="rc-meta"><span>⏱ {r.time}</span><span>📊 {r.difficulty}</span></div>
          </div>
        </div>
        <div className="macro-grid">
          {[['cal','Kalorien'],['prot','Protein'],['carbs','Carbs'],['fat','Fett']].map(([k,l])=>(
            <div className="macro-cell" key={k}>
              <div className="macro-val">{r.macros[k]}{k!=='cal'&&r.macros[k]!=='—'?'g':''}</div>
              <div className="macro-lbl">{l}</div>
            </div>
          ))}
        </div>
        <div className="rc-body">
          {r.ingredients.length>0&&<><div className="lbl">Zutaten</div><div className="chips">{r.ingredients.map((x,i)=><span className="chip" key={i}>{x}</span>)}</div></>}
          {r.steps.length>0&&<><div className="lbl">Zubereitung</div>{r.steps.map((s,i)=><div className="step-row" key={i}><div className="step-n">{i+1}</div><div className="step-t">{s}</div></div>)}</>}
          {r.tip&&<div className="tip-box"><span style={{fontSize:18}}>💪</span><p>{r.tip}</p></div>}
        </div>
      </div>
      {list.length>0&&(
        <div className="shop-card">
          <div className="shop-hdr"><div className="shop-lbl">🛒 Einkaufsliste</div><span style={{fontSize:11,color:'#333'}}>{done}/{list.length}</span></div>
          <div className="shop-progress"><div className="shop-bar" style={{width:`${list.length?done/list.length*100:0}%`}}/></div>
          {list.map((item,i)=>(
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

export default function RecipeTile({r, isOn, onClick}) {
  const [tileImg,setTileImg]=useState(FALLBACK_IMG);
  useEffect(()=>{
    const query=toEnglishQuery(r.name,r.tag||"");
    fetchUnsplashImage(query).then(url=>setTileImg(url));
  },[r.name]);
  return(
    <div className={`tile${isOn?' on':''}`} onClick={onClick}>
      <img className="tile-img" src={tileImg} alt={r.name} loading="lazy"/>
      <div className="tile-body">
        <div className="tile-name">{r.name}</div>
        <div className="tile-meta">⏱ {r.time} · 💪 {r.macros?.prot||r.protein}g</div>
        <div className="tile-tag">{r.tag}</div>
      </div>
    </div>
  );
}

function AiRow({r, isOn, onClick}) {
  const [rowImg,setRowImg]=useState(FALLBACK_IMG);
  useEffect(()=>{
    const query=toEnglishQuery(r.name,r.tag||"");
    fetchUnsplashImage(query).then(url=>setRowImg(url));
  },[r.name]);
  return(
    <div className={`ai-row${isOn?' on':''}`} onClick={onClick}>
      <div className="ai-row-inner">
        <img className="ai-row-img" src={rowImg} alt={r.name} loading="lazy"/>
        <div className="ai-row-info">
          <div className="ai-name">{r.emoji||'🥗'} {r.name}</div>
          <div className="ai-sub">⏱ {r.time} · {r.tag}</div>
          <div className="ai-prot">💪 {r.macros.prot}g Protein · {r.macros.cal} kcal</div>
        </div>
        <span className="chevron">▼</span>
      </div>
    </div>
  );
}

function App() {
  const [tab,setTab]=useState('scan');
  const [img,setImg]=useState(null);
  const [b64,setB64]=useState(null);
  const [loading,setLoading]=useState(false);
  const [loadStep,setLoadStep]=useState('');
  const [scanResult,setScanResult]=useState(null);
  const [scanErr,setScanErr]=useState(null);
  const [drag,setDrag]=useState(false);
  const [selFixed,setSelFixed]=useState(null);
  const [aiRecipes,setAiRecipes]=useState([]);
  const [aiLoading,setAiLoading]=useState(false);
  const [selAi,setSelAi]=useState(null);
  const fileRef=useRef();
  const camRef=useRef();

  const loadFile=f=>{
    if(!f?.type.startsWith('image/'))return;
    setImg(URL.createObjectURL(f));setScanResult(null);setScanErr(null);
    const reader=new FileReader();
    reader.onload=e=>{
      const image=new Image();
      image.onload=()=>{
        const MAX=1024;let w=image.width,h=image.height;
        if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX;}else{w=Math.round(w*MAX/h);h=MAX;}}
        const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(image,0,0,w,h);
        setB64(canvas.toDataURL('image/jpeg',0.75).split(',')[1]);
      };
      image.src=e.target.result;
    };
    reader.readAsDataURL(f);
  };

  const doScan=async()=>{
    if(!b64)return;
    setLoading(true);setScanErr(null);setScanResult(null);
    try{
      setLoadStep('Bild wird analysiert…');
      const text=await callAPI({model:'claude-haiku-4-5-20251001',max_tokens:1400,system:'Du bist ein Fitness-Koch. Antworte auf Deutsch. Format:\n# Rezeptname\nZeit: X Min\nSchwierigkeit: Einfach\nX kcal | Protein: Xg | Kohlenhydrate: Xg | Fett: Xg\n## Zutaten\n- ...\n## Einkaufsliste\n- ...\n## Zubereitung\n1. ...\n## Tipp\n...',messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:b64}},{type:'text',text:'Erkenne alle Lebensmittel und erstelle ein Fitness-Rezept.'}]}]});
      setLoadStep('Rezept wird aufbereitet…');
      const recipe=parseRecipe(text);recipe.tag='Aus deinem Kühlschrank';setScanResult(recipe);
    }catch(e){setScanErr('Fehler: '+e.message);}
    finally{setLoading(false);setLoadStep('');}
  };

  const genAiRecipes=async()=>{
    setAiLoading(true);setAiRecipes([]);setSelAi(null);
    try{
      const themes=['mediterran','asiatisch','mexikanisch','low-carb','vegetarisch','high-carb','nordisch'];
      const theme=themes[Math.floor(Math.random()*themes.length)];
      const text=await callAPI({model:'claude-haiku-4-5-20251001',max_tokens:2000,messages:[{role:'user',content:'Erstelle 4 '+theme+'e Fitness-Rezepte. NUR JSON: [{name,emoji,time,difficulty,tag,kcal,protein,carbs,fat,ingredients:[],shopping:[],steps:[],tip}]. Tags:Fruehstueck,Mittagessen,Abendessen,Post-Workout. Seed:'+Date.now()}]});
      const a=text.indexOf('['),b=text.lastIndexOf(']');
      if(a===-1||b===-1)throw new Error('kein JSON');
      const parsed=JSON.parse(text.slice(a,b+1));
      setAiRecipes(parsed.map(r=>({...r,ingredients:r.ingredients||[],shopping:r.shopping||r.ingredients||[],steps:r.steps||[],tip:r.tip||'',macros:{cal:String(r.kcal||'—'),prot:String(r.protein||'—'),carbs:String(r.carbs||'—'),fat:String(r.fat||'—')}})));
    }catch(e){
      const shuffled=[...RECIPE_POOL].sort(()=>Math.random()-.5).slice(0,4);
      setAiRecipes(shuffled.map(r=>({...r,ingredients:r.ingredients||[],shopping:r.shopping||[],steps:r.steps||[],tip:r.tip||'',macros:{cal:String(r.kcal),prot:String(r.protein),carbs:String(r.carbs),fat:String(r.fat)}})));
    }finally{setAiLoading(false);}
  };

  return(
    <>
      <style>{css}</style>
      <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])}/>
      <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])}/>
      <div className="app">
        <div className="hdr">
          <div className="hdr-icon">🥗</div>
          <div><div className="hdr-title">FRIDGECOACH</div><div className="hdr-sub">KI-POWERED FITNESS REZEPTE</div></div>
        </div>
        <div className="tabs">
          <button className={`tab${tab==='scan'?' on':''}`} onClick={()=>setTab('scan')}>📸 Kühlschrank scannen</button>
          <button className={`tab${tab==='samples'?' on':''}`} onClick={()=>setTab('samples')}>🍽 Beispiel-Rezepte</button>
        </div>

        {tab==='scan'&&(
          <div className="sec">
            <div className={`upload-box${img?' filled':''}${drag?' drag':''}`}
              onClick={()=>!img&&fileRef.current.click()}
              onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0])}}>
              {img?<><img src={img} className="upload-img" alt="Kühlschrank"/><div className="upload-badge">✓ FOTO GELADEN</div></>
                :<><div className="upload-icon">🧊</div><div className="upload-lbl">Kühlschrank-Foto hochladen</div><div className="upload-sub">Tippe zum Auswählen · JPG, PNG</div></>}
            </div>
            {!img&&<button className="cam-btn" onClick={()=>camRef.current.click()}>📷 &nbsp;Kamera öffnen</button>}
            {img&&!loading&&<>
              <button className="go-btn" onClick={doScan} disabled={!b64}>⚡ REZEPT GENERIEREN</button>
              <button className="reset-btn" onClick={()=>{setImg(null);setB64(null);setScanResult(null);setScanErr(null)}}>↩ Neues Foto wählen</button>
            </>}
            {loading&&<div className="loading"><div className="spinner"/><div className="loading-txt"><strong>{loadStep}</strong>KI analysiert deine Zutaten…</div></div>}
            {scanErr&&<div className="err-box">⚠️ {scanErr}</div>}
            {scanResult&&<RecipeView r={scanResult}/>}
          </div>
        )}

        {tab==='samples'&&(
          <div className="sec">
            <div className="section-label">Klassiker</div>
            <div className="grid2">
              {FIXED_RECIPES.map((r,i)=>(
                <RecipeTile key={r.id} r={r} isOn={selFixed===i} onClick={()=>{setSelFixed(selFixed===i?null:i);setSelAi(null)}}/>
              ))}
            </div>
            {selFixed!==null&&selAi===null&&<RecipeView r={FIXED_RECIPES[selFixed]}/>}
            <div style={{marginTop:28}}>
              <div className="section-label">KI-generiert</div>
              <button className="ai-gen-btn" onClick={genAiRecipes} disabled={aiLoading}>
                {aiLoading?<><span className="spinner-sm"/> Generiere…</>:'✨  Neue Rezepte von KI generieren'}
              </button>
              {aiLoading&&<div className="loading" style={{marginTop:14}}><div className="spinner"/><div className="loading-txt"><strong>KI erstellt Rezepte…</strong></div></div>}
              {aiRecipes.length>0&&(
                <div className="ai-list">
                  {aiRecipes.map((r,i)=>(
                    <AiRow key={i} r={r} isOn={selAi===i} onClick={()=>{setSelAi(selAi===i?null:i);setSelFixed(null)}}/>
                  ))}
                </div>
              )}
              {selAi!==null&&<RecipeView r={aiRecipes[selAi]}/>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
