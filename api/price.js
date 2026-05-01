export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "No symbol" });
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!r.ok) throw new Error("HTTP " + r.status);
    const json = await r.json();
    const meta = json.chart.result[0].meta;
    const p    = meta.regularMarketPrice;
    const prev = meta.chartPreviousClose || meta.previousClose || p;
    const ch   = parseFloat((p - prev).toFixed(2));
    const pct  = parseFloat(((ch / prev) * 100).toFixed(2));
    res.setHeader("Cache-Control", "s-maxage=30");
    res.json({ price: p, change: ch, pct });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
