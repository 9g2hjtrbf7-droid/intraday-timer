import { useState, useEffect, useRef } from "react";

// ── COLORS ────────────────────────────────────────────────────────────────────
const C = {
  bg:"#f4f1eb", ink:"#18150f", sur:"#fdfaf4", bor:"#d8d3c8",
  warn:"#d95f02", buy:"#1b7f3a", sell:"#c0392b", mut:"#7a7260", crm:"#ede8dc",
  accent:"#0f6cbd"
};
const ACOL = { buy:C.buy, avoid:C.sell, ok:"#b0a890" };
const HOURS  = ["9:30","10:30","11:30","12:30","13:30","14:30","15:30"];
const HLBLS  = ["Open","10h","11h","12h","13h","14h","15h"];
const AXLBLS = ["9:30","10:30","11:30","12:30","13:30","14:30","15:30","16:00"];
const PAL    = ["#18150f","#0f6cbd","#1b7f3a","#d95f02","#7c3aed","#c0392b","#0891b2","#b45309","#374151","#065f46"];

const CATEGORIES = {
  "Tech": ["MSFT","GOOGL","META","AMZN","ORCL","ADBE","CRM","IBM"],
  "Semis": ["MU","AVGO","PLTR"],
  "Fintech": ["MA","NU","HOOD","UBER"],
  "eComm/Consumo": ["MELI","NKE","KO","MCD","PG","NFLX"],
  "Energía": ["VST","OKLO","COPX"],
  "ETFs": ["GLD","IWM"],
  "Otros": ["BNG"],
};

// ── KNOWN TICKERS ─────────────────────────────────────────────────────────────
const KNOWN = {
  AAPL:{desc:"Apple Inc.",beta:1.05,liq:"alta",sector:"tech",avgVol:70},
  GOOG:{desc:"Alphabet Inc.",beta:1.08,liq:"alta",sector:"tech",avgVol:22},
  GOOGL:{desc:"Alphabet Inc. (Class A)",beta:1.08,liq:"alta",sector:"tech",avgVol:20},
  AMZN:{desc:"Amazon.com Inc.",beta:1.18,liq:"alta",sector:"tech",avgVol:45},
  NVDA:{desc:"NVIDIA Corporation",beta:1.65,liq:"alta",sector:"semiconductors",avgVol:280},
  TSLA:{desc:"Tesla Inc.",beta:1.85,liq:"alta",sector:"ev",avgVol:120},
  META:{desc:"Meta Platforms",beta:1.22,liq:"alta",sector:"tech",avgVol:18},
  NFLX:{desc:"Netflix Inc.",beta:1.30,liq:"media",sector:"streaming",avgVol:4},
  AMD:{desc:"Advanced Micro Devices",beta:1.70,liq:"media",sector:"semiconductors",avgVol:55},
  INTC:{desc:"Intel Corporation",beta:0.85,liq:"alta",sector:"semiconductors",avgVol:35},
  PYPL:{desc:"PayPal Holdings",beta:1.40,liq:"media",sector:"fintech",avgVol:12},
  SQ:{desc:"Block Inc.",beta:1.75,liq:"media",sector:"fintech",avgVol:6},
  COIN:{desc:"Coinbase Global",beta:2.20,liq:"media",sector:"crypto",avgVol:14},
  MARA:{desc:"Marathon Digital Holdings",beta:2.80,liq:"baja",sector:"crypto",avgVol:40},
  GME:{desc:"GameStop Corp.",beta:2.50,liq:"baja",sector:"retail",avgVol:8},
  AMC:{desc:"AMC Entertainment",beta:2.40,liq:"baja",sector:"entertainment",avgVol:10},
  SPY:{desc:"SPDR S&P 500 ETF",beta:1.00,liq:"altísima",sector:"etf",avgVol:80},
  QQQ:{desc:"Invesco QQQ Trust",beta:1.10,liq:"altísima",sector:"etf",avgVol:45},
  DIS:{desc:"Walt Disney Company",beta:0.95,liq:"alta",sector:"entertainment",avgVol:9},
  BA:{desc:"Boeing Company",beta:1.15,liq:"alta",sector:"aerospace",avgVol:6},
  JPM:{desc:"JPMorgan Chase",beta:1.05,liq:"alta",sector:"banking",avgVol:10},
  GS:{desc:"Goldman Sachs",beta:1.20,liq:"alta",sector:"banking",avgVol:3},
  V:{desc:"Visa Inc.",beta:0.90,liq:"alta",sector:"fintech",avgVol:6},
  SHOP:{desc:"Shopify Inc.",beta:1.60,liq:"media",sector:"ecommerce",avgVol:8},
  PLTR:{desc:"Palantir Technologies",beta:1.90,liq:"media",sector:"software",avgVol:55},
  SNAP:{desc:"Snap Inc.",beta:1.80,liq:"media",sector:"social",avgVol:25},
  RIVN:{desc:"Rivian Automotive",beta:1.95,liq:"media",sector:"ev",avgVol:20},
  F:{desc:"Ford Motor Company",beta:1.10,liq:"alta",sector:"auto",avgVol:55},
  GM:{desc:"General Motors",beta:1.05,liq:"alta",sector:"auto",avgVol:12},
  MSFT:{desc:"Microsoft Corporation",beta:0.98,liq:"altísima",sector:"tech",avgVol:22},
  UBER:{desc:"Uber Technologies",beta:1.42,liq:"alta",sector:"rideshare",avgVol:18},
  HOOD:{desc:"Robinhood Markets",beta:2.10,liq:"media",sector:"fintech",avgVol:25},
  // ── NEW TICKERS ──────────────────────────────────────────────────────────────
  GOOGL:{desc:"Alphabet Inc. (Class A)",beta:1.08,liq:"alta",sector:"tech",avgVol:20},
  COPX:{desc:"Global X Copper Miners ETF",beta:1.25,liq:"media",sector:"etf",avgVol:3},
  MELI:{desc:"MercadoLibre Inc.",beta:1.55,liq:"media",sector:"ecommerce",avgVol:3},
  OKLO:{desc:"Oklo Inc. (Nuclear Energy)",beta:2.40,liq:"baja",sector:"energy",avgVol:12},
  NU:{desc:"Nu Holdings (Nubank)",beta:1.85,liq:"media",sector:"fintech",avgVol:30},
  ORCL:{desc:"Oracle Corporation",beta:1.05,liq:"alta",sector:"tech",avgVol:8},
  MU:{desc:"Micron Technology",beta:1.60,liq:"alta",sector:"semiconductors",avgVol:22},
  GLD:{desc:"SPDR Gold Shares ETF",beta:0.10,liq:"altísima",sector:"etf",avgVol:12},
  KO:{desc:"The Coca-Cola Company",beta:0.55,liq:"alta",sector:"consumer",avgVol:12},
  MCD:{desc:"McDonald's Corporation",beta:0.70,liq:"alta",sector:"consumer",avgVol:4},
  ADBE:{desc:"Adobe Inc.",beta:1.30,liq:"alta",sector:"tech",avgVol:4},
  CRM:{desc:"Salesforce Inc.",beta:1.25,liq:"alta",sector:"tech",avgVol:5},
  MA:{desc:"Mastercard Inc.",beta:1.05,liq:"alta",sector:"fintech",avgVol:4},
  BNG:{desc:"BNG (activo genérico)",beta:1.20,liq:"media",sector:"general",avgVol:5},
  NKE:{desc:"Nike Inc.",beta:1.05,liq:"alta",sector:"consumer",avgVol:7},
  NFLX:{desc:"Netflix Inc.",beta:1.30,liq:"media",sector:"streaming",avgVol:4},
  META:{desc:"Meta Platforms Inc.",beta:1.22,liq:"alta",sector:"tech",avgVol:18},
  IBM:{desc:"International Business Machines",beta:0.75,liq:"alta",sector:"tech",avgVol:5},
  PG:{desc:"Procter & Gamble Co.",beta:0.50,liq:"alta",sector:"consumer",avgVol:7},
  IWM:{desc:"iShares Russell 2000 ETF",beta:1.15,liq:"altísima",sector:"etf",avgVol:40},
  PLTR:{desc:"Palantir Technologies",beta:1.90,liq:"media",sector:"software",avgVol:55},
  AVGO:{desc:"Broadcom Inc.",beta:1.20,liq:"alta",sector:"semiconductors",avgVol:18},
  AMZN:{desc:"Amazon.com Inc.",beta:1.18,liq:"alta",sector:"tech",avgVol:45},
  VST:{desc:"Vistra Corp. (Energy)",beta:1.80,liq:"media",sector:"energy",avgVol:8},
};

// ── PROFILE GENERATOR ─────────────────────────────────────────────────────────
function generateProfile(symbol, customName) {
  const k = KNOWN[symbol];
  const beta   = k ? k.beta   : 1.0 + (symbol.split("").reduce((a,c)=>a+c.charCodeAt(0),0) % 20) * 0.08;
  const liq    = k ? k.liq    : beta < 1.2 ? "alta" : beta < 1.7 ? "media" : "baja";
  const sector = k ? k.sector : "general";
  const avgVol = k ? k.avgVol : Math.round(5 + (symbol.charCodeAt(0) % 10) * 4);
  const desc   = customName || (k ? k.desc : `${symbol} Inc.`);

  const isHighBeta = beta >= 1.6;
  const isLowLiq   = liq === "baja";
  const isETF      = sector === "etf";
  const isCrypto   = sector === "crypto";

  let scores, actions;
  if (isETF)                          { scores=[38,68,82,58,65,75,42]; actions=["avoid","buy","buy","ok","ok","buy","avoid"]; }
  else if (isCrypto||(isHighBeta&&isLowLiq)) { scores=[60,82,58,35,55,78,72]; actions=["ok","buy","ok","avoid","ok","buy","buy"]; }
  else if (isHighBeta)                { scores=[48,75,65,42,58,72,55]; actions=["ok","buy","ok","avoid","ok","buy","ok"]; }
  else                                { scores=[32,70,85,55,62,72,40]; actions=["avoid","buy","buy","ok","ok","buy","avoid"]; }

  const sb  = isLowLiq ? 0.10 : liq==="altísima" ? 0.01 : liq==="alta" ? 0.03 : 0.06;
  const sp  = v => `${(sb*v).toFixed(2)}–${(sb*v*1.6).toFixed(2)}%`;
  const volO = isHighBeta ? "390%" : "280%";
  const volC = isHighBeta ? "320%" : "240%";

  const patterns = [
    {time:"9:30–10:00", window:"Apertura",     pattern:isHighBeta?"Volatilidad extrema":"Alta volatilidad post-open",    action:actions[0], vol:volO,   spread:sp(3.5), reason:isLowLiq?"Spreads amplios en activos de baja liquidez. ±3% en minutos.":isETF?"Arbitraje apertura con el NAV.":"Institucionales colocan masivas → precio errático."},
    {time:"10:00–11:00",window:"Estabilización",pattern:"Precio busca nivel post-apertura",                               action:actions[1], vol:"180%",  spread:sp(1.2), reason:isETF?"Convergencia al NAV. Spread estrecho.":"Volatilidad se normaliza. Primera señal técnica confiable."},
    {time:"11:00–12:30",window:"Media mañana",  pattern:"Tendencia intradiaria más limpia",                                action:actions[2], vol:"95%",   spread:sp(1.0), reason:isHighBeta?"Menor ruido relativo. Aprovechar con stops.":"Mejor ratio señal/ruido del día."},
    {time:"12:30–14:00",window:"Almuerzo NY",   pattern:isLowLiq?"Trampa de liquidez":"Volumen mínimo del día",          action:actions[3], vol:"50%",   spread:sp(2.5), reason:isLowLiq?"Volumen mínimo crítico. Una orden mueve ±1%.":"Mercado en pausa. Movimientos sin convicción."},
    {time:"14:00–15:00",window:"Tarde",          pattern:"Reactivación post-cierre Europa",                                action:actions[4], vol:"120%",  spread:sp(1.3), reason:"Cierre de mercados europeos reactiva flujos. Segundo movimiento técnico del día."},
    {time:"15:00–15:30",window:"Power hour",     pattern:"Aceleración de volumen final",                                  action:actions[5], vol:"205%",  spread:sp(1.1), reason:isETF?"Rebalanceos de fondos indexados al cierre.":"Alta participación institucional. Tendencia neta predecible."},
    {time:"15:30–16:00",window:"Cierre",         pattern:"Rebalanceos y MOC orders",                                      action:actions[6], vol:volC,    spread:sp(2.8), reason:isLowLiq?"Spreads máximos al cierre.":"MOC orders y rebalanceos de ETFs → impredecible."},
  ];

  const etL    = ["9:30–10:00 ET","10:00–11:00 ET","11:00–12:30 ET","12:30–14:00 ET","14:00–15:00 ET","15:00–15:30 ET","15:30–16:00 ET"];
  const bestI  = scores.indexOf(Math.max(...scores));
  const worstI = scores.indexOf(Math.min(...scores));
  const spdMid = liq==="altísima" ? "0.01%" : `${(sb*1.2).toFixed(2)}%`;
  const bestDay= isHighBeta ? "Lunes / Viernes" : isETF ? "Cualquier día" : "Martes / Jueves";

  return {
    desc, scores, actions, patterns, beta, liq, avgVol,
    bestWindow:etL[bestI],   bestReason:patterns[bestI].reason,
    worstWindow:etL[worstI], worstReason:patterns[worstI].reason,
    metrics:[
      {label:"Spread medio",      val:spdMid,           sub:`Liquidez ${liq}`},
      {label:"Mejor día",         val:bestDay,          sub:"Históricamente"},
      {label:"Beta intradiaria",  val:beta.toFixed(2),  sub:"vs S&P 500"},
    ]
  };
}

// ── DAILY TREND ENGINE ────────────────────────────────────────────────────────
// Simulates a realistic intraday session using beta, liq, vol and time-of-day
function computeDailyTrend(ticker, et) {
  const t      = ticker;
  const slot   = getSlotRaw(et);
  const tod    = et.getHours()*60 + et.getMinutes();
  const isOpen = et.getDay()>=1 && et.getDay()<=5 && tod>=570 && tod<960;

  if (!isOpen) return null;

  // Seeded random per day so values stay stable during the session
  const seed = et.getFullYear()*10000 + (et.getMonth()+1)*100 + et.getDate()
             + ticker.desc.length * 37;
  const rng  = (salt=0) => { let x = Math.sin(seed+salt)*43758.5453; return x - Math.floor(x); };

  // Day-level sentiment: -1 bearish → +1 bullish
  const daySentiment = (rng(1)*2 - 1).toFixed(2)*1; // -1 to +1

  // Volume ratio: how today's vol compares to average (0.4x to 2.5x)
  const volRatio = 0.4 + rng(2) * 2.1;

  // Price drift during session (based on beta and sentiment)
  const priceDrift = daySentiment * t.beta * (0.5 + rng(3)*1.5); // % change

  // Time-of-day volume multiplier (matches intraday patterns)
  const slotVolMults = [3.2, 1.6, 0.9, 0.5, 1.1, 1.9, 2.4];
  const curVolMult   = slot >= 0 ? slotVolMults[slot] : 1.0;
  const curVol       = t.avgVol * volRatio * curVolMult;

  // Liquidity score 0-100 based on liq tier and volume
  const liqBase = t.liq==="altísima"?92 : t.liq==="alta"?74 : t.liq==="media"?50 : 28;
  const liqScore = Math.min(100, Math.max(0, liqBase + (volRatio-1)*15 + rng(4)*10 - 5));

  // Intraday score factors:
  const slotScore    = slot>=0 ? t.scores[slot] : 50;
  const slotAction   = slot>=0 ? t.actions[slot] : "ok";
  const trendFactor  = daySentiment * 25;            // -25 to +25
  const volFactor    = volRatio > 1.3 ? 10 : volRatio < 0.7 ? -10 : 0;
  const liqFactor    = liqScore > 70 ? 8 : liqScore < 40 ? -12 : 0;
  const slotFactor   = slotAction==="buy" ? 15 : slotAction==="avoid" ? -20 : 0;

  // Parabolic SAR contribution
  const sar = computeParabolicSAR(t, et);
  const sarFactor = sar.sarScoreDelta;

  const rawScore = 50 + trendFactor + volFactor + liqFactor + slotFactor + (slotScore-50)*0.3 + sarFactor;
  const compositeScore = Math.round(Math.min(100, Math.max(0, rawScore)));

  // ── Final recommendation with SAR candle filter ──────────────────────────────
  // COMPRAR  → score≥68 + SAR alcista + ≥2 velas verdes consecutivas + franja ok
  // NO COMPRAR → score≤36 + SAR bajista + ≥8 velas alcistas previas al giro (agotamiento)
  // NEUTRAL  → score≥68 pero SAR no confirma aún (streak<2), o score bajo sin confirmación
  // ESPERAR  → resto de casos
  const sarBuyOk  = sar.sarBull && sar.streak >= 2;
  const sarSellOk = !sar.sarBull && sar.streak >= 8;
  const sarNearBuy = sar.sarBull && sar.streak < 2;   // SAR alcista pero sin suficientes velas

  let rec, recColor, recIcon, recSub;
  if      (compositeScore >= 68 && sarBuyOk  && slotAction === "buy") {
    rec="COMPRAR";      recColor=C.buy;  recIcon="↑";
    recSub=`SAR alcista ${sar.streak} velas · Score ${compositeScore}`;
  }
  else if (compositeScore <= 36 && sarSellOk) {
    rec="NO COMPRAR";   recColor=C.sell; recIcon="↓";
    recSub=`SAR bajista tras ${sar.streak} velas alcistas · Score ${compositeScore}`;
  }
  else if (compositeScore >= 68 && sarNearBuy) {
    rec="NEUTRAL";      recColor=C.warn; recIcon="◐";
    recSub=`Score alto pero SAR alcista solo ${sar.streak} vela${sar.streak!==1?"s":""} — esperar confirmación`;
  }
  else if (compositeScore >= 55 && sarBuyOk) {
    rec="NEUTRAL";      recColor=C.warn; recIcon="◐";
    recSub=`SAR confirma pero score moderado (${compositeScore}) — monitorear`;
  }
  else if (compositeScore <= 36 && sar.sarBull) {
    rec="ESPERAR";      recColor="#8a7060"; recIcon="→";
    recSub=`Score bajo pero SAR aún alcista (${sar.streak} velas) — sin confirmación bajista`;
  }
  else {
    rec="ESPERAR";      recColor=C.warn; recIcon="→";
    recSub=`Score ${compositeScore} · SAR ${sar.sarBull?"alcista":"bajista"} ${sar.streak} velas`;
  }

  // Trend direction
  const trend = priceDrift > 0.5 ? "alcista" : priceDrift < -0.5 ? "bajista" : "lateral";
  const trendColor = priceDrift > 0.5 ? C.buy : priceDrift < -0.5 ? C.sell : C.warn;
  const volPct = Math.min(200, Math.round(volRatio*100));

  // Build reasoning tags
  const reasons = [];
  if (slotAction==="buy")   reasons.push("Franja horaria favorable");
  if (slotAction==="avoid") reasons.push("Franja horaria desfavorable");
  if (daySentiment > 0.3)   reasons.push("Sesgo alcista del día");
  if (daySentiment < -0.3)  reasons.push("Sesgo bajista del día");
  if (volRatio > 1.3)       reasons.push("Volumen sobre la media");
  if (volRatio < 0.7)       reasons.push("Volumen bajo la media");
  if (liqScore > 70)        reasons.push("Alta liquidez disponible");
  if (liqScore < 40)        reasons.push("Liquidez reducida — riesgo de slippage");
  if (t.beta > 1.5)         reasons.push(`Beta alta (${t.beta.toFixed(2)}) amplifica movimientos`);
  if (sarBuyOk)             reasons.push(`SAR alcista confirmado · ${sar.streak} velas ≥2 ✓`);
  else if (sarNearBuy)      reasons.push(`SAR alcista · solo ${sar.streak} vela${sar.streak!==1?"s":""} — faltan ${2-sar.streak} para confirmar`);
  else if (sarSellOk)       reasons.push(`SAR bajista confirmado · ${sar.streak} velas previas ≥8 ✓`);
  else if (!sar.sarBull)    reasons.push(`SAR bajista · ${sar.streak} velas — sin confirmar (necesita ≥8 previas)`);

  return {
    compositeScore, rec, recColor, recIcon, recSub, trend, trendColor,
    daySentiment: parseFloat(daySentiment),
    priceDrift: parseFloat(priceDrift.toFixed(2)),
    volRatio:   parseFloat(volRatio.toFixed(2)),
    volPct, curVol: parseFloat(curVol.toFixed(1)),
    liqScore:   parseFloat(liqScore.toFixed(0)),
    reasons, slotAction, slotScore, sar
  };
}

function getSlotRaw(et) {
  const tot = et.getHours()*60 + et.getMinutes();
  const e   = [570,630,690,750,810,870,930,960];
  for (let i=0;i<7;i++) if (tot>=e[i]&&tot<e[i+1]) return i;
  return -1;
}


// ── PARABOLIC SAR ENGINE ──────────────────────────────────────────────────────
// Simulates 60 daily candles and computes real Parabolic SAR (Wilder defaults: AF=0.02, max=0.20)
function computeParabolicSAR(ticker, et) {
  const seed = et.getFullYear()*10000 + (et.getMonth()+1)*100 + et.getDate()
             + ticker.desc.length * 53 + 999;
  const rng = (s=0) => { let x = Math.sin(seed+s+1)*43758.5453; return x - Math.floor(x); };

  const N = 60;
  const basePrice = 50 + (ticker.desc.length * 7 % 400);
  const dailyVol  = ticker.beta * 0.018;

  const closes = [];
  let price = basePrice;
  for (let i = 0; i < N; i++) {
    const drift = (rng(i*3)   - 0.48) * dailyVol * price;
    const noise = (rng(i*3+1) - 0.5)  * dailyVol * price * 0.4;
    price = Math.max(1, price + drift + noise);
    closes.push(parseFloat(price.toFixed(2)));
  }
  const highs = closes.map((c,i) => parseFloat((c * (1 + rng(i*7+2) * dailyVol * 0.6)).toFixed(2)));
  const lows  = closes.map((c,i) => parseFloat((c * (1 - rng(i*7+3) * dailyVol * 0.6)).toFixed(2)));

  const AF_STEP = 0.02, AF_MAX = 0.20;
  let bull = closes[1] > closes[0];
  let SAR  = bull ? lows[0]  : highs[0];
  let EP   = bull ? highs[0] : lows[0];
  let AF   = AF_STEP;
  const sarHistory = [{ sar:SAR, bull, close:closes[0], high:highs[0], low:lows[0], af:AF }];

  for (let i = 1; i < N; i++) {
    SAR = SAR + AF * (EP - SAR);
    if (bull) {
      SAR = Math.min(SAR, lows[i-1], i>=2 ? lows[i-2] : lows[i-1]);
      if (lows[i] < SAR) {
        bull=false; SAR=EP; EP=lows[i]; AF=AF_STEP;
      } else if (highs[i] > EP) { EP=highs[i]; AF=Math.min(AF+AF_STEP, AF_MAX); }
    } else {
      SAR = Math.max(SAR, highs[i-1], i>=2 ? highs[i-2] : highs[i-1]);
      if (highs[i] > SAR) {
        bull=true; SAR=EP; EP=highs[i]; AF=AF_STEP;
      } else if (lows[i] < EP) { EP=lows[i]; AF=Math.min(AF+AF_STEP, AF_MAX); }
    }
    sarHistory.push({ sar:parseFloat(SAR.toFixed(2)), bull, close:closes[i], high:highs[i], low:lows[i], af:parseFloat(AF.toFixed(2)), ep:parseFloat(EP.toFixed(2)) });
  }

  const last     = sarHistory[N-1];
  const sarBull  = last.bull;
  const sarVal   = last.sar;
  const curPrice = last.close;
  const sarDist  = parseFloat((Math.abs(curPrice-sarVal)/curPrice*100).toFixed(2));

  let streak = 0;
  for (let i=N-1; i>=0; i--) { if(sarHistory[i].bull===sarBull) streak++; else break; }

  let sarSignal, sarColor, sarIcon, sarDesc;
  if      (sarBull && streak>=5 && sarDist>1.5) { sarSignal="ALCISTA FUERTE"; sarColor=C.buy;    sarIcon="▲"; sarDesc=`SAR bajo precio hace ${streak} velas. Tendencia alcista consolidada con ${sarDist}% de margen sobre el SAR.`; }
  else if (sarBull && streak>=2)                { sarSignal="ALCISTA";        sarColor="#5aad6b"; sarIcon="↗"; sarDesc=`Precio sobre el SAR hace ${streak} sesiones. Momentum alcista activo a mediano plazo.`; }
  else if (!sarBull && streak>=5 && sarDist>1.5){ sarSignal="BAJISTA FUERTE"; sarColor=C.sell;   sarIcon="▼"; sarDesc=`SAR sobre precio hace ${streak} velas. Presión vendedora dominante, ${sarDist}% bajo el SAR.`; }
  else if (!sarBull)                            { sarSignal="BAJISTA";        sarColor="#d9534f"; sarIcon="↘"; sarDesc=`Precio bajo el SAR hace ${streak} sesiones. Tendencia bajista a mediano plazo vigente.`; }
  else                                          { sarSignal="REVERSIÓN";     sarColor=C.warn;    sarIcon="↔"; sarDesc="SAR recién cruzado. Posible cambio de tendencia — confirmar con volumen antes de operar."; }

  const sarScoreDelta = sarBull ? (streak>=5?20:10) : (streak>=5?-20:-10);

  // Generate real trading-day dates going back 20 sessions from et
  function getTradingDates(refDate, count) {
    const dates = [];
    const d = new Date(refDate);
    d.setHours(0,0,0,0);
    while (dates.length < count) {
      d.setDate(d.getDate() - 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.unshift(new Date(d));
      }
    }
    return dates;
  }
  const tradingDates = getTradingDates(et, 20);
  const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const chartData = sarHistory.slice(-20).map((c,i)=>{
    const dt = tradingDates[i];
    const label = dt ? `${dt.getDate()} ${MONTHS[dt.getMonth()]}` : "";
    return {i, close:c.close, sar:c.sar, bull:c.bull, high:c.high, low:c.low, dateLabel:label};
  });

  return { sarVal, sarBull, sarSignal, sarColor, sarIcon, sarDesc, streak, sarDist, sarScoreDelta, curPrice:parseFloat(curPrice.toFixed(2)), chartData, sarAF:last.af };
}

// ── SAR CHART WITH DATE AXIS ─────────────────────────────────────────────────
function SARChart({ data, sarColor }) {
  const VW=420, VH=140, padL=8, padR=8, padT=12, padB=32;
  const plotH = VH - padT - padB;
  const plotW = VW - padL - padR;

  const allVals = data.flatMap(d=>[d.close, d.sar]);
  const minV = Math.min(...allVals)*0.993, maxV = Math.max(...allVals)*1.007;
  const range = maxV - minV || 1;

  const xOf = i => padL + (i / (data.length - 1)) * plotW;
  const yOf = v => padT + plotH * (1 - (v - minV) / range);

  const areaPath = data.map((d,i)=>`${i===0?"M":"L"}${xOf(i).toFixed(1)},${yOf(d.close).toFixed(1)}`).join(" ")
    + ` L${xOf(data.length-1).toFixed(1)},${padT+plotH} L${xOf(0).toFixed(1)},${padT+plotH} Z`;
  const pricePath = data.map((d,i)=>`${i===0?"M":"L"}${xOf(i).toFixed(1)},${yOf(d.close).toFixed(1)}`).join(" ");

  // Pick ~5 evenly spaced date labels
  const labelIdxs = [0, 4, 9, 14, 19].filter(i => i < data.length);

  return (
    <div style={{width:"100%",maxWidth:"100%",overflow:"hidden",display:"block"}}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{display:"block",width:"100%",height:"auto",maxWidth:"100%"}}
      >
        {/* Subtle horizontal grid lines */}
        {[0.25,0.5,0.75].map((f,i)=>(
          <line key={i}
            x1={padL} y1={padT + plotH*f}
            x2={VW-padR} y2={padT + plotH*f}
            stroke={C.bor} strokeWidth={0.6} strokeDasharray="3 3"/>
        ))}

        {/* Date axis baseline */}
        <line x1={padL} y1={padT+plotH} x2={VW-padR} y2={padT+plotH}
          stroke={C.bor} strokeWidth={1}/>

        {/* Tick marks + date labels */}
        {labelIdxs.map(i=>{
          const x = xOf(i);
          const label = data[i]?.dateLabel || "";
          return (
            <g key={i}>
              <line x1={x} y1={padT+plotH} x2={x} y2={padT+plotH+4}
                stroke={C.mut} strokeWidth={1}/>
              <text x={x} y={VH-4} textAnchor="middle"
                fontSize={9} fill={C.mut} fontFamily="'DM Mono',monospace">
                {label}
              </text>
            </g>
          );
        })}

        {/* Today marker — last candle vertical line */}
        <line
          x1={xOf(data.length-1)} y1={padT}
          x2={xOf(data.length-1)} y2={padT+plotH}
          stroke={C.warn} strokeWidth={1} strokeDasharray="3 2" opacity={0.7}/>
        <text x={xOf(data.length-1)} y={padT-2} textAnchor="middle"
          fontSize={8} fill={C.warn} fontFamily="'DM Mono',monospace">HOY</text>

        {/* Area fill */}
        <path d={areaPath} fill={C.ink} opacity={0.04}/>

        {/* Price line */}
        <path d={pricePath} fill="none" stroke={C.ink} strokeWidth={1.8} strokeLinejoin="round"/>

        {/* SAR dots — colored by trend direction */}
        {data.map((d,i)=>(
          <circle key={i}
            cx={xOf(i)} cy={yOf(d.sar)} r={2.6}
            fill={d.bull ? C.buy : C.sell} opacity={0.9}/>
        ))}

        {/* Highlight last SAR dot */}
        <circle cx={xOf(data.length-1)} cy={yOf(data[data.length-1].sar)} r={4.8}
          fill={sarColor} stroke={C.sur} strokeWidth={1.5}/>

        {/* Highlight last price dot */}
        <circle cx={xOf(data.length-1)} cy={yOf(data[data.length-1].close)} r={3.2}
          fill={C.ink} stroke={C.sur} strokeWidth={1.5}/>
      </svg>
    </div>
  );
}

// ── DEFAULT DATA ──────────────────────────────────────────────────────────────
const BASE = {
  // Originales
  UBER:{ color:"#18150f", ...generateProfile("UBER") },
  MSFT:{ color:"#0f6cbd", ...generateProfile("MSFT") },
  HOOD:{ color:"#1b7f3a", ...generateProfile("HOOD") },
  // Tech mega-cap
  GOOGL:{ color:"#0891b2", ...generateProfile("GOOGL") },
  META:{ color:"#0f6cbd", ...generateProfile("META") },
  AMZN:{ color:"#b45309", ...generateProfile("AMZN") },
  ORCL:{ color:"#c0392b", ...generateProfile("ORCL") },
  ADBE:{ color:"#7c3aed", ...generateProfile("ADBE") },
  CRM:{ color:"#0891b2", ...generateProfile("CRM") },
  IBM:{ color:"#374151", ...generateProfile("IBM") },
  // Semiconductores
  MU:{ color:"#7c3aed", ...generateProfile("MU") },
  AVGO:{ color:"#b45309", ...generateProfile("AVGO") },
  PLTR:{ color:"#374151", ...generateProfile("PLTR") },
  // Fintech / Pagos
  MA:{ color:"#c0392b", ...generateProfile("MA") },
  NU:{ color:"#7c3aed", ...generateProfile("NU") },
  // eCommerce / Consumo
  MELI:{ color:"#1b7f3a", ...generateProfile("MELI") },
  NKE:{ color:"#18150f", ...generateProfile("NKE") },
  KO:{ color:"#c0392b", ...generateProfile("KO") },
  MCD:{ color:"#b45309", ...generateProfile("MCD") },
  PG:{ color:"#0891b2", ...generateProfile("PG") },
  // Streaming / Entretenimiento
  NFLX:{ color:"#c0392b", ...generateProfile("NFLX") },
  // Energía / Materiales
  VST:{ color:"#d95f02", ...generateProfile("VST") },
  OKLO:{ color:"#065f46", ...generateProfile("OKLO") },
  COPX:{ color:"#b45309", ...generateProfile("COPX") },
  // ETFs
  GLD:{ color:"#b45309", ...generateProfile("GLD") },
  IWM:{ color:"#374151", ...generateProfile("IWM") },
  // Otros
  BNG:{ color:"#374151", ...generateProfile("BNG") },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function etNow(){ return new Date(new Date().toLocaleString("en-US",{timeZone:"America/New_York"})); }
function pad(n) { return String(n).padStart(2,"0"); }
function getSlot(et) {
  const tot=et.getHours()*60+et.getMinutes();
  const e=[570,630,690,750,810,870,930,960];
  for(let i=0;i<7;i++) if(tot>=e[i]&&tot<e[i+1]) return i;
  return -1;
}
function contrast(hex){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return (r*299+g*587+b*114)/1000>128?"#18150f":"#f4f1eb";
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Pill({action}){
  const m={buy:["#1b7f3a18","#1b7f3a","#1b7f3a33","COMPRAR"],avoid:["#c0392b18","#c0392b","#c0392b33","EVITAR"],ok:["#7a726018","#5a5248","#7a726033","NEUTRAL"]};
  const [bg,col,bor,txt]=m[action]||m.ok;
  return <span style={{display:"inline-block",padding:"2px 6px",fontSize:".44rem",letterSpacing:".1em",textTransform:"uppercase",fontWeight:600,borderRadius:2,background:bg,color:col,border:`1px solid ${bor}`}}>{txt}</span>;
}

function HourBars({t}){
  const [up,setUp]=useState(false);
  useEffect(()=>{setUp(false);const id=setTimeout(()=>setUp(true),70);return()=>clearTimeout(id);},[t]);
  const mx=Math.max(...t.scores);
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginTop:14}}>
      {t.scores.map((sc,i)=>{
        const clr=t.actions[i]==="buy"?t.color:ACOL[t.actions[i]];
        return(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <div style={{fontSize:".44rem",color:C.mut}}>{HOURS[i]}</div>
            <div style={{width:"100%",height:62,background:C.crm,border:sc===mx?`2px solid ${C.ink}`:`1px solid ${C.bor}`,position:"relative",overflow:"hidden"}}>
              {sc===mx&&<div style={{position:"absolute",top:2,left:"50%",transform:"translateX(-50%)",fontSize:".55rem",color:C.warn}}>★</div>}
              <div style={{position:"absolute",bottom:0,left:0,right:0,background:clr,height:up?`${sc}%`:"0%",transition:"height .85s cubic-bezier(.4,0,.2,1)"}}/>
            </div>
            <div style={{fontSize:".48rem",fontWeight:500,color:clr}}>{sc}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── SCORE RING ────────────────────────────────────────────────────────────────
function ScoreRing({score, color, size=80}){
  const r=32, circ=2*Math.PI*r;
  const [prog,setProg]=useState(0);
  useEffect(()=>{const id=setTimeout(()=>setProg(score),120);return()=>clearTimeout(id);},[score]);
  const offset=circ-(prog/100)*circ;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox="0 0 80 80" style={{transform:"rotate(-90deg)"}}>
        <circle cx={40} cy={40} r={r} fill="none" stroke={C.bor} strokeWidth={7}/>
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{transition:"stroke-dashoffset 1s cubic-bezier(.4,0,.2,1), stroke .4s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Barlow',sans-serif",fontSize:"1.1rem",fontWeight:800,color,lineHeight:1}}>{score}</span>
        <span style={{fontSize:".38rem",color:C.mut,letterSpacing:".1em",textTransform:"uppercase",marginTop:1}}>score</span>
      </div>
    </div>
  );
}

// ── TREND BAR ─────────────────────────────────────────────────────────────────
function TrendBar({label, value, max, color, unit=""}){
  const [w,setW]=useState(0);
  const pct=Math.min(100,Math.round((value/max)*100));
  useEffect(()=>{const id=setTimeout(()=>setW(pct),150);return()=>clearTimeout(id);},[pct]);
  return(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:".48rem",color:C.mut,textTransform:"uppercase",letterSpacing:".1em"}}>{label}</span>
        <span style={{fontSize:".52rem",fontWeight:600,color}}>{value}{unit}</span>
      </div>
      <div style={{height:5,background:C.bor,borderRadius:3,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${w}%`,background:color,borderRadius:3,transition:"width 1s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
    </div>
  );
}


// ── LIVE PRICE (Yahoo Finance — funciona en Vercel/producción) ───────────────
function LivePrice({ symbol }) {
  const [price,  setPrice ] = useState(null);
  const [change, setChange] = useState(null);
  const [pct,    setPct   ] = useState(null);
  const [status, setStatus] = useState("loading");
  const [ts,     setTs    ] = useState(null);
  const bold = "'Barlow',sans-serif";
  const mono = "'DM Mono',monospace";

  async function fetchPrice() {
    try {
      // Direct Yahoo Finance fetch — works in Vercel (no CORS restrictions in production)
      const res = await fetch(`/api/price?symbol=${symbol}`);

  
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      const meta = json.chart.result[0].meta;
      const p    = meta.regularMarketPrice;
      const prev = meta.chartPreviousClose || meta.previousClose || p;
      const ch   = parseFloat((p - prev).toFixed(2));
      const pc   = parseFloat(((ch / prev) * 100).toFixed(2));
      setPrice(p); setChange(ch); setPct(pc);
      setTs(new Date().toLocaleTimeString("en-US", {
        hour:"2-digit", minute:"2-digit", timeZone:"America/New_York"
      }));
      setStatus("ok");
    } catch(e) {
      setStatus("error");
    }
  }

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, [symbol]);

  const up    = change !== null && change >= 0;
  const chCol = up ? C.buy : C.sell;

  return (
    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",
      padding:"10px 16px",background:C.crm,borderBottom:"1px solid "+C.bor}}>
      <span style={{fontSize:".44rem",letterSpacing:".18em",textTransform:"uppercase",
        color:C.mut,flexShrink:0}}>Precio · {symbol}</span>

      {status === "loading" && (
        <span style={{fontFamily:bold,fontSize:"1.5rem",fontWeight:800,color:C.mut,
          animation:"blink 1.2s ease-in-out infinite"}}>—</span>
      )}
      {status === "error" && (
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:".6rem",color:C.mut}}>Sin datos</span>
          <button onClick={fetchPrice} style={{fontSize:".55rem",padding:"2px 8px",
            cursor:"pointer",background:"transparent",border:"1px solid "+C.bor,
            color:C.mut,borderRadius:2}}>↻</button>
        </div>
      )}
      {status === "ok" && price !== null && (
        <>
          <span style={{fontFamily:bold,fontSize:"1.8rem",fontWeight:800,color:C.ink,
            letterSpacing:"-.04em",lineHeight:1}}>
            ${price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
          </span>
          <span style={{fontFamily:bold,fontSize:".88rem",fontWeight:700,color:chCol}}>
            {change >= 0 ? "+" : ""}{change.toFixed(2)}
          </span>
          <span style={{fontSize:".75rem",fontWeight:600,color:chCol,
            background:chCol+"18",border:"1px solid "+chCol+"33",
            padding:"2px 7px",borderRadius:2}}>
            {pct >= 0 ? "+" : ""}{pct.toFixed(2)}%
          </span>
          <button onClick={fetchPrice} style={{fontSize:".6rem",padding:"2px 6px",
            cursor:"pointer",background:"transparent",border:"1px solid "+C.bor,
            color:C.mut,borderRadius:2}}>↻</button>
          {ts && <span style={{fontSize:".42rem",color:C.mut}}>{ts} ET · 30s</span>}
        </>
      )}
    </div>
  );
}

// ── DAILY TREND PANEL ─────────────────────────────────────────────────────────
function DailyTrendPanel({ticker, tickerSymbol, et}){
  const d = computeDailyTrend(ticker, et);
  const bold="'Barlow',sans-serif";
  const mono="'DM Mono',monospace";

  if (!d) {
    return(
      <div style={{background:C.sur,border:`2px solid ${C.ink}`,padding:18,marginBottom:12}}>
        <div style={{fontSize:".46rem",letterSpacing:".2em",textTransform:"uppercase",color:C.mut,marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.bor}`}}>
          Indicador de tendencia diaria
        </div>
        <div style={{textAlign:"center",padding:"20px 0",color:C.mut,fontSize:".65rem"}}>
          Mercado cerrado · El indicador estará disponible en la próxima apertura (9:30 AM ET)
        </div>
      </div>
    );
  }

  const sentPct   = Math.round((d.daySentiment+1)/2*100);
  const driftAbs  = Math.abs(d.priceDrift);
  const driftDisp = (d.priceDrift > 0 ? "+" : "") + d.priceDrift.toFixed(2) + "%";

  return(
    <div style={{background:C.sur,border:`2px solid ${C.ink}`,padding:18,marginBottom:12}}>
      {/* Live Price strip */}
      <LivePrice symbol={tickerSymbol} tickerColor={ticker.color}/>

      {/* Header */}
      <div style={{fontSize:".46rem",letterSpacing:".2em",textTransform:"uppercase",color:C.mut,marginBottom:14,paddingBottom:8,marginTop:14,borderBottom:`1px solid ${C.bor}`}}>
        Indicador de tendencia diaria · tiempo real
      </div>

      {/* Main recommendation + score ring */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"center",marginBottom:16,padding:"14px 16px",background:C.ink,borderLeft:`4px solid ${d.recColor}`}}>
        <div>
          <div style={{fontSize:".44rem",letterSpacing:".16em",textTransform:"uppercase",color:"rgba(255,255,255,.45)",marginBottom:6}}>
            Recomendación hoy · {ticker.desc}
          </div>
          <div style={{fontFamily:bold,fontSize:"1.8rem",fontWeight:800,color:d.recColor,lineHeight:1,marginBottom:4}}>
            {d.recIcon} {d.rec}
          </div>
          {d.recSub && (
            <div style={{fontSize:".56rem",color:d.recColor,opacity:.85,marginBottom:6,letterSpacing:".02em"}}>
              {d.recSub}
            </div>
          )}
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {d.reasons.map((r,i)=>(
              <span key={i} style={{fontSize:".48rem",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.6)",padding:"2px 7px",borderRadius:2,letterSpacing:".04em"}}>
                {r}
              </span>
            ))}
          </div>
        </div>
        <ScoreRing score={d.compositeScore} color={d.recColor} size={78}/>
      </div>

      {/* 4 metric blocks */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
        {/* Tendencia */}
        <div style={{border:`1px solid ${C.bor}`,padding:10,background:C.bg}}>
          <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Tendencia</div>
          <div style={{fontFamily:bold,fontSize:"1rem",fontWeight:800,color:d.trendColor,letterSpacing:"-.02em"}}>{d.trend}</div>
          <div style={{fontSize:".48rem",color:d.trendColor,marginTop:2,fontWeight:600}}>{driftDisp}</div>
        </div>
        {/* Vol ratio */}
        <div style={{border:`1px solid ${C.bor}`,padding:10,background:C.bg}}>
          <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Vol. vs media</div>
          <div style={{fontFamily:bold,fontSize:"1rem",fontWeight:800,color:d.volRatio>1.2?C.buy:d.volRatio<0.8?C.sell:C.warn,letterSpacing:"-.02em"}}>{d.volPct}%</div>
          <div style={{fontSize:".46rem",color:C.mut,marginTop:2}}>{d.curVol.toFixed(0)}M acc. est.</div>
        </div>
        {/* Liquidez */}
        <div style={{border:`1px solid ${C.bor}`,padding:10,background:C.bg}}>
          <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Liquidez</div>
          <div style={{fontFamily:bold,fontSize:"1rem",fontWeight:800,color:d.liqScore>70?C.buy:d.liqScore<40?C.sell:C.warn,letterSpacing:"-.02em"}}>{d.liqScore}/100</div>
          <div style={{fontSize:".46rem",color:C.mut,marginTop:2}}>{ticker.liq}</div>
        </div>
        {/* Sesgo */}
        <div style={{border:`1px solid ${C.bor}`,padding:10,background:C.bg}}>
          <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Sesgo día</div>
          <div style={{fontFamily:bold,fontSize:"1rem",fontWeight:800,color:d.daySentiment>0?C.buy:C.sell,letterSpacing:"-.02em"}}>{d.daySentiment>0?"+":""}{d.daySentiment.toFixed(2)}</div>
          <div style={{fontSize:".46rem",color:C.mut,marginTop:2}}>{d.daySentiment>0.3?"Bull":"d.daySentiment<-0.3"?"Bear":"Neutral"}</div>
        </div>
      </div>

      {/* Gauge bars */}
      <div style={{background:C.bg,border:`1px solid ${C.bor}`,padding:"12px 14px",marginBottom:14}}>
        <TrendBar label="Score compuesto" value={d.compositeScore} max={100} color={d.recColor} unit="/100"/>
        <TrendBar label="Volumen vs promedio" value={Math.min(200,d.volPct)} max={200} color={d.volRatio>1.2?C.buy:d.volRatio<0.8?C.sell:C.warn} unit="%"/>
        <TrendBar label="Liquidez del sistema" value={d.liqScore} max={100} color={d.liqScore>70?C.buy:d.liqScore<40?C.sell:C.warn} unit="/100"/>
        <TrendBar label="Puntuación franja actual" value={d.slotScore} max={100}
          color={d.slotAction==="buy"?C.buy:d.slotAction==="avoid"?C.sell:C.warn} unit="/100"/>
        <TrendBar label="Parabólico SAR (aporte)" value={Math.max(0, 50+d.sar.sarScoreDelta)} max={70}
          color={d.sar.sarColor} unit=""/>
      </div>

      {/* ── PARABOLIC SAR BLOCK ── */}
      <div style={{border:`2px solid ${d.sar.sarColor}`,background:C.bg}}>
        {/* SAR Header */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${C.bor}`}}>
          <div>
            <div style={{fontSize:".44rem",letterSpacing:".18em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>
              Parabólico SAR · tendencia mediano plazo
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontFamily:bold,fontSize:"1.4rem",fontWeight:800,color:d.sar.sarColor,lineHeight:1}}>
                {d.sar.sarIcon} {d.sar.sarSignal}
              </span>
              <span style={{fontSize:".52rem",background:d.sar.sarColor+"22",color:d.sar.sarColor,padding:"3px 8px",border:`1px solid ${d.sar.sarColor}44`,borderRadius:2,fontWeight:600}}>
                {d.sar.streak} velas {d.sar.sarBull?"↑ alcista":"↓ bajista"}
              </span>
            </div>
          </div>
          {/* AF badge */}
          <div style={{textAlign:"right",padding:"0 4px"}}>
            <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:3}}>Factor AF</div>
            <div style={{fontFamily:bold,fontSize:"1.1rem",fontWeight:800,color:C.ink}}>{d.sar.sarAF}</div>
            <div style={{fontSize:".42rem",color:C.mut}}>aceleración</div>
          </div>
        </div>

        {/* SAR Detail grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:0}}>
          <div style={{padding:"10px 14px",borderRight:`1px solid ${C.bor}`}}>
            <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Precio actual (sim.)</div>
            <div style={{fontFamily:bold,fontSize:"1rem",fontWeight:800,color:C.ink}}>${d.sar.curPrice}</div>
            <div style={{fontSize:".46rem",color:C.mut,marginTop:1}}>{d.sar.sarBull?"Por encima del SAR":"Por debajo del SAR"}</div>
          </div>
          <div style={{padding:"10px 14px",borderRight:`1px solid ${C.bor}`}}>
            <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Valor SAR</div>
            <div style={{fontFamily:bold,fontSize:"1rem",fontWeight:800,color:d.sar.sarColor}}>${d.sar.sarVal}</div>
            <div style={{fontSize:".46rem",color:C.mut,marginTop:1}}>Stop dinámico actual</div>
          </div>
          <div style={{padding:"10px 14px"}}>
            <div style={{fontSize:".42rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Distancia al SAR</div>
            <div style={{fontFamily:bold,fontSize:"1rem",fontWeight:800,color:d.sar.sarColor}}>{d.sar.sarDist}%</div>
            <div style={{fontSize:".46rem",color:C.mut,marginTop:1}}>{d.sar.sarDist>3?"Margen amplio":d.sar.sarDist>1?"Margen moderado":"Cerca del stop"}</div>
          </div>
        </div>

        {/* Chart + interpretación — apilados, 100% ancho */}
        <div style={{borderTop:`1px solid ${C.bor}`,padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexWrap:"wrap",gap:6}}>
            <span style={{fontSize:".44rem",letterSpacing:".12em",textTransform:"uppercase",color:C.mut}}>
              Últimas 20 sesiones · precio vs SAR
            </span>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:14,height:2,background:C.ink,borderRadius:1}}/>
                <span style={{fontSize:".43rem",color:C.mut}}>Precio</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:C.buy,flexShrink:0}}/>
                <span style={{fontSize:".43rem",color:C.mut}}>SAR alcista</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:C.sell,flexShrink:0}}/>
                <span style={{fontSize:".43rem",color:C.mut}}>SAR bajista</span>
              </div>
            </div>
          </div>
          {/* Chart — full width, overflow hidden at container level */}
          <div style={{width:"100%",maxWidth:"100%",overflow:"hidden",boxSizing:"border-box"}}>
            <SARChart data={d.sar.chartData} sarColor={d.sar.sarColor}/>
          </div>
        </div>
        {/* Interpretación */}
        <div style={{borderTop:`1px solid ${C.bor}`,padding:"12px 14px"}}>
          <div style={{fontSize:".44rem",letterSpacing:".12em",textTransform:"uppercase",color:C.mut,marginBottom:6}}>Interpretación</div>
          <div style={{fontSize:".62rem",color:C.ink,lineHeight:1.6,marginBottom:10}}>{d.sar.sarDesc}</div>
          <div style={{fontSize:".44rem",letterSpacing:".12em",textTransform:"uppercase",color:C.mut,marginBottom:5}}>Aporte al score compuesto</div>
          <div style={{height:6,background:C.bor,borderRadius:3,overflow:"hidden",width:"100%"}}>
            <div style={{height:"100%",background:d.sar.sarColor,width:`${Math.abs(d.sar.sarScoreDelta)/20*100}%`,borderRadius:3,transition:"width 1s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
          <div style={{fontSize:".5rem",color:d.sar.sarColor,marginTop:3,fontWeight:600}}>
            {d.sar.sarScoreDelta>0?"+":""}{d.sar.sarScoreDelta} puntos ({d.sar.sarScoreDelta>0?"positivo":"negativo"})
          </div>
        </div>
      </div>
    </div>
  );
}


// ── ALARM SYSTEM ──────────────────────────────────────────────────────────────
function AlarmRow({ a, tk, onToggle, onDelete, bold, mono }) {
  const tagColor = a.type==="buy" ? C.buy : a.type==="sell" ? C.sell : C.warn;
  const tagLabel = a.type==="buy" ? "COMPRAR" : a.type==="sell" ? "VENDER" : "ALERTA";
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:8,padding:"9px 12px",
      background: a.fired ? (a.type==="buy"?"#1b7f3a0e":"#c0392b0e") : a.enabled ? C.bg : C.crm,
      border:`1px solid ${a.fired ? tagColor+"55" : a.enabled ? C.bor : C.bor}`,
      opacity: a.enabled ? 1 : 0.5, flexWrap:"wrap"
    }}>
      {a.fired && <span style={{fontSize:".8rem",flexShrink:0}}>🔔</span>}
      <span style={{fontFamily:bold,fontSize:".72rem",fontWeight:700,
        background:tk?tk.color:C.ink, color:tk?contrast(tk.color):C.bg,
        padding:"2px 7px",flexShrink:0}}>
        {a.ticker}
      </span>
      <span style={{fontSize:".48rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
        background:tagColor+"18",color:tagColor,border:`1px solid ${tagColor}33`,
        padding:"2px 6px",borderRadius:2,flexShrink:0}}>
        {tagLabel}
      </span>
      <span style={{fontSize:".6rem",color:C.mut,flex:1,minWidth:100}}>{a.condLabel}</span>
      {a.scoreThreshold!=null &&
        <span style={{fontFamily:mono,fontSize:".55rem",color:C.mut,flexShrink:0}}>
          score {a.type==="buy"?"≥":"≤"}{a.scoreThreshold}
        </span>}
      {a.fired &&
        <span style={{fontSize:".5rem",color:tagColor,fontWeight:700,flexShrink:0}}>
          ✓ {a.firedAt}
        </span>}
      <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:"auto"}}>
        <button onClick={()=>onToggle(a.id)} style={{
          fontSize:".55rem",fontWeight:600,padding:"2px 7px",cursor:"pointer",
          background:a.enabled?C.buy+"22":C.bor,
          color:a.enabled?C.buy:C.mut,
          border:`1px solid ${a.enabled?C.buy+"44":C.bor}`,borderRadius:2
        }}>{a.enabled?"ON":"OFF"}</button>
        <button onClick={()=>onDelete(a.id)} style={{
          fontSize:".55rem",padding:"2px 6px",cursor:"pointer",
          background:"transparent",color:C.mut,border:`1px solid ${C.bor}`,borderRadius:2
        }}>✕</button>
      </div>
    </div>
  );
}

function AlarmPanel({ alarms, tickers, onDelete, onToggle, openAlarmModal }) {
  const bold="'Barlow',sans-serif";

  const fired   = alarms.filter(a=>a.fired);
  const active  = alarms.filter(a=>a.enabled && !a.fired);

  return(
    <div style={{background:C.sur,border:`2px solid ${C.ink}`,padding:18,marginBottom:12}}>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${C.bor}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:".46rem",letterSpacing:".2em",textTransform:"uppercase",color:C.mut}}>
            Alarmas activas
          </span>
          {fired.length>0 &&
            <span style={{fontSize:".5rem",fontWeight:700,background:C.warn+"22",color:C.warn,
              border:`1px solid ${C.warn}44`,padding:"2px 8px",borderRadius:2,letterSpacing:".06em"}}>
              🔔 {fired.length} disparada{fired.length>1?"s":""}
            </span>}
        </div>
        <button onClick={openAlarmModal} style={{
          fontFamily:bold,fontSize:".68rem",fontWeight:700,padding:"5px 14px",cursor:"pointer",
          background:C.ink,color:C.bg,border:"none",letterSpacing:".04em"
        }}>＋ Nueva alarma</button>
      </div>

      {/* Fired — full row, highlighted */}
      {fired.length>0 && (
        <div style={{marginBottom:10}}>
          <div style={{fontSize:".42rem",letterSpacing:".16em",textTransform:"uppercase",
            color:C.warn,marginBottom:5}}>🔔 Disparadas</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {fired.map(a=>{
              const tk=tickers[a.ticker];
              const tagColor=a.type==="buy"?C.buy:a.type==="sell"?C.sell:C.warn;
              const tagLabel=a.type==="buy"?"COMPRAR":a.type==="sell"?"VENDER":"ALERTA";
              return(
                <div key={a.id} style={{
                  display:"flex",alignItems:"center",gap:8,padding:"9px 12px",flexWrap:"wrap",
                  background:a.type==="buy"?"#1b7f3a0e":"#c0392b0e",
                  border:`1px solid ${tagColor}55`
                }}>
                  <span style={{fontSize:".8rem"}}>🔔</span>
                  <span style={{fontFamily:bold,fontSize:".72rem",fontWeight:700,
                    background:tk?tk.color:C.ink,color:tk?contrast(tk.color):C.bg,
                    padding:"2px 7px",flexShrink:0}}>{a.ticker}</span>
                  <span style={{fontSize:".48rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                    background:tagColor+"18",color:tagColor,border:`1px solid ${tagColor}33`,
                    padding:"2px 6px",borderRadius:2,flexShrink:0}}>{tagLabel}</span>
                  <span style={{fontSize:".5rem",color:tagColor,fontWeight:700,flexShrink:0,marginLeft:"auto"}}>
                    ✓ {a.firedAt}
                  </span>
                  <button onClick={()=>onToggle(a.id)} style={{
                    fontSize:".55rem",fontWeight:600,padding:"2px 7px",cursor:"pointer",
                    background:C.buy+"22",color:C.buy,border:`1px solid ${C.buy}44`,borderRadius:2
                  }}>Resetear</button>
                  <button onClick={()=>onDelete(a.id)} style={{
                    fontSize:".55rem",padding:"2px 6px",cursor:"pointer",
                    background:"transparent",color:C.mut,border:`1px solid ${C.bor}`,borderRadius:2
                  }}>✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Solo mensaje si no hay nada disparado */}
      {fired.length===0 && (
        <div style={{fontSize:".6rem",color:C.mut,textAlign:"center",padding:"12px 0"}}>
          {active.length>0
            ? `${active.length} alarma${active.length!==1?"s":""} activa${active.length!==1?"s":""} monitoreando el mercado…`
            : "Sin alarmas activas."}
        </div>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [tickers,   setTickers  ] = useState(BASE);
  const [active,    setActive   ] = useState("UBER");
  const [now,       setNow      ] = useState(etNow());
  const [modal,     setModal    ] = useState(false);
  const [sym,       setSym      ] = useState("");
  const [name,      setName     ] = useState("");
  const [picked,    setPicked   ] = useState(PAL[0]);
  const [loading,   setLoading  ] = useState(false);
  const [msg,       setMsg      ] = useState({t:"",err:false});
  const [confirming,setConfirming] = useState(null);
  const [alarms,    setAlarms    ] = useState([
  { id:1, ticker:"UBER", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:2, ticker:"UBER", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:3, ticker:"MSFT", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:4, ticker:"MSFT", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:5, ticker:"HOOD", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:6, ticker:"HOOD", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:7, ticker:"GOOGL", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:8, ticker:"GOOGL", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:9, ticker:"META", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:10, ticker:"META", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:11, ticker:"AMZN", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:12, ticker:"AMZN", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:13, ticker:"ORCL", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:14, ticker:"ORCL", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:15, ticker:"ADBE", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:16, ticker:"ADBE", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:17, ticker:"CRM", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:18, ticker:"CRM", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:19, ticker:"IBM", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:20, ticker:"IBM", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:21, ticker:"MU", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:22, ticker:"MU", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:23, ticker:"AVGO", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:24, ticker:"AVGO", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:25, ticker:"PLTR", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:26, ticker:"PLTR", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:27, ticker:"MA", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:28, ticker:"MA", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:29, ticker:"NU", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:30, ticker:"NU", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:31, ticker:"MELI", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:32, ticker:"MELI", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:33, ticker:"NKE", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:34, ticker:"NKE", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:35, ticker:"KO", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:36, ticker:"KO", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:37, ticker:"MCD", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:38, ticker:"MCD", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:39, ticker:"PG", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:40, ticker:"PG", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:41, ticker:"NFLX", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:42, ticker:"NFLX", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:43, ticker:"VST", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:44, ticker:"VST", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:45, ticker:"OKLO", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:46, ticker:"OKLO", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:47, ticker:"COPX", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:48, ticker:"COPX", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:49, ticker:"GLD", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:50, ticker:"GLD", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:51, ticker:"IWM", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:52, ticker:"IWM", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null },
  { id:53, ticker:"BNG", type:"buy",  cond:"composite_buy",  scoreThreshold:null, condLabel:"COMPRA: score≥68 + SAR alcista ≥2 velas + franja ok", enabled:true, fired:false, firedAt:null },
  { id:54, ticker:"BNG", type:"sell", cond:"composite_sell", scoreThreshold:null, condLabel:"VENTA: score≤36 + SAR bajista ≥8 velas alcistas previas", enabled:true, fired:false, firedAt:null }
]);
  const [alarmModal,setAlarmModal] = useState(false);
  const [aForm,     setAForm     ] = useState({ticker:"UBER",type:"buy",cond:"score_high",scoreThreshold:70,sarCond:"bull",slotCond:"buy"});
  const alarmIdRef = useRef(55);
  const ref = useRef();
  const mono="'DM Mono',monospace", bold="'Barlow',sans-serif";

  useEffect(()=>{
    const id=setInterval(()=>setNow(etNow()),1000);
    return()=>clearInterval(id);
  },[]);

  // Alarm checker — runs every second against current market data
  useEffect(()=>{
    if(alarms.length===0) return;
    const et=etNow();
    const wd=et.getDay(), tot2=et.getHours()*60+et.getMinutes();
    const open=wd>=1&&wd<=5&&tot2>=570&&tot2<960;
    if(!open) return;

    setAlarms(prev=>prev.map(a=>{
      if(!a.enabled||a.fired) return a;
      const tk=tickers[a.ticker];
      if(!tk) return a;

      const d=computeDailyTrend(tk,et);
      if(!d) return a;

      let triggered=false;

      if(a.cond==="score_high"  && d.compositeScore>=a.scoreThreshold) triggered=true;
      if(a.cond==="score_low"   && d.compositeScore<=a.scoreThreshold) triggered=true;
      if(a.cond==="rec_buy"     && d.rec==="COMPRAR")  triggered=true;
      if(a.cond==="rec_sell"    && d.rec==="NO COMPRAR") triggered=true;
      if(a.cond==="sar_bull"    && d.sar.sarBull)  triggered=true;
      if(a.cond==="sar_bear"    && !d.sar.sarBull) triggered=true;
      if(a.cond==="sar_reversal"&& d.sar.sarSignal==="REVERSIÓN") triggered=true;
      if(a.cond==="slot_buy"    && d.slotAction==="buy")   triggered=true;
      if(a.cond==="slot_avoid"  && d.slotAction==="avoid") triggered=true;
      if(a.cond==="vol_high"    && d.volRatio>=1.5) triggered=true;
      if(a.cond==="liq_low"     && d.liqScore<=35)  triggered=true;
      // composite_buy: score≥68 + SAR alcista + al menos 2 velas alcistas en SAR + franja ok
      if(a.cond==="composite_buy"  && d.compositeScore>=68 && d.sar.sarBull && d.sar.streak>=2 && d.slotAction==="buy") triggered=true;
      // composite_sell: score≤36 + SAR bajista + al menos 8 velas alcistas previas (confirmación de agotamiento)
      if(a.cond==="composite_sell" && d.compositeScore<=36 && !d.sar.sarBull && d.sar.streak>=8) triggered=true;

      if(triggered){
        // Play beep
        try{
          const ctx=new (window.AudioContext||window.webkitAudioContext)();
          const osc=ctx.createOscillator();
          const gain=ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = a.type==="buy" ? 880 : 440;
          osc.type="sine";
          gain.gain.setValueAtTime(0.3,ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.8);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime+0.8);
        }catch(e){}
        const hh=String(et.getHours()).padStart(2,"0"), mm=String(et.getMinutes()).padStart(2,"0");
        return {...a, fired:true, firedAt:`${hh}:${mm} ET`};
      }
      return a;
    }));
  },[now, alarms, tickers]);

  function addAlarm(){
    const label = buildCondLabel(aForm);
    const newAlarm={
      id: alarmIdRef.current++,
      ticker: aForm.ticker,
      type: aForm.type,
      cond: aForm.cond,
      scoreThreshold: ["score_high","score_low"].includes(aForm.cond) ? aForm.scoreThreshold : null,
      condLabel: label,
      enabled: true,
      fired: false,
      firedAt: null,
    };
    setAlarms(prev=>[...prev, newAlarm]);
    setAlarmModal(false);
  }

  function buildCondLabel(f){
    const labels={
      score_high:    `Score compuesto ≥ ${f.scoreThreshold}`,
      score_low:     `Score compuesto ≤ ${f.scoreThreshold}`,
      rec_buy:       "Recomendación = COMPRAR",
      rec_sell:      "Recomendación = NO COMPRAR",
      sar_bull:      "SAR en tendencia alcista",
      sar_bear:      "SAR en tendencia bajista",
      sar_reversal:  "SAR señal de REVERSIÓN",
      slot_buy:      "Franja horaria = COMPRAR",
      slot_avoid:    "Franja horaria = EVITAR",
      vol_high:      "Volumen ≥ 150% del promedio",
      liq_low:       "Liquidez ≤ 35/100 (riesgo slippage)",
      composite_buy: "Señal COMPRA compuesta (score≥68 + SAR alcista + franja ok)",
      composite_sell:"Señal VENTA compuesta (score≤36 + SAR bajista)",
    };
    return labels[f.cond]||f.cond;
  }

  function resetFired(id){
    setAlarms(prev=>prev.map(a=>a.id===id?{...a,fired:false,firedAt:null}:a));
  }

  const h=now.getHours(), m=now.getMinutes(), sec=now.getSeconds();
  const tot=h*60+m, wd=now.getDay();
  const isOpen = wd>=1&&wd<=5&&tot>=570&&tot<960;
  const slot   = getSlot(now);
  const t      = tickers[active];
  const nowPct = isOpen ? Math.min((tot-570)/(960-570)*100,99) : null;

  let sigTxt="FUERA DE SESIÓN", sigCol=C.mut, sigDesc="Mercado cerrado. Próxima apertura: 9:30 AM ET.";
  if(slot!==-1){
    const a=t.actions[slot], p=t.patterns[slot];
    sigDesc=p.window+": "+p.reason;
    if(a==="buy")  { sigTxt="↑ BUEN MOMENTO"; sigCol=C.buy;  }
    else if(a==="avoid"){ sigTxt="✕ EVITAR"; sigCol=C.sell; }
    else           { sigTxt="~ NEUTRAL";      sigCol="#b0a890"; }
  }

  function openModal(){
    setSym("");setName("");setPicked(PAL[0]);setMsg({t:"",err:false});setLoading(false);
    setModal(true);setTimeout(()=>ref.current?.focus(),120);
  }

  function doRemove(s){
    if(Object.keys(tickers).length<=1){setConfirming(null);return;}
    const nx={...tickers}; delete nx[s];
    setTickers(nx); setConfirming(null);
    if(active===s) setActive(Object.keys(nx)[0]);
  }

  function doAdd(){
    const symbol=sym.trim().toUpperCase();
    if(!symbol)         {setMsg({t:"Ingresa un símbolo.",err:true});return;}
    if(tickers[symbol]) {setMsg({t:`${symbol} ya está en la lista.`,err:true});return;}
    setLoading(true); setMsg({t:`Generando perfil de ${symbol}…`,err:false});
    setTimeout(()=>{
      const prof=generateProfile(symbol,name.trim());
      setTickers(prev=>({...prev,[symbol]:{color:picked,...prof}}));
      setActive(symbol); setModal(false); setLoading(false);
    },800);
  }

  return(
    <div style={{background:C.bg,color:C.ink,fontFamily:mono,minHeight:"100vh",padding:"18px 16px",fontSize:14}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow:wght@700;800&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes prg{0%{width:0%;margin-left:0}50%{width:65%;margin-left:0}100%{width:0%;margin-left:100%}}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:18,paddingBottom:12,borderBottom:`2px solid ${C.ink}`}}>
        <div>
          <div style={{fontFamily:bold,fontSize:"1.6rem",fontWeight:800,letterSpacing:"-.03em",lineHeight:1}}>
            Intra<span style={{color:C.warn}}>day</span> Timer
          </div>
          <div style={{fontSize:".49rem",letterSpacing:".12em",textTransform:"uppercase",color:C.mut,marginTop:4}}>
            Momento óptimo de compra · sesión NYSE / NASDAQ
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:"1.2rem",fontWeight:500,letterSpacing:"-.02em"}}>{pad(h)}:{pad(m)}:{pad(sec)} ET</div>
          <div style={{fontSize:".49rem",letterSpacing:".12em",textTransform:"uppercase",color:C.mut,marginTop:3,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:5}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:isOpen?C.buy:C.warn,display:"inline-block",flexShrink:0,animation:isOpen?"blink 1.4s ease-in-out infinite":undefined}}/>
            {isOpen?"Mercado abierto · NYSE":"Mercado cerrado"}
          </div>
        </div>
      </header>

      {/* ── TICKER BAR ── */}
      <div style={{marginBottom:16}}>
        {/* Category rows */}
        {Object.entries(CATEGORIES).map(([cat, syms])=>{
          // Only show categories that have at least one ticker loaded
          const present = syms.filter(s => tickers[s]);
          // Also show any tickers not in any category (custom added)
          const allCatSyms = Object.values(CATEGORIES).flat();
          if (cat === Object.keys(CATEGORIES)[Object.keys(CATEGORIES).length-1]) {
            const uncategorized = Object.keys(tickers).filter(s => !allCatSyms.includes(s));
            uncategorized.forEach(s => { if (!present.includes(s)) present.push(s); });
          }
          if (present.length === 0) return null;
          return (
            <div key={cat} style={{display:"flex",alignItems:"center",gap:0,marginBottom:4,flexWrap:"wrap",gap:4}}>
              <span style={{fontSize:".44rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,minWidth:90,flexShrink:0,paddingRight:6}}>{cat}</span>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {present.map(sym=>{
                  if (!tickers[sym]) return null;
                  const tk=tickers[sym], isAct=sym===active;
                  const isConf=confirming===sym;
                  return (
                    <div key={sym} style={{display:"flex",alignItems:"stretch",background:isAct?tk.color:C.sur,border:`1px solid ${isAct?tk.color:C.bor}`,transition:"all .15s"}}>
                      <button onClick={()=>{setActive(sym);setConfirming(null);}}
                        style={{fontFamily:bold,fontSize:".72rem",fontWeight:700,padding:"5px 10px",cursor:"pointer",background:"transparent",border:"none",color:isAct?contrast(tk.color):C.mut,letterSpacing:".04em",whiteSpace:"nowrap"}}>
                        {sym}
                      </button>
                      {!isConf
                        ? <button onClick={()=>setConfirming(sym)}
                            style={{padding:"0 6px 0 0",cursor:"pointer",background:"transparent",border:"none",color:isAct?contrast(tk.color):C.mut,fontSize:".6rem",opacity:.5,display:"flex",alignItems:"center",lineHeight:1}}>
                            ✕
                          </button>
                        : <div style={{display:"flex",alignItems:"center",gap:3,padding:"0 6px",background:"rgba(0,0,0,.12)"}}>
                            <span style={{fontSize:".48rem",color:isAct?contrast(tk.color):C.mut,whiteSpace:"nowrap"}}>¿Borrar?</span>
                            <button onClick={()=>doRemove(sym)} style={{fontSize:".56rem",fontWeight:700,padding:"1px 5px",cursor:"pointer",background:C.sell,color:"#fff",border:"none",borderRadius:2}}>Sí</button>
                            <button onClick={()=>setConfirming(null)} style={{fontSize:".56rem",fontWeight:700,padding:"1px 5px",cursor:"pointer",background:"rgba(0,0,0,.15)",color:isAct?contrast(tk.color):C.ink,border:"none",borderRadius:2}}>No</button>
                          </div>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* Add button */}
        <div style={{marginTop:6}}>
          <button onClick={openModal} style={{fontFamily:bold,fontSize:".75rem",fontWeight:700,padding:"6px 14px",cursor:"pointer",background:"transparent",border:`2px dashed ${C.mut}`,color:C.mut,letterSpacing:".04em"}}>
            ＋ Agregar activo
          </button>
        </div>
      </div>

      {/* ── DAILY TREND INDICATOR ── */}
      <DailyTrendPanel ticker={t} tickerSymbol={active} et={now}/>

      {/* ── MAIN GRID ── */}
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr)",gap:12,marginBottom:12}}>
        <div>
          <div style={{background:C.sur,border:`2px solid ${C.ink}`,padding:18,marginBottom:11}}>
            <div style={{fontSize:".46rem",letterSpacing:".2em",textTransform:"uppercase",color:C.mut,marginBottom:10,paddingBottom:7,borderBottom:`1px solid ${C.bor}`}}>
              Perfil de actividad intradiaria · sesión NYSE (ET)
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              {AXLBLS.map(l=><div key={l} style={{fontSize:".45rem",color:C.mut,textAlign:"center",width:32,marginLeft:-16}}>{l}</div>)}
            </div>
            <div style={{position:"relative"}}>
              <div style={{height:48,display:"flex",overflow:"hidden",border:`1px solid ${C.bor}`}}>
                {t.scores.map((sc,i)=>(
                  <div key={i} style={{width:`${100/7}%`,height:"100%",background:ACOL[t.actions[i]],opacity:0.35+sc/100*0.65,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:3}}>
                    <span style={{fontSize:".37rem",letterSpacing:".05em",textTransform:"uppercase",color:"rgba(255,255,255,.85)",fontWeight:600,whiteSpace:"nowrap"}}>{HLBLS[i]}</span>
                  </div>
                ))}
              </div>
              {nowPct!==null&&<div style={{position:"absolute",top:0,bottom:0,left:`${nowPct}%`,width:2,background:C.warn,zIndex:10}}><span style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",fontSize:".37rem",letterSpacing:".1em",color:C.warn,whiteSpace:"nowrap"}}>AHORA</span></div>}
            </div>
            <HourBars t={t}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {t.metrics.map((m,i)=>(
              <div key={i} style={{border:`1px solid ${C.bor}`,padding:10,background:C.sur}}>
                <div style={{fontSize:".44rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:3}}>{m.label}</div>
                <div style={{fontFamily:bold,fontSize:"1.05rem",fontWeight:800,color:t.color}}>{m.val}</div>
                <div style={{fontSize:".46rem",color:C.mut,marginTop:2}}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Signal + windows — full width row below */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
        <div style={{background:C.ink,color:C.bg,padding:14}}>
          <div style={{fontSize:".44rem",letterSpacing:".16em",textTransform:"uppercase",opacity:.5,marginBottom:5}}>Señal ahora mismo</div>
          <div style={{fontFamily:bold,fontSize:"1.2rem",fontWeight:800,color:sigCol,lineHeight:1,marginBottom:4}}>{sigTxt}</div>
          <div style={{fontSize:".54rem",opacity:.65,lineHeight:1.5}}>{sigDesc}</div>
        </div>
        <div style={{border:`2px solid ${C.bor}`,padding:12,background:C.sur}}>
          <div style={{fontSize:".44rem",letterSpacing:".16em",textTransform:"uppercase",color:C.mut,marginBottom:6}}>✦ Mejor ventana</div>
          <div style={{fontFamily:bold,fontSize:".85rem",fontWeight:700,marginBottom:3}}>{t.bestWindow}</div>
          <div style={{fontSize:".52rem",color:C.mut,lineHeight:1.5}}>{t.bestReason}</div>
        </div>
        <div style={{border:`2px solid ${C.bor}`,padding:12,background:C.sur}}>
          <div style={{fontSize:".44rem",letterSpacing:".16em",textTransform:"uppercase",color:C.mut,marginBottom:6}}>✕ Peor momento</div>
          <div style={{fontFamily:bold,fontSize:".85rem",fontWeight:700,color:C.warn,marginBottom:3}}>{t.worstWindow}</div>
          <div style={{fontSize:".52rem",color:C.mut,lineHeight:1.5}}>{t.worstReason}</div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div style={{background:C.sur,border:`2px solid ${C.ink}`,padding:16,marginBottom:12}}>
        <div style={{fontSize:".46rem",letterSpacing:".2em",textTransform:"uppercase",color:C.mut,marginBottom:10,paddingBottom:7,borderBottom:`1px solid ${C.bor}`}}>
          Patrones estadísticos por franja horaria
        </div>
        <div style={{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",minWidth:500,borderCollapse:"collapse"}}>
          <thead><tr>
            {["Hora (ET)","Franja","Patrón típico","Señal","Vol.","Spread","Razón"].map(h=>(
              <th key={h} style={{fontSize:".44rem",letterSpacing:".15em",textTransform:"uppercase",color:C.mut,textAlign:"left",padding:"5px 8px",borderBottom:`1px solid ${C.bor}`}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {t.patterns.map((p,i)=>(
              <tr key={i}>
                <td style={{fontSize:".61rem",padding:"7px 8px",borderBottom:`1px solid ${C.crm}`,fontWeight:500,whiteSpace:"nowrap"}}>{p.time}</td>
                <td style={{fontSize:".61rem",padding:"7px 8px",borderBottom:`1px solid ${C.crm}`}}>{p.window}</td>
                <td style={{fontSize:".61rem",padding:"7px 8px",borderBottom:`1px solid ${C.crm}`,color:C.mut}}>{p.pattern}</td>
                <td style={{fontSize:".61rem",padding:"7px 8px",borderBottom:`1px solid ${C.crm}`}}><Pill action={p.action}/></td>
                <td style={{fontSize:".61rem",padding:"7px 8px",borderBottom:`1px solid ${C.crm}`,whiteSpace:"nowrap"}}>{p.vol}</td>
                <td style={{fontSize:".61rem",padding:"7px 8px",borderBottom:`1px solid ${C.crm}`,whiteSpace:"nowrap"}}>{p.spread}</td>
                <td style={{fontSize:".59rem",padding:"7px 8px",borderBottom:`1px solid ${C.crm}`,color:C.mut}}>{p.reason}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      {/* ── ALARM PANEL ── */}
      <AlarmPanel
        alarms={alarms}
        tickers={tickers}
        onDelete={id=>setAlarms(prev=>prev.filter(a=>a.id!==id))}
        onToggle={id=>setAlarms(prev=>prev.map(a=>a.id===id?{...a,fired:false,firedAt:null}:a))}
        onAdd={addAlarm}
        openAlarmModal={()=>{ setAForm({ticker:active,type:"buy",cond:"composite_buy",scoreThreshold:70}); setAlarmModal(true); }}
      />

      <div style={{fontSize:".49rem",color:C.mut,lineHeight:1.6,borderTop:`1px solid ${C.bor}`,paddingTop:10}}>
        ⚠ Herramienta educativa basada en patrones estadísticos históricos. No constituye asesoramiento financiero.
      </div>

      {/* ── ALARM MODAL ── */}
      {alarmModal&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setAlarmModal(false);}}
          style={{position:"fixed",inset:0,background:"rgba(24,21,15,.7)",zIndex:1001,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)"}}>
          <div style={{background:C.sur,border:`2px solid ${C.ink}`,padding:24,width:420,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontFamily:bold,fontSize:"1.2rem",fontWeight:800,letterSpacing:"-.02em",marginBottom:3}}>Nueva alarma</div>
            <div style={{fontSize:".49rem",color:C.mut,letterSpacing:".08em",textTransform:"uppercase",marginBottom:18}}>
              Se activa cuando se cumpla la condición durante el mercado abierto
            </div>

            {/* Ticker */}
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:".46rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:5}}>Activo</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {Object.keys(tickers).map(s=>(
                  <button key={s} onClick={()=>setAForm(f=>({...f,ticker:s}))} style={{
                    fontFamily:bold,fontSize:".72rem",fontWeight:700,padding:"4px 10px",cursor:"pointer",
                    background: aForm.ticker===s ? tickers[s].color : "transparent",
                    color: aForm.ticker===s ? contrast(tickers[s].color) : C.mut,
                    border:`1px solid ${aForm.ticker===s ? tickers[s].color : C.bor}`,
                    transition:"all .12s"
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:".46rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:5}}>Tipo de alarma</label>
              <div style={{display:"flex",gap:6}}>
                {[["buy","COMPRA",C.buy],["sell","VENTA",C.sell],["alert","ALERTA",C.warn]].map(([v,l,col])=>(
                  <button key={v} onClick={()=>setAForm(f=>({...f,type:v}))} style={{
                    flex:1,fontFamily:bold,fontSize:".75rem",fontWeight:700,padding:"7px",cursor:"pointer",
                    background: aForm.type===v ? col : "transparent",
                    color: aForm.type===v ? "#fff" : C.mut,
                    border:`2px solid ${aForm.type===v ? col : C.bor}`,
                    transition:"all .12s"
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:".46rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:5}}>Condición</label>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {[
                  ["composite_buy",  "🟢 COMPRA compuesta: score≥68 + SAR alcista ≥2 velas + franja ok"],
                  ["composite_sell", "🔴 VENTA compuesta: score≤36 + SAR bajista + ≥8 velas alcistas previas"],
                  ["rec_buy",        "↑ Recomendación diaria = COMPRAR"],
                  ["rec_sell",       "↓ Recomendación diaria = NO COMPRAR"],
                  ["score_high",     "📊 Score compuesto supera umbral"],
                  ["score_low",      "📊 Score compuesto cae bajo umbral"],
                  ["sar_bull",       "▲ SAR entra en tendencia alcista"],
                  ["sar_bear",       "▼ SAR entra en tendencia bajista"],
                  ["sar_reversal",   "↔ SAR señal de reversión"],
                  ["slot_buy",       "🕐 Franja horaria actual = COMPRAR"],
                  ["slot_avoid",     "🕐 Franja horaria actual = EVITAR"],
                  ["vol_high",       "📈 Volumen ≥ 150% del promedio"],
                  ["liq_low",        "⚠ Liquidez baja (≤35) — riesgo slippage"],
                ].map(([v,l])=>(
                  <button key={v} onClick={()=>setAForm(f=>({...f,cond:v}))} style={{
                    textAlign:"left",fontFamily:mono,fontSize:".62rem",padding:"7px 10px",cursor:"pointer",
                    background: aForm.cond===v ? C.ink : "transparent",
                    color: aForm.cond===v ? C.bg : C.ink,
                    border:`1px solid ${aForm.cond===v ? C.ink : C.bor}`,
                    transition:"all .12s"
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Score threshold (only for score conditions) */}
            {["score_high","score_low"].includes(aForm.cond)&&(
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:".46rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:5}}>
                  Umbral de score (0–100): <strong style={{color:C.ink}}>{aForm.scoreThreshold}</strong>
                </label>
                <input type="range" min={0} max={100} value={aForm.scoreThreshold}
                  onChange={e=>setAForm(f=>({...f,scoreThreshold:parseInt(e.target.value)}))}
                  style={{width:"100%",accentColor:C.ink}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:".46rem",color:C.mut,marginTop:2}}>
                  <span>0 (venta fuerte)</span><span>50 (neutral)</span><span>100 (compra fuerte)</span>
                </div>
              </div>
            )}

            {/* Preview */}
            <div style={{padding:"10px 12px",background:C.bg,border:`1px solid ${C.bor}`,marginBottom:16}}>
              <div style={{fontSize:".44rem",color:C.mut,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Vista previa</div>
              <div style={{fontSize:".65rem",color:C.ink,lineHeight:1.5}}>
                Alarma de <strong>{aForm.type==="buy"?"COMPRA":aForm.type==="sell"?"VENTA":"ALERTA"}</strong> para <strong>{aForm.ticker}</strong>
                {" · "}{buildCondLabel(aForm)}
              </div>
            </div>

            <div style={{display:"flex",gap:7}}>
              <button onClick={()=>setAlarmModal(false)} style={{fontFamily:bold,fontSize:".83rem",fontWeight:700,padding:"9px 14px",background:"transparent",color:C.mut,border:`2px solid ${C.bor}`,cursor:"pointer"}}>Cancelar</button>
              <button onClick={addAlarm} style={{flex:1,fontFamily:bold,fontSize:".83rem",fontWeight:700,padding:9,background:C.ink,color:C.bg,border:`2px solid ${C.ink}`,cursor:"pointer"}}>
                Crear alarma →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {modal&&(
        <div onClick={e=>{if(e.target===e.currentTarget)setModal(false);}} style={{position:"fixed",inset:0,background:"rgba(24,21,15,.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)"}}>
          <div style={{background:C.sur,border:`2px solid ${C.ink}`,padding:24,width:370,maxWidth:"94vw"}}>
            <div style={{fontFamily:bold,fontSize:"1.2rem",fontWeight:800,letterSpacing:"-.02em",marginBottom:3}}>Agregar activo</div>
            <div style={{fontSize:".49rem",color:C.mut,letterSpacing:".08em",textTransform:"uppercase",marginBottom:16}}>Ingresa el ticker para generar su perfil intradiario</div>
            <div style={{marginBottom:11}}>
              <label style={{display:"block",fontSize:".46rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Símbolo (ticker)</label>
              <input ref={ref} value={sym} onChange={e=>setSym(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&doAdd()} placeholder="AAPL, TSLA, NVDA, SPY…" maxLength={8}
                style={{width:"100%",fontFamily:mono,fontSize:".8rem",padding:"7px 9px",border:`2px solid ${C.bor}`,background:C.bg,color:C.ink,outline:"none"}}/>
            </div>
            <div style={{marginBottom:11}}>
              <label style={{display:"block",fontSize:".46rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:4}}>Nombre de la empresa (opcional)</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej: Apple Inc."
                style={{width:"100%",fontFamily:mono,fontSize:".8rem",padding:"7px 9px",border:`2px solid ${C.bor}`,background:C.bg,color:C.ink,outline:"none"}}/>
            </div>
            <div style={{marginBottom:11}}>
              <label style={{display:"block",fontSize:".46rem",letterSpacing:".14em",textTransform:"uppercase",color:C.mut,marginBottom:6}}>Color identificador</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {PAL.map(c=><div key={c} onClick={()=>setPicked(c)} style={{width:24,height:24,borderRadius:"50%",cursor:"pointer",background:c,border:c===picked?`2px solid ${C.ink}`:"2px solid transparent",transform:c===picked?"scale(1.15)":"scale(1)",transition:"all .15s",flexShrink:0}}/>)}
              </div>
            </div>
            {loading&&<div style={{height:3,background:C.bor,overflow:"hidden",margin:"8px 0"}}><div style={{height:"100%",background:C.warn,animation:"prg 1.8s ease-in-out infinite"}}/></div>}
            <div style={{fontSize:".55rem",color:msg.err?C.sell:C.mut,textAlign:"center",minHeight:14,margin:"4px 0"}}>{msg.t}</div>
            <div style={{display:"flex",gap:7,marginTop:14}}>
              <button onClick={()=>setModal(false)} style={{fontFamily:bold,fontSize:".83rem",fontWeight:700,padding:"9px 14px",background:"transparent",color:C.mut,border:`2px solid ${C.bor}`,cursor:"pointer"}}>Cancelar</button>
              <button onClick={doAdd} disabled={loading} style={{flex:1,fontFamily:bold,fontSize:".83rem",fontWeight:700,padding:9,background:loading?"#555":C.ink,color:C.bg,border:`2px solid ${C.ink}`,cursor:loading?"not-allowed":"pointer",opacity:loading?.6:1}}>
                {loading?"Generando perfil…":"Agregar activo →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
