import React, { useState } from 'react'
import { theme, radius } from './theme'
import { Button, Input, Textarea, IconButton, Label } from './ui'
import { useSupabaseTable, uid } from './useSupabase'

// ========================
// NOTES LIBRES
// ========================
const NotesPanel = () => {
  const { items: notes, upsert, remove } = useSupabaseTable('notes', [])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [newText, setNewText] = useState('')

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditText(note.content)
  }

  const saveEdit = async () => {
    const original = notes.find(n => n.id === editingId)
    if (original && editText.trim()) {
      await upsert({ ...original, content: editText, updated_at: new Date().toISOString() })
    }
    setEditingId(null)
    setEditText('')
  }

  const addNote = async () => {
    if (!newText.trim()) return
    await upsert({
      id: uid(),
      content: newText,
      sort_order: notes.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    setNewText('')
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Label>Nouvelle note</Label>
        <Textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Jeter une idée, une réflexion, un insight..."
          rows={3}
        />
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={addNote} size="sm" disabled={!newText.trim()}>+ Ajouter</Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notes.length === 0 && (
          <div style={{
            padding: 24, textAlign: 'center',
            color: theme.textMuted, fontSize: 13,
            border: `1px dashed ${theme.border}`,
            borderRadius: radius.md,
          }}>
            Aucune note. Jette tes idées ici.
          </div>
        )}
        {notes.slice().sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || '')).map(note => (
          <div key={note.id} style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: radius.md,
            padding: 12,
          }}>
            {editingId === note.id ? (
              <>
                <Textarea value={editText} onChange={e => setEditText(e.target.value)} rows={4} autoFocus />
                <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditText('') }}>Annuler</Button>
                  <Button size="sm" onClick={saveEdit}>Enregistrer</Button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  fontSize: 13, color: theme.textPrimary, lineHeight: 1.6,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {note.content}
                </div>
                <div style={{
                  marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: 11, color: theme.textDim,
                }}>
                  <span>{note.updated_at ? new Date(note.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <IconButton onClick={() => startEdit(note)} title="Modifier">✎</IconButton>
                    <IconButton onClick={() => remove(note.id)} title="Supprimer" danger>✕</IconButton>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ========================
// TODO LIST
// ========================
const TodosPanel = () => {
  const { items: todos, upsert, remove } = useSupabaseTable('todos', [])
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const addTodo = async () => {
    if (!newText.trim()) return
    await upsert({
      id: uid(),
      text: newText,
      done: false,
      sort_order: todos.length,
      created_at: new Date().toISOString(),
    })
    setNewText('')
  }

  const toggle = async (todo) => {
    await upsert({ ...todo, done: !todo.done })
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = async () => {
    const original = todos.find(t => t.id === editingId)
    if (original && editText.trim()) {
      await upsert({ ...original, text: editText })
    }
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const pending = todos.filter(t => !t.done).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  const done = todos.filter(t => t.done).sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0))

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Nouvelle tâche..."
          onKeyDown={e => { if (e.key === 'Enter') addTodo() }}
        />
        <Button onClick={addTodo} disabled={!newText.trim()}>+</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {pending.map(todo => (
          <TodoRow
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            editText={editText}
            setEditText={setEditText}
            onToggle={() => toggle(todo)}
            onDelete={() => remove(todo.id)}
            onStartEdit={() => startEdit(todo)}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
          />
        ))}
        {pending.length === 0 && (
          <div style={{
            padding: 20, textAlign: 'center',
            color: theme.textMuted, fontSize: 13,
            border: `1px dashed ${theme.border}`,
            borderRadius: radius.md,
          }}>
            Toutes les tâches sont faites 🎉
          </div>
        )}
      </div>

      {done.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Label>Terminées ({done.length})</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
            {done.slice(0, 5).map(todo => (
              <TodoRow
                key={todo.id}
                todo={todo}
                isEditing={editingId === todo.id}
                editText={editText}
                setEditText={setEditText}
                onToggle={() => toggle(todo)}
                onDelete={() => remove(todo.id)}
                onStartEdit={() => startEdit(todo)}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const TodoRow = ({ todo, isEditing, editText, setEditText, onToggle, onDelete, onStartEdit, onSaveEdit, onCancelEdit }) => {
  if (isEditing) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        padding: 10,
        background: theme.bgCard,
        border: `1px solid ${theme.accent}`,
        borderRadius: radius.sm,
      }}>
        <Textarea
          value={editText}
          onChange={e => setEditText(e.target.value)}
          rows={3}
          autoFocus
        />
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm" onClick={onCancelEdit}>Annuler</Button>
          <Button size="sm" onClick={onSaveEdit}>Enregistrer</Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px',
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: radius.sm,
      opacity: todo.done ? 0.5 : 1,
    }}>
      <button
        onClick={onToggle}
        style={{
          width: 18, height: 18, borderRadius: 4,
          border: `1.5px solid ${todo.done ? theme.accent : theme.border}`,
          background: todo.done ? theme.accent : 'transparent',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#0a0b0f', fontSize: 11, fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {todo.done && '✓'}
      </button>
      <span style={{
        flex: 1, fontSize: 13,
        color: theme.textPrimary,
        textDecoration: todo.done ? 'line-through' : 'none',
        wordBreak: 'break-word',
      }}>
        {todo.text}
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        {!todo.done && (
          <IconButton onClick={onStartEdit} title="Modifier">✎</IconButton>
        )}
        <IconButton onClick={onDelete} title="Supprimer" danger>✕</IconButton>
      </div>
    </div>
  )
}

// ========================
// AGENDA DE LA SEMAINE
// ========================
const AgendaPanel = () => {
  const { items: agenda, upsert } = useSupabaseTable('agenda', [])

  // On prend le lundi de la semaine courante comme clé
  const mondayISO = (() => {
    const d = new Date()
    const day = d.getDay() // 0 = dimanche
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d.toISOString().slice(0, 10)
  })()

  const current = agenda.find(a => a.week_start === mondayISO)
  const [goals, setGoals] = useState('')
  const [savedTick, setSavedTick] = useState(false)

  React.useEffect(() => {
    setGoals(current?.goals || '')
  }, [current?.goals])

  const save = async () => {
    await upsert({
      id: current?.id || uid(),
      week_start: mondayISO,
      goals,
      updated_at: new Date().toISOString(),
    })
    setSavedTick(true)
    setTimeout(() => setSavedTick(false), 1500)
  }

  const weekLabel = (() => {
    const d = new Date(mondayISO)
    const end = new Date(d)
    end.setDate(end.getDate() + 6)
    const fmt = (x) => x.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    return `${fmt(d)} → ${fmt(end)}`
  })()

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 13, color: theme.textSecondary }}>
          Semaine du <strong style={{ color: theme.accent }}>{weekLabel}</strong>
        </div>
        <Button size="sm" onClick={save}>
          {savedTick ? '✓ Enregistré' : 'Enregistrer'}
        </Button>
      </div>
      <Textarea
        value={goals}
        onChange={e => setGoals(e.target.value)}
        placeholder="Objectifs de la semaine :&#10;• ...&#10;• ...&#10;• ..."
        rows={14}
      />
    </div>
  )
}

// ========================
// PANEL
// ========================
const Panel = ({ title, icon, children }) => (
  <div style={{
    background: theme.bgCard,
    border: `1px solid ${theme.border}`,
    borderRadius: radius.lg,
    padding: 20,
    display: 'flex', flexDirection: 'column',
    minHeight: 480,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginBottom: 16,
      paddingBottom: 12,
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>{title}</h3>
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
)

// ========================
// EXPORT : Espace
// ========================
export default function Espace() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>Espace</h1>
        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
          Notes, tâches et objectifs de la semaine.
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16,
      }}>
        <Panel title="Notes" icon="📝"><NotesPanel /></Panel>
        <Panel title="À faire" icon="✓"><TodosPanel /></Panel>
      </div>
    </div>
  )
}
