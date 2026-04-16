import React, { useState } from 'react'
import { theme, radius } from './theme'

const Section = ({ num, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: radius.lg,
      padding: 20,
      marginBottom: 14,
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', marginBottom: open ? 14 : 0,
        }}
      >
        <div style={{
          background: theme.accentBg,
          color: theme.accent,
          fontSize: 11, fontWeight: 700,
          padding: '3px 8px', borderRadius: 4,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {num}
        </div>
        <h3 style={{ flex: 1, fontSize: 16, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
          {title}
        </h3>
        <span style={{ color: theme.textMuted, fontSize: 14 }}>{open ? '▾' : '▸'}</span>
      </div>
      {open && <div style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 1.7 }}>{children}</div>}
    </div>
  )
}

const Highlight = ({ children, color = theme.accent }) => (
  <strong style={{ color, fontWeight: 600 }}>{children}</strong>
)

const Box = ({ children, variant = 'default' }) => {
  const variants = {
    default: { bg: theme.bgElevated, border: theme.border, color: theme.textSecondary },
    success: { bg: theme.successBg, border: theme.success, color: theme.success },
    warning: { bg: theme.warningBg, border: theme.warning, color: theme.warning },
    danger: { bg: theme.dangerBg, border: theme.danger, color: theme.danger },
    accent: { bg: theme.accentBg, border: theme.accentDim, color: theme.accent },
  }
  const v = variants[variant]
  return (
    <div style={{
      background: v.bg,
      border: `1px solid ${v.border}`,
      borderRadius: radius.md,
      padding: 12,
      margin: '10px 0',
      fontSize: 13,
      color: v.color,
    }}>
      {children}
    </div>
  )
}

const Grid = ({ children, cols = 2 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 4 ? 160 : 220}px, 1fr))`,
    gap: 10, margin: '10px 0',
  }}>
    {children}
  </div>
)

const Card = ({ icon, title, children }) => (
  <div style={{
    background: theme.bgElevated,
    border: `1px solid ${theme.border}`,
    borderRadius: radius.md,
    padding: 12,
    textAlign: 'center',
  }}>
    {icon && <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>}
    <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 12, color: theme.textMuted }}>{children}</div>
  </div>
)

const Row = ({ label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '8px 0',
    borderBottom: `1px solid ${theme.border}`,
  }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: theme.textPrimary, minWidth: 100 }}>{label}</div>
    <div style={{ fontSize: 12, color: theme.textSecondary, flex: 1 }}>{value}</div>
  </div>
)

export default function Guide() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Guide Polymarket</h1>
        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
          Tout ce qu'il faut savoir — compilé à partir des docs officielles, GitHub, ANJ, médias spécialisés.
        </div>
      </div>

      <Section num="01" title="C'est quoi un marché de prédiction ?">
        Un marché de prédiction est un <Highlight>marché où l'on achète et vend des "actions" liées à des événements futurs</Highlight>. Si tu penses qu'un événement va se produire → parts "OUI". Sinon → parts "NON". Le principe repose sur la <Highlight>sagesse des foules</Highlight>.
        <Grid cols={4}>
          <Card icon="🗳️" title="Politique">Élections, lois</Card>
          <Card icon="📈" title="Économie">Fed, inflation, BTC</Card>
          <Card icon="⚽" title="Sport">NBA, foot, tennis</Card>
          <Card icon="🧪" title="Tech">AGI, SpaceX</Card>
        </Grid>
      </Section>

      <Section num="02" title="Comment fonctionnent les probabilités">
        Chaque marché = question binaire OUI/NON. Prix entre <Highlight>0,00 $</Highlight> et <Highlight>1,00 $</Highlight>. <Highlight>Le prix = la probabilité</Highlight>. OUI à 0,72 $ → le marché estime 72% de chances. Règle d'or : OUI + NON = toujours ~1,00 $.
        <Box variant="accent">
          <strong style={{ color: theme.textPrimary }}>Exemple : "Miami Heat gagnent les NBA Finals ?" — OUI à 0,18 $</strong>
          <Grid cols={2}>
            <div style={{ padding: 10, background: theme.successBg, borderRadius: radius.sm, border: `1px solid ${theme.success}` }}>
              <div style={{ color: theme.success, fontWeight: 700, marginBottom: 4 }}>Tu achètes OUI (100 × 0,18 = 18 $)</div>
              <div style={{ fontSize: 12, color: theme.textSecondary }}>Miami gagne → 100 $ → <strong style={{ color: theme.success }}>+82 $ profit</strong></div>
              <div style={{ fontSize: 12, color: theme.textSecondary }}>Miami perd → 0 $ → <strong style={{ color: theme.danger }}>-18 $ perte</strong></div>
            </div>
            <div style={{ padding: 10, background: theme.dangerBg, borderRadius: radius.sm, border: `1px solid ${theme.danger}` }}>
              <div style={{ color: theme.danger, fontWeight: 700, marginBottom: 4 }}>Tu achètes NON (100 × 0,82 = 82 $)</div>
              <div style={{ fontSize: 12, color: theme.textSecondary }}>Miami perd → 100 $ → <strong style={{ color: theme.success }}>+18 $ profit</strong></div>
              <div style={{ fontSize: 12, color: theme.textSecondary }}>Miami gagne → 0 $ → <strong style={{ color: theme.danger }}>-82 $ perte</strong></div>
            </div>
          </Grid>
        </Box>
        <div style={{ fontSize: 13 }}><Highlight>Revente anticipée :</Highlight> Acheté à 0,30 $, prix monte à 0,70 $ → revends et encaisse sans attendre la résolution.</div>
      </Section>

      <Section num="03" title="Polymarket + le CLOB">
        Plus grande plateforme. 3,6 Mds $ sur Trump vs Harris. Valorisation 2026 : <Highlight>20 Mds $</Highlight>. Peer-to-peer : tu trades avec d'autres utilisateurs, PAS contre Polymarket. 180+ pays.
        <h4 style={{ fontSize: 14, color: theme.accent, marginTop: 14, marginBottom: 8 }}>Le CLOB — Central Limit Order Book</h4>
        <div style={{ fontSize: 13, marginBottom: 10 }}>
          = carnet d'ordres centralisé. Acheteurs (bids) à gauche, vendeurs (asks) à droite. Quand un acheteur et vendeur matchent → trade auto.
        </div>
        <Grid cols={2}>
          <div style={{ background: theme.successBg, padding: 12, borderRadius: radius.md }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.success, marginBottom: 6, textTransform: 'uppercase' }}>Acheteurs (Bids)</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.8 }}>
              0,65 $ — 500 parts<br />
              0,64 $ — 1 200 parts<br />
              0,63 $ — 3 000 parts
            </div>
          </div>
          <div style={{ background: theme.dangerBg, padding: 12, borderRadius: radius.md }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.danger, marginBottom: 6, textTransform: 'uppercase' }}>Vendeurs (Asks)</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.8 }}>
              0,66 $ — 800 parts<br />
              0,67 $ — 2 100 parts<br />
              0,70 $ — 5 000 parts
            </div>
          </div>
        </Grid>
        <div style={{ fontSize: 13, marginTop: 10 }}>
          <Highlight>Ordre Market</Highlight> = achète MAINTENANT au meilleur prix. <Highlight>Ordre Limit</Highlight> = achète à CE prix précis, attends un vendeur. Hybride : matching off-chain (rapide) + settlement on-chain Polygon (transparent).
        </div>
      </Section>

      <Section num="04" title="La couche crypto : USDC &amp; Polygon" defaultOpen={false}>
        Polymarket utilise de la crypto, mais <Highlight>pas de la crypto volatile</Highlight>.
        <Row label="USDC" value="Stablecoin = toujours 1 dollar. Régulé, émis par Circle." />
        <Row label="Polygon" value="Blockchain Layer 2, rapide, frais quasi nuls (~0,01$)." />
        <Row label="Wallet" value="Ton compte crypto. Créé automatiquement à l'inscription." />
        <Box variant="accent">
          <strong>Faut-il un compte Binance ?</strong><br />
          Non. Dépôt par carte via MoonPay (1-4% frais) ou par exchange (Coinbase/Kraken/Binance) en USDC réseau Polygon (~0$ frais).
        </Box>
      </Section>

      <Section num="05" title="Créer un compte et déposer" defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['1', 'Créer un compte', 'Email (Magic Link) ou wallet Web3.'],
            ['2', 'Dépôt carte', 'MoonPay (Visa/MC/Apple Pay). KYC requis. 1-4% frais.'],
            ['3', 'Dépôt crypto', 'Exchange → copie adresse 0x → envoie USDC réseau POLYGON. ~0$ frais.'],
            ['4', 'Trader !', 'Fonds dans le solde → parcours les marchés → passe tes ordres.'],
          ].map(([n, t, d]) => (
            <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
              <div style={{ background: theme.accent, color: '#0a0b0f', fontWeight: 700, fontSize: 12, width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{t}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <Box variant="danger">
          ⚠️ <strong>PIÈGE :</strong> Envoie en réseau <Highlight color={theme.danger}>Polygon</Highlight> (pas Ethereum !). Teste toujours avec 5-10$ d'abord.
        </Box>
      </Section>

      <Section num="06" title="Résolution — Oracle UMA" defaultOpen={false}>
        La blockchain ne lit pas les journaux. L'<Highlight>oracle UMA</Highlight> dit ce qui s'est passé. Oracle "optimiste" : proposeur soumet résultat + 750$ caution → 2h pour contester → si disputé 2× → vote DVM.
        <Grid cols={4}>
          <Card title="Marché fermé">L'événement est passé</Card>
          <Card title="Proposeur">Résultat + 750$ caution</Card>
          <Card title="2h de défi">Période pour contester</Card>
          <Card title="Résolution">Paiement automatique</Card>
        </Grid>
      </Section>

      <Section num="07" title="Frais et coûts réels" defaultOpen={false}>
        <Row label="Trading" value={<><Highlight color={theme.danger}>~petit %</Highlight> — Sur trades gagnants</>} />
        <Row label="Dépôt carte" value={<><Highlight color={theme.warning}>1-4%</Highlight> — Frais MoonPay</>} />
        <Row label="Dépôt crypto" value={<><Highlight color={theme.success}>~0$</Highlight> — Exchange + gas quasi nul</>} />
        <Row label="Retrait" value={<><Highlight color={theme.success}>0$</Highlight> — Aucun frais Polymarket</>} />
        <Row label="Gas Polygon" value={<><Highlight color={theme.success}>&lt; 0,01$</Highlight> — Quasi gratuit</>} />
      </Section>

      <Section num="08" title="France, VPN, gel de compte &amp; risques">
        <Box variant="danger">
          <strong style={{ color: theme.danger }}>🇫🇷 Polymarket est géobloqué et illégal en France depuis fin 2024.</strong><br />
          L'ANJ l'a classé comme jeux d'argent non autorisés. VPN interdit (ToS 2.1.4). Gel de compte = fonds bloqués sans recours.
        </Box>
        <Row label="Nov 2024" value="ANJ intervient, Polymarket géobloque la France" />
        <Row label="2025" value="Détection VPN renforcée, comptes français gelés" />
        <Row label="Fév 2026" value="ANJ publie alerte officielle" />
        <Box variant="success">
          ✅ <strong>Ce qui est possible depuis la France :</strong> APIs et données accessibles partout. Paper trading 100% légal. Seul le trading réel est restreint.
        </Box>
      </Section>

      <Section num="09" title="Comment les bots gagnent de l'argent" defaultOpen={false}>
        <div style={{ fontSize: 13, marginBottom: 10, color: theme.textSecondary }}>
          15% du volume quotidien = bots. Jusqu'à 40% sur certains contrats.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>🌦️ Météo</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>Comparer prévisions NOAA/ECMWF aux prix. 1000$ → 24K$ documenté. gopfan2 : +343K$. Sources gratuites.</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>₿ BTC 5-min</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>Exploiter le lag Binance (temps réel) vs Chainlink (10-30s). BoneReader : 614K$/mois. 652 trades/jour.</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>🐋 Copy Whale</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>Suivre les top wallets. Signal de conviction quand plusieurs convergent.</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>📰 News Speed</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>LLM + Reuters/AP/X. Repricer avant les humains. 896$ en 8 min documenté.</div>
          </div>
        </div>
      </Section>

      <Section num="10" title="Stack technique simplifiée" defaultOpen={false}>
        {[
          ['Python / FastAPI', 'Le langage du bot. Polymarket fournit des outils Python prêts à l\'emploi.'],
          ['Gamma API', 'Le plan du supermarché — trouve les marchés ouverts, prix, tokens.'],
          ['Open-Meteo', 'Les 3 météorologues — GFS, ECMWF, HRRR en parallèle. Gratuit.'],
          ['CLOB API', 'Le bras qui achète — ordres FOK ou GTC en millisecondes.'],
          ['WebSocket', 'Le flux en direct — prix push instantanément, pas de polling.'],
          ['Kelly Criterion', 'Combien miser — gros edge = grosse mise, petit edge = petite mise.'],
          ['Brier Score', 'La note du bot — s\'auto-calibre par ville. 0 = parfait, 0.25 = hasard.'],
          ['SQLite', 'Le carnet de notes — chaque trade, prévision, résultat est stocké.'],
        ].map(([t, d]) => (
          <div key={t} style={{ padding: '8px 0', borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.accent }}>{t}</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>{d}</div>
          </div>
        ))}
      </Section>

      <Section num="11" title="Leaderboard météo — résultats prouvés" defaultOpen={false}>
        <Grid cols={3}>
          {[
            { name: 'gopfan2', pnl: '+343K$', note: '#1 all-time' },
            { name: 'aenews2', pnl: '+277K$', note: '9,9M$ volume' },
            { name: 'ColdMath', pnl: '+108K$', note: '7,8M$ volume' },
            { name: 'automatedAltradingbot', pnl: '+64K$', note: 'Bot confirmé' },
            { name: 'WeatherTraderBot', pnl: '+57K$', note: '1,8M$ volume' },
            { name: 'CoffeeLover', pnl: '+51K$', note: '31% rendement' },
          ].map(t => (
            <div key={t.name} style={{ background: theme.bgElevated, border: `1px solid ${theme.border}`, borderRadius: radius.md, padding: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.textPrimary }}>{t.name}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme.success, margin: '4px 0' }}>{t.pnl}</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>{t.note}</div>
            </div>
          ))}
        </Grid>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 10, fontStyle: 'italic' }}>
          134 marchés actifs, 25+ villes, volumes 60K-530K$/ville/jour. Le marché grossit plus vite que le nombre de bots.
        </div>
      </Section>
    </div>
  )
}
