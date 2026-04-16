import React, { useState, useMemo } from 'react'
import { theme, radius } from './theme'
import { Button, Input, IconButton, Modal, Field, Label } from './ui'
import { useSupabaseTable, uid } from './useSupabase'
import { INITIAL_RESOURCES } from './initialData'

// Modal d'ajout / édition
const ResourceModal = ({ resource, categories, open, onClose, onSave }) => {
  const [form, setForm] = useState(resource || {})

  React.useEffect(() => {
    if (resource) setForm(resource)
  }, [resource?.id])

  if (!resource) return null

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    if (!form.title?.trim() || !form.url?.trim()) return
    await onSave(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={resource.id ? 'Modifier la ressource' : 'Nouvelle ressource'} maxWidth={520}>
      <Field label="Catégorie">
        <Input
          value={form.category || ''}
          onChange={e => update('category', e.target.value)}
          placeholder="APIs Crypto"
          list="categories-datalist"
        />
        <datalist id="categories-datalist">
          {categories.map(c => <option key={c} value={c} />)}
        </datalist>
      </Field>
      <Field label="Titre">
        <Input value={form.title || ''} onChange={e => update('title', e.target.value)} placeholder="Nom du lien" />
      </Field>
      <Field label="URL">
        <Input value={form.url || ''} onChange={e => update('url', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Note">
        <Input value={form.note || ''} onChange={e => update('note', e.target.value)} placeholder="Optionnel" />
      </Field>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button variant="ghost" onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} disabled={!form.title?.trim() || !form.url?.trim()}>Enregistrer</Button>
      </div>
    </Modal>
  )
}

export default function Resources() {
  const { items: resources, upsert, remove } = useSupabaseTable('resources', INITIAL_RESOURCES)
  const [editingRes, setEditingRes] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const grouped = useMemo(() => {
    const map = new Map()
    resources.forEach(r => {
      if (!map.has(r.category)) map.set(r.category, [])
      map.get(r.category).push(r)
    })
    // sort à l'intérieur de chaque catégorie
    map.forEach(arr => arr.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
    return Array.from(map.entries())
  }, [resources])

  const categories = useMemo(() => [...new Set(resources.map(r => r.category))], [resources])

  const handleAdd = (category = '') => {
    const next = {
      id: uid(),
      category,
      title: '',
      url: '',
      note: '',
      sort_order: resources.filter(r => r.category === category).length,
    }
    setEditingRes(next)
    setModalOpen(true)
  }

  const handleEdit = (res) => {
    setEditingRes(res)
    setModalOpen(true)
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Ressources</h1>
          <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
            Liens utiles, APIs, dépôts GitHub.
          </div>
        </div>
        <Button onClick={() => handleAdd('')}>+ Nouvelle ressource</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {grouped.map(([category, items]) => (
          <div key={category} style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: radius.lg,
            padding: 16,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 12, paddingBottom: 10,
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: theme.accent, margin: 0 }}>
                {category || 'Sans catégorie'}
              </h3>
              <Button size="sm" variant="ghost" onClick={() => handleAdd(category)}>+ Lien</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map(res => (
                <div key={res.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: theme.bgElevated,
                  border: `1px solid ${theme.border}`,
                  borderRadius: radius.md,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.textPrimary }}>{res.title}</div>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12, color: theme.accent, textDecoration: 'none',
                        display: 'inline-block', marginTop: 2,
                        wordBreak: 'break-all',
                      }}
                    >
                      {res.url}
                    </a>
                  </div>
                  {res.note && (
                    <div style={{ fontSize: 11, color: theme.textMuted, maxWidth: 200, textAlign: 'right' }}>
                      {res.note}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 2 }}>
                    <IconButton onClick={() => handleEdit(res)} title="Modifier">✎</IconButton>
                    <IconButton onClick={() => { if (confirm('Supprimer cette ressource ?')) remove(res.id) }} title="Supprimer" danger>✕</IconButton>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: theme.textDim, fontStyle: 'italic' }}>
                  Aucun lien
                </div>
              )}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div style={{
            padding: 40, textAlign: 'center',
            color: theme.textMuted, fontSize: 14,
            border: `1px dashed ${theme.border}`,
            borderRadius: radius.lg,
          }}>
            Aucune ressource pour l'instant. Commence par en ajouter une.
          </div>
        )}
      </div>

      <ResourceModal
        resource={editingRes}
        categories={categories}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingRes(null) }}
        onSave={upsert}
      />
    </div>
  )
}
