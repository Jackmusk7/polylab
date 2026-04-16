import React, { useState } from 'react'
import { theme, radius } from './theme'
import Espace from './Espace'
import Strategies from './Strategies'
import Resources from './Resources'
import Guide from './Guide'
import { isSupabaseConfigured } from './supabase'

const TABS = [
  { key: 'espace', label: 'Espace', icon: '✍️' },
  { key: 'strategies', label: 'Stratégies', icon: '◆' },
  { key: 'resources', label: 'Ressources', icon: '🔗' },
  { key: 'guide', label: 'Guide Polymarket', icon: '📖' },
]

export default function App() {
  const [tab, setTab] = useState('espace')

  const renderTab = () => {
    switch (tab) {
      case 'espace': return <Espace />
      case 'strategies': return <Strategies />
      case 'resources': return <Resources />
      case 'guide': return <Guide />
      default: return <Espace />
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      color: theme.textPrimary,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* NAV */}
      <header style={{
        background: 'rgba(10, 11, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '14px 24px',
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: theme.accent, fontSize: 18 }}>◆</span>
            <div style={{
              fontSize: 16, fontWeight: 700,
              color: theme.textPrimary,
              letterSpacing: '-0.01em',
            }}>
              PolyLab
            </div>
          </div>

          {/* Tabs */}
          <nav style={{
            display: 'flex', gap: 4,
            flex: 1, justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  background: tab === t.key ? theme.accentBg : 'transparent',
                  color: tab === t.key ? theme.accent : theme.textSecondary,
                  border: `1px solid ${tab === t.key ? theme.accentDim : 'transparent'}`,
                  borderRadius: radius.md,
                  padding: '7px 14px',
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={(e) => {
                  if (tab !== t.key) {
                    e.currentTarget.style.color = theme.textPrimary
                    e.currentTarget.style.background = theme.bgCard
                  }
                }}
                onMouseLeave={(e) => {
                  if (tab !== t.key) {
                    e.currentTarget.style.color = theme.textSecondary
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Status indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 11, color: theme.textMuted,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isSupabaseConfigured() ? theme.success : theme.warning,
              boxShadow: `0 0 6px ${isSupabaseConfigured() ? theme.success : theme.warning}`,
            }} />
            {isSupabaseConfigured() ? 'Synced' : 'Local'}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main style={{
        flex: 1,
        maxWidth: 1400, width: '100%', margin: '0 auto',
        padding: '32px 24px 60px',
      }}>
        {renderTab()}
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${theme.border}`,
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: 11, color: theme.textDim,
      }}>
        PolyLab · v2.0 · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
