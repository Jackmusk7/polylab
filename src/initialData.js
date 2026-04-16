// Seed data — utilisé seulement si la DB est vide au premier démarrage

export const INITIAL_STRATEGIES = [
  {
    id: 'strat-momentum-btc',
    title: 'Momentum 5m BTC',
    icon: '🎯',
    status: 'live',
    pitch: "Sur les marchés BTC 5 minutes de Polymarket, on scanne chaque minute. Dès que le prix BTC bouge de +0.02% par rapport à la minute précédente ET que le token YES (Up ou Down) se trade entre 0.20 et 0.65, on achète. On suit le sens du mouvement BTC et on garde jusqu'à résolution.",
    edge: "Inefficience microstructurelle du carnet d'ordres Polymarket. Quand BTC bouge, le token met quelques secondes à rattraper. On capture l'écart. Spécifique à BTC (testé sur ETH : non reproductible).",
    conditions: "3 conditions simultanées :\n• Mouvement BTC >= ±0.02%\n• Token entre 0.20 et 0.65\n• Direction = sens du mouvement BTC\n\nExit : hold until resolution uniquement. Pas de stop-loss, pas de take-profit.",
    estimates: "Backtest : +$491 sur 3.5 jours (~$4 200/mois extrapolé)\nLive estimé : ~$2 500-3 000/mois (après slippage/frais/érosion)\nCapital initial : $200\nPosition size : $5-10",
    notes: "✅ VALIDÉE en backtest (504 trades, 55% WR, +$491)\n✅ Tests robustesse passés (zones de prix + variation seuils)\n✅ Test multi-crypto sur ETH : échec → BTC specific\n\nÀ FAIRE avant live :\n- Setup wallet Polygon + VPS DigitalOcean\n- RPC Alchemy/QuickNode premium\n- Auto-claim (redeemPositions) CRITIQUE\n- Circuit breaker si migration oracle\n- Paper trading 48-72h\n- Live small à $5/position",
    sort_order: 0,
  },
  {
    id: 'strat-meteo',
    title: 'Météo multi-villes',
    icon: '🌦️',
    status: 'research',
    pitch: "On achète les tranches de température dont la probabilité réelle (selon 3 modèles météo pros) dépasse le prix Polymarket d'au moins 15%, sizé avec Kelly Criterion, sur 25+ villes.",
    edge: "Prévision météo (Open-Meteo : GFS/ECMWF/HRRR) vs prix Polymarket. Les modèles sont précis à 85-90% à J-1. Le marché est souvent faux sur les petites villes nichées.",
    conditions: "Entrée : edge > 15%\nSkip : edge < 15%, spread trop large, volume trop faible\nSizing : Kelly fractionnel ×0.15, max 3-5% du capital par trade\n\nPyramide de conviction (strat météo v2) :\n• Base (NO 20°C, 21°C) : quasi gratuit, 99.9% sûr\n• Milieu (NO 19°C, NO 18°C) : bons gains, 95-99% sûr\n• Sommet (YES 17°C) : gros gain, 70-80% sûr",
    estimates: "Estimations sur 1 500$ : 800-1 500$/mois\nScalable sur 25+ villes × 365 jours",
    notes: "Sources (gratuites) :\n• Open-Meteo → api.open-meteo.com\n• NOAA NWS → api.weather.gov\n• NOAA NCEI → historique 10 ans\n• METAR → observations aéroport\n\nVilles cibles : Seoul, London, Hong Kong, Mexico, Milan, Tokyo, Shanghai, Paris, Beijing, Tel Aviv, Ankara, NYC... (25+)\n\n⚠️ Chaque marché résout sur la station AÉROPORT, pas le centre-ville.\n\nTODO :\n- Aller chercher les stations aéroport de chaque ville\n- Tester en paper trading\n- Fixer les paramètres Kelly\n\nRéférence : gopfan2 a fait +343K$ avec cette strat.",
    sort_order: 1,
  },
  {
    id: 'strat-updown-btc',
    title: 'Up/Down BTC 5-min (Latency)',
    icon: '₿',
    status: 'later',
    pitch: "On entre dans les 60 dernières secondes quand Binance montre un mouvement clair que Polymarket n'a pas encore pricé, confirmé par l'analyse technique.",
    edge: "Binance = temps réel. Chainlink = MAJ 10-30s. Ce délai = notre avantage.",
    conditions: "Entrée : Score > 0.40 + edge > 10% + mouvement BTC > 0.05%\nSweet spot : T-45 à T-20 secondes, token à 0.60-0.70$\n\nIndicateurs (score composite) :\n• Position vs open (40%)\n• Momentum (25%)\n• RSI micro (15%)\n• VWAP (10%)\n• Volume (10%)\n\nSkip : Mouvement < 0.03%, RSI > 70, volume faible, score < 0.40",
    estimates: "Estimations sur 1 500$ : 1 400-1 700$/mois\nScalabilité : ETH, SOL, XRP, DOGE, BNB × 5m, 15m, 1h = ~1 700 marchés/jour",
    notes: "Infra requise :\n• VPS haute perf (~$24/mois)\n• RPC premium Alchemy/QuickNode ($49-99/mois)\n• WebSocket permanent Polymarket + Binance\n• Co-location idéale : AWS us-east-1\n\nÀ faire avant de coder :\n1. Backtester sur PolyBacktest\n2. Valider que Chainlink lag existe vraiment\n3. Tester sur 2-3 cryptos\n4. Si edge confirmé → archi technique lourde\n\nÀ voir : strat pour le 1h/4h (moins de concurrence bot)",
    sort_order: 2,
  },
  {
    id: 'strat-cross-timeframe',
    title: 'Cross-Timeframe 5→15',
    icon: '🔀',
    status: 'research',
    pitch: "On analyse les 2 premières fenêtres de 5 min pour se positionner sur le marché 15 min dans les 5 dernières minutes.",
    edge: "Aucun bot open source ne fait ça. Notre idée originale. À backtester.",
    conditions: "Variables : D1/D2 (résultats %), V1/V2 (volumes), Delta (vs open 15-min), Ratio_V (V2/V1)\n\nScénarios :\nA) Double Up → UP si Delta > 0.03%\nB) Retournement haussier (D1<0, D2>0, |D2|>|D1|) → UP si Delta > 0.02% ET Ratio_V > 1.5\nC) Retournement baissier → DOWN (inverse de B)\nD) Double Down → DOWN si Delta < -0.03%\n\nSkip si : |Delta| < 0.02%, retournement faible, Ratio_V < 1.0, RSI extrême",
    estimates: "À backtester avant toute estimation",
    notes: "Idée originale, à valider en priorité via PolyBacktest avec un prompt bien construit.",
    sort_order: 3,
  },
  {
    id: 'strat-copy-whale',
    title: 'Copy Whale',
    icon: '🐋',
    status: 'research',
    pitch: "Pas du copy trade pur (trop de latence/slippage). Signal de confirmation quand plusieurs whales convergent → booste la confiance sur nos autres strats.",
    edge: "Les top traders (gopfan2, aenews2, ColdMath) ont un taux de réussite prouvé. Leur convergence = signal fort.",
    conditions: "À définir selon la source de données (PolyTrack, leaderboard, Polyburg).",
    estimates: "Pas une strat autonome, mais un multiplicateur sur les autres.",
    notes: "Outils à explorer :\n• PolyTrack\n• Leaderboard Polymarket\n• Polyburg\n\nLeaderboard météo à tracker : gopfan2 (+343K$), aenews2 (+277K$), ColdMath (+108K$), automatedAltradingbot (+64K$), WeatherTraderBot (+57K$), CoffeeLover (+51K$)",
    sort_order: 4,
  },
  {
    id: 'strat-news-llm',
    title: 'News Speed + LLM',
    icon: '📰',
    status: 'later',
    pitch: "Flux Reuters/AP/X + Claude/GPT-4o. Le bot lit les news, estime l'impact, trade avant les humains.",
    edge: "Latence de parsing news humain = plusieurs minutes. Bot LLM = secondes.",
    conditions: "À définir : seuils d'impact, mapping news → marché, latence max acceptable.",
    estimates: "BoneReader (réf) : +896$ en 8 min documenté.",
    notes: "Complexe + coût API (~$50-200/mois). Garder pour quand on maîtrise les bases.\n\nÀ développer :\n• Sources news (Twitter unusual_whales, DeItaone, Bloomberg)\n• Quel LLM pour la vitesse ?\n• Mapping news → marché concerné\n• Quelle latence atteignable (webhook → LLM → trade)",
    sort_order: 5,
  },
]

export const INITIAL_RESOURCES = [
  // APIs Météo
  { id: 'res-1', category: 'APIs Météo', title: 'Open-Meteo — GFS/ECMWF/HRRR', url: 'https://api.open-meteo.com', note: 'Gratuit, pas de clé', sort_order: 0 },
  { id: 'res-2', category: 'APIs Météo', title: 'NOAA NWS — Prévisions US', url: 'https://api.weather.gov', note: '', sort_order: 1 },
  { id: 'res-3', category: 'APIs Météo', title: 'NOAA NCEI — Historique 10 ans', url: 'https://www.ncei.noaa.gov/cdo-web/', note: '', sort_order: 2 },

  // APIs Polymarket
  { id: 'res-4', category: 'APIs Polymarket', title: 'Docs officielles', url: 'https://docs.polymarket.com', note: '', sort_order: 0 },
  { id: 'res-5', category: 'APIs Polymarket', title: 'Gamma API — Marchés', url: 'https://gamma-api.polymarket.com', note: '', sort_order: 1 },
  { id: 'res-6', category: 'APIs Polymarket', title: 'CLOB API — Ordres', url: 'https://clob.polymarket.com', note: '', sort_order: 2 },

  // APIs Crypto
  { id: 'res-7', category: 'APIs Crypto', title: 'Chainlink BTC/USD', url: 'https://data.chain.link/streams/btc-usd', note: 'Source résolution 5-min', sort_order: 0 },
  { id: 'res-8', category: 'APIs Crypto', title: 'Binance BTC/USDT', url: 'https://www.binance.com/en/trade/BTC_USDT', note: 'Plus rapide = edge', sort_order: 1 },

  // GitHub
  { id: 'res-9', category: 'GitHub', title: 'py-clob-client', url: 'https://github.com/Polymarket/py-clob-client', note: 'Client Python', sort_order: 0 },
  { id: 'res-10', category: 'GitHub', title: 'Polymarket Agents', url: 'https://github.com/Polymarket/agents', note: 'Framework bots IA', sort_order: 1 },
  { id: 'res-11', category: 'GitHub', title: 'WeatherBot', url: 'https://github.com/alteregoeth-ai/weatherbot', note: '20 villes', sort_order: 2 },
  { id: 'res-12', category: 'GitHub', title: 'AI Trading Bot', url: 'https://github.com/dylanpersonguy/Fully-Autonomous-Polymarket-AI-Trading-Bot', note: 'Multi-LLM', sort_order: 3 },
]
