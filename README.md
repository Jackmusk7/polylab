# ◆ PolyLab v2

Hub de projet pour le trading algorithmique sur Polymarket.

## Stack

- React 18 + Vite
- Supabase (persistance + sync)
- Drag & drop natif HTML5
- Deploy Vercel

## Structure des pages

- **Espace** : notes libres + TODO list + agenda hebdomadaire
- **Stratégies** : kanban 3 colonnes (En recherche / Pour plus tard / En ligne)
- **Ressources** : liens utiles par catégorie
- **Guide Polymarket** : le guide complet intégré

## 1️⃣ Variables d'environnement Vercel

Dans ton projet Vercel → Settings → Environment Variables, ajoute :

```
VITE_SUPABASE_URL = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
```

Puis redéploie. Sans ces variables, l'app fonctionne quand même en mode localStorage (pas synchronisé entre users).

## 2️⃣ Schéma Supabase (SQL à exécuter)

Dans Supabase → SQL Editor → New query, colle et exécute :

```sql
-- STRATÉGIES
create table if not exists strategies (
  id text primary key,
  title text,
  icon text,
  status text check (status in ('research', 'later', 'live')),
  pitch text,
  edge text,
  conditions text,
  estimates text,
  notes text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- NOTES
create table if not exists notes (
  id text primary key,
  content text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TODOS
create table if not exists todos (
  id text primary key,
  text text,
  done boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- AGENDA
create table if not exists agenda (
  id text primary key,
  week_start date,
  goals text,
  updated_at timestamptz default now()
);

-- RESSOURCES
create table if not exists resources (
  id text primary key,
  category text,
  title text,
  url text,
  note text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- RLS (optionnel, plus permissif pour un outil perso à deux)
alter table strategies disable row level security;
alter table notes disable row level security;
alter table todos disable row level security;
alter table agenda disable row level security;
alter table resources disable row level security;
```

> ⚠️ Si tu laisses RLS désactivé, n'importe qui avec l'anon key peut lire/écrire. OK pour un outil perso à 2 utilisateurs de confiance. Si besoin d'une vraie authentification, on pourra ajouter ça plus tard.

## 3️⃣ Déploiement

```bash
# En local
npm install
npm run dev  # → http://localhost:5173

# Push sur GitHub → Vercel détecte et deploy automatiquement
git add .
git commit -m "PolyLab v2"
git push
```

## Fonctionnement

- **Au premier chargement** : si la DB Supabase est vide, elle est automatiquement pré-remplie avec les 6 stratégies initiales et les ressources de base.
- **Persistance** : chaque modif est sauvegardée dans Supabase en temps réel.
- **Sync** : toi + ton associé voyez la même base de données.
- **Fallback local** : si Supabase n'est pas configuré, l'app utilise `localStorage` (pas de sync entre vous).

## Indicateur de sync

En haut à droite de la navbar :
- 🟢 **Synced** : connecté à Supabase, tes changements sont sauvegardés pour tous
- 🟡 **Local** : mode localStorage, changements visibles seulement dans ce navigateur
