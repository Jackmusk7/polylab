import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

// Génère un UUID v4 simple pour les nouvelles entrées
export const uid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Hook générique pour synchroniser un tableau d'objets avec Supabase
// Fallback localStorage si pas configuré, pour dev/test
export function useSupabaseTable(tableName, initialData = [], orderBy = 'sort_order') {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Charge initial
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!isSupabaseConfigured()) {
        // Fallback localStorage
        try {
          const raw = localStorage.getItem(`polylab_${tableName}`)
          if (raw) {
            setItems(JSON.parse(raw))
          } else if (initialData.length > 0) {
            setItems(initialData)
            localStorage.setItem(`polylab_${tableName}`, JSON.stringify(initialData))
          }
        } catch (e) {
          console.error('LocalStorage error', e)
        }
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order(orderBy, { ascending: true })

        if (cancelled) return
        if (error) throw error

        if (data && data.length > 0) {
          setItems(data)
        } else if (initialData.length > 0) {
          // Seed la base si vide
          const seeded = initialData.map((item, i) => ({ ...item, [orderBy]: i }))
          const { data: inserted, error: insertErr } = await supabase
            .from(tableName)
            .insert(seeded)
            .select()
          if (insertErr) {
            console.warn(`Seed ${tableName} failed:`, insertErr.message)
            setItems(seeded)
          } else {
            setItems(inserted || seeded)
          }
        } else {
          setItems([])
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
        console.error(`Load ${tableName} error:`, e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [tableName])

  // Upsert (ajout ou update)
  const upsert = useCallback(async (item) => {
    const newItem = { ...item, id: item.id || uid() }
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === newItem.id)
      if (idx === -1) return [...prev, newItem]
      const copy = [...prev]
      copy[idx] = newItem
      return copy
    })

    if (!isSupabaseConfigured()) {
      setItems(current => {
        const idx = current.findIndex(i => i.id === newItem.id)
        const next = idx === -1 ? [...current, newItem] : current.map(i => i.id === newItem.id ? newItem : i)
        localStorage.setItem(`polylab_${tableName}`, JSON.stringify(next))
        return next
      })
      return newItem
    }

    try {
      const { data, error } = await supabase.from(tableName).upsert(newItem).select().single()
      if (error) throw error
      return data
    } catch (e) {
      console.error(`Upsert ${tableName} error:`, e)
      throw e
    }
  }, [tableName])

  // Remove
  const remove = useCallback(async (id) => {
    setItems(prev => prev.filter(i => i.id !== id))

    if (!isSupabaseConfigured()) {
      setItems(current => {
        const next = current.filter(i => i.id !== id)
        localStorage.setItem(`polylab_${tableName}`, JSON.stringify(next))
        return next
      })
      return
    }

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id)
      if (error) throw error
    } catch (e) {
      console.error(`Delete ${tableName} error:`, e)
      throw e
    }
  }, [tableName])

  // Reorder (met à jour sort_order pour plusieurs items)
  const reorder = useCallback(async (reordered) => {
    setItems(reordered)

    if (!isSupabaseConfigured()) {
      localStorage.setItem(`polylab_${tableName}`, JSON.stringify(reordered))
      return
    }

    try {
      const updates = reordered.map((item, i) => ({ ...item, [orderBy]: i }))
      const { error } = await supabase.from(tableName).upsert(updates)
      if (error) throw error
    } catch (e) {
      console.error(`Reorder ${tableName} error:`, e)
    }
  }, [tableName, orderBy])

  return { items, loading, error, upsert, remove, reorder, setItems }
}
