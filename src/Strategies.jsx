import React, { useState, useMemo } from 'react'
import { theme, radius, shadow } from './theme'
import { Button, Input, Textarea, IconButton, Modal, Field, Label } from './ui'
import { useSupabaseTable, uid } from './useSupabase'
import { INITIAL_STRATEGIES } from './initialData'

const STATUSES = [
  { key: 'research', label: 'En recherche', color: theme.statusResearch, bg: theme.statusResearchBg, icon: '🔬', hint: "Idées à creuser, à backtester" },
  { key: 'later', label: 'Pour plus tard', color: theme.statusLater, bg: theme.statusLaterBg, icon: '⏳', hint: "Validées mais pas prioritaires" },
  { key: 'live', label: 'En ligne', color: theme.statusLive, bg: theme.statusLiveBg, icon: '🟢', hint: "Déployées et qui tournent" },
]

// ========================
// CARTE STRATÉGIE
// ========================
const StrategyCard = ({ strategy, onEdit, onDelete, onDragStart, onDragEnd, isDragging }) => {
  const status = STATUSES.find(s => s.key === strategy.status) || STATUSES[0]
  const previewText = strategy.pitch || strategy.notes || ''

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        background: theme.bgElevated,
        border: `1px solid ${theme.border}`,
        borderRadius: radius.md,
        padding: 12,
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        transition: 'all 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = status.color
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.border
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>{strategy.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: theme.textPrimary,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {strategy.title}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={(e) => { e.stopPropagation(); onEdit() }} title="Ouvrir">›</IconButton>
        </div>
      </div>
      {previewText && (
        <div style={{
          fontSize: 12, color: theme.textMuted, lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {previewText}
        </div>
      )}
    </div>
  )
}

// ========================
// COLONNE
// ========================
const Column = ({ status, strategies, onDropStrategy, onEdit, onDelete, onDragStart, onDragEnd, draggingId, onAdd }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDropStrategy(status.key)
      }}
      style={{
        background: isDragOver ? status.bg : theme.bgCard,
        border: `1px solid ${isDragOver ? status.color : theme.border}`,
        borderRadius: radius.lg,
        padding: 14,
        display: 'flex', flexDirection: 'column',
        minHeight: 500,
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, paddingBottom: 10,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{status.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: status.color }}>
              {status.label}
            </div>
            <div style={{ fontSize: 10, color: theme.textDim }}>
              {strategies.length} {strategies.length > 1 ? 'stratégies' : 'stratégie'}
            </div>
          </div>
        </div>
        <IconButton onClick={() => onAdd(status.key)} title="Ajouter une strat dans cette colonne">+</IconButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {strategies.map(s => (
          <StrategyCard
            key={s.id}
            strategy={s}
            onEdit={() => onEdit(s)}
            onDelete={() => onDelete(s.id)}
            onDragStart={(e) => { onDragStart(s.id); e.dataTransfer.effectAllowed = 'move' }}
            onDragEnd={onDragEnd}
            isDragging={draggingId === s.id}
          />
        ))}
        {strategies.length === 0 && (
          <div style={{
            padding: 20, textAlign: 'center', fontSize: 12,
            color: theme.textDim,
            border: `1px dashed ${theme.border}`,
            borderRadius: radius.md,
          }}>
            Glisse une strat ici ou clique sur +
          </div>
        )}
      </div>
    </div>
  )
}

// ========================
// MODAL DÉTAIL / ÉDITION
// ========================
const StrategyModal = ({ strategy, open, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(strategy || {})

  React.useEffect(() => {
    if (strategy) setForm(strategy)
  }, [strategy?.id])

  if (!strategy) return null

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    await onSave(form)
    onClose()
  }

  const handleDelete = async () => {
    if (confirm(`Supprimer "${strategy.title}" ?`)) {
      await onDelete(strategy.id)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`${form.icon || '◆'}  ${form.title || 'Sans titre'}`} maxWidth={780}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <Label>Icône</Label>
          <Input value={form.icon || ''} onChange={e => update('icon', e.target.value)} placeholder="🎯" maxLength={4} style={{ textAlign: 'center', fontSize: 18 }} />
        </div>
        <div>
          <Label>Titre</Label>
          <Input value={form.title || ''} onChange={e => update('title', e.target.value)} placeholder="Nom de la stratégie" />
        </div>
      </div>

      <Field label="Statut">
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUSES.map(s => (
            <button
              key={s.key}
              onClick={() => update('status', s.key)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: form.status === s.key ? s.bg : theme.bgInput,
                border: `1px solid ${form.status === s.key ? s.color : theme.border}`,
                borderRadius: radius.md,
                color: form.status === s.key ? s.color : theme.textSecondary,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Pitch (en une phrase)">
        <Textarea value={form.pitch || ''} onChange={e => update('pitch', e.target.value)} rows={2} placeholder="Qu'est-ce que fait cette stratégie ?" />
      </Field>

      <Field label="Edge">
        <Textarea value={form.edge || ''} onChange={e => update('edge', e.target.value)} rows={3} placeholder="Pourquoi ça marche ? Quel est l'avantage ?" />
      </Field>

      <Field label="Conditions (entrée / skip / exit)">
        <Textarea value={form.conditions || ''} onChange={e => update('conditions', e.target.value)} rows={5} placeholder="Règles précises pour entrer et sortir" />
      </Field>

      <Field label="Estimations">
        <Textarea value={form.estimates || ''} onChange={e => update('estimates', e.target.value)} rows={3} placeholder="Trades/jour, PnL attendu, capital requis..." />
      </Field>

      <Field label="Notes libres">
        <Textarea value={form.notes || ''} onChange={e => update('notes', e.target.value)} rows={6} placeholder="TODO, sources, idées, remarques..." />
      </Field>

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        paddingTop: 12, borderTop: `1px solid ${theme.border}`,
      }}>
        <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>
    </Modal>
  )
}

// ========================
// EXPORT : Stratégies
// ========================
export default function Strategies() {
  const { items: strategies, upsert, remove, setItems } = useSupabaseTable('strategies', INITIAL_STRATEGIES)
  const [draggingId, setDraggingId] = useState(null)
  const [editingStrat, setEditingStrat] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const grouped = useMemo(() => {
    const g = { research: [], later: [], live: [] }
    strategies.forEach(s => {
      const key = ['research', 'later', 'live'].includes(s.status) ? s.status : 'research'
      g[key].push(s)
    })
    Object.keys(g).forEach(k => g[k].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
    return g
  }, [strategies])

  const handleDrop = async (targetStatus) => {
    if (!draggingId) return
    const strat = strategies.find(s => s.id === draggingId)
    if (!strat || strat.status === targetStatus) {
      setDraggingId(null)
      return
    }
    const updated = { ...strat, status: targetStatus }
    setItems(prev => prev.map(s => s.id === draggingId ? updated : s))
    await upsert(updated)
    setDraggingId(null)
  }

  const openEdit = (strat) => {
    setEditingStrat(strat)
    setModalOpen(true)
  }

  const handleAdd = (status = 'research') => {
    const newStrat = {
      id: uid(),
      title: 'Nouvelle stratégie',
      icon: '◆',
      status,
      pitch: '',
      edge: '',
      conditions: '',
      estimates: '',
      notes: '',
      sort_order: strategies.length,
    }
    setEditingStrat(newStrat)
    setModalOpen(true)
  }

  const handleSave = async (strat) => {
    await upsert(strat)
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Stratégies</h1>
          <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
            Déplace les cartes entre les colonnes pour changer leur statut.
          </div>
        </div>
        <Button onClick={() => handleAdd('research')}>+ Nouvelle stratégie</Button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
      }}>
        {STATUSES.map(status => (
          <Column
            key={status.key}
            status={status}
            strategies={grouped[status.key]}
            onDropStrategy={handleDrop}
            onEdit={openEdit}
            onDelete={remove}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
            draggingId={draggingId}
            onAdd={handleAdd}
          />
        ))}
      </div>

      <StrategyModal
        strategy={editingStrat}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingStrat(null) }}
        onSave={handleSave}
        onDelete={remove}
      />
    </div>
  )
}
