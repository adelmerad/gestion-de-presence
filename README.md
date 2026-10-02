# Présences — CIM

Application web de suivi des présences et de calcul de la paie du personnel d'un centre d'imagerie médicale. Elle remplace le cahier de présence et le calcul manuel des salaires : chaque jour, on indique qui a travaillé, et l'application calcule en continu ce qui est dû à chacun pour le mois.

Pensée d'abord pour le téléphone, elle s'utilise depuis n'importe où, à plusieurs, et peut s'installer sur l'écran d'accueil comme une application.

## Fonctionnalités

- **Calendrier mensuel** : saisie des présences jour par jour. Le jour de repos hebdomadaire (vendredi) est verrouillé. Chaque case montre les personnes présentes, et le montant du jour sur grand écran.
- **Médecin du jour** : chaque jour, on désigne le médecin de garde. Le médecin responsable du centre est suivi sans être compté dans la paie ; les médecins remplaçants sont payés selon un montant saisi pour la journée.
- **Plusieurs modes de rémunération** :
  - à la journée de présence, selon le rôle ;
  - à l'acte (nombre d'examens réalisés dans la journée) pour les postes payés au rendement ;
  - avec un bonus par examen quand un membre du personnel payé à la journée réalise aussi des examens ;
  - au montant libre, saisi chaque jour, pour les remplacements.
- **Fiche de paie du mois** : total par employé et total général, recalculés à chaque saisie.
- **Gestion de l'équipe** : ajout, modification et désactivation des employés. Un employé désactivé disparaît du calendrier mais son historique de paie est conservé.
- **Tarifs réglables** : le montant journalier ou par acte de chaque rôle, ainsi que le bonus par examen, se règlent depuis l'interface.
- **Accès protégé** par mot de passe, avec session persistante sur chaque appareil.
- **Interface adaptée au téléphone** : navigation par onglets, fenêtres de saisie en panneau bas, cibles tactiles larges.

## Stack technique

| Domaine | Choix |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions), React 19, TypeScript |
| Interface | Tailwind CSS 4, composants [Radix UI](https://www.radix-ui.com) (fenêtres, menus, listes), icônes Lucide |
| Données | [Upstash Redis](https://upstash.com) en production, fichiers JSON en développement |
| Validation | Zod sur toutes les entrées des API |
| Hébergement | [Vercel](https://vercel.com), déploiement automatique à chaque envoi sur `main` |

## Architecture

```
src/
├── app/
│   ├── (app)/            Pages protégées : calendrier, employés, tarifs
│   ├── api/              Routes REST : présences, employés, tarifs, diagnostic
│   ├── login/            Page de connexion et actions serveur (connexion / déconnexion)
│   └── globals.css       Palette de couleurs et thème (variables CSS)
├── components/           Composants d'interface (calendrier, fiche de paie, formulaires)
│   └── ui/               Composants de base (boutons, fenêtres, menus, badges)
├── lib/
│   ├── db.ts             Accès aux données : choisit Redis ou fichiers JSON
│   ├── redisStore.ts     Stockage Upstash Redis
│   ├── payroll.ts        Calcul de la paie (journalier, mensuel)
│   └── auth.ts           Session par mot de passe
└── proxy.ts              Contrôle d'accès sur toutes les pages et API
```

**Stockage.** En production, chaque employé, chaque jour de présence et chaque tarif est un champ distinct d'un hash Redis : chaque écriture ne touche que sa propre donnée, ce qui évite qu'une saisie faite sur un appareil en écrase une autre faite au même moment sur un autre. Sans configuration Redis, l'application bascule sur des fichiers JSON locaux (dossier `data/`, non versionné), pratique pour le développement.

**Sécurité.** Toutes les pages et routes API passent par `proxy.ts`, qui exige un cookie de session valide (`httpOnly`, `secure`). Ce cookie est dérivé du mot de passe : changer le mot de passe déconnecte immédiatement tous les appareils.

## Configuration

Variables d'environnement (dans Vercel, ou dans `.env.local` en développement) :

| Variable | Rôle |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Adresse REST de la base Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Jeton d'accès à la base |
| `APP_PASSWORD` | Mot de passe de l'application. Sans lui, l'accès est libre (développement uniquement) |

Les noms `KV_REST_API_URL` / `KV_REST_API_TOKEN` (intégration Upstash de Vercel) sont aussi acceptés. Les espaces et guillemets autour des valeurs sont ignorés.

Après toute modification d'une variable dans Vercel, un nouveau déploiement est nécessaire pour qu'elle soit prise en compte. La route `/api/health` (protégée) indique si la base de données répond.

## Développement

Prérequis : Node.js 18 ou plus récent.

```bash
npm install     # installer les dépendances
npm run dev     # serveur de développement
npm run build   # build de production
npm run lint    # vérification du code
```

> **Attention :** si `.env.local` contient les variables Upstash, l'application lancée en développement lit et modifie les **données de production**. Pour travailler sur des données de test, retirez ou renommez ce fichier : les fichiers JSON du dossier `data/` sont alors utilisés.

Pour importer le contenu du dossier `data/` dans la base Redis (refusé si la base contient déjà des présences, sauf avec `--force`, qui les remplace) :

```bash
node --env-file=.env.local scripts/migrate-to-redis.mjs
```

## Déploiement

1. Importer le dépôt GitHub dans Vercel.
2. Créer une base Redis gratuite sur Upstash et renseigner les trois variables ci-dessus dans Vercel.
3. Déployer. Chaque envoi sur la branche `main` redéploie ensuite automatiquement.
