# Gestion des présences — CIM

Application de suivi des présences et de calcul de la paie du personnel.

## Démarrage

**Option simple :** double-cliquez sur `start.bat`. Il installe les dépendances si besoin, démarre l'application et ouvre votre navigateur automatiquement.

**Option manuelle :**

```bash
npm install
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

Pour arrêter l'application, retournez dans la fenêtre noire (terminal) qui s'est ouverte et appuyez sur `Ctrl+C`, ou fermez simplement la fenêtre.

## Fonctionnement

- **Calendrier** : cliquez sur un jour pour indiquer qui était présent. Le vendredi est automatiquement un jour de repos (non modifiable).
- **Paie** : chaque employé présent gagne 1000 DA par jour, sauf **Nadjib** qui est payé 1000 DA par scanner effectué (donc 0 DA s'il n'a fait aucun scanner, et plus de 1000 DA s'il en a fait plusieurs).
- **Récapitulatif** : le panneau à droite du calendrier affiche le total du mois affiché, par employé et au global. Il se met à jour automatiquement.
- **Employés** : la page "Employés" permet d'ajouter un nouvel employé ou de désactiver un employé qui ne travaille plus (son historique de paie est conservé).

## Où sont stockées les données

Tout est enregistré localement dans le dossier `data/` :

- `data/employees.json` — la liste des employés
- `data/attendance.json` — les présences et scanners jour par jour

**Sauvegarde :** pour conserver une copie de sécurité, il suffit de copier ce dossier `data/` ailleurs (clé USB, autre dossier). Comme le projet est dans OneDrive, ces fichiers sont aussi automatiquement synchronisés dans le cloud.

**Attention :** ne modifiez pas ces fichiers `.json` à la main pendant que l'application est ouverte, au risque de perdre des données.

## Prérequis technique

[Node.js](https://nodejs.org/) (version 18 ou plus récente) doit être installé sur l'ordinateur. C'est déjà le cas si `start.bat` ou `npm install` fonctionnent sans erreur.

## Utiliser l'application en ligne (téléphone)

L'application peut être hébergée gratuitement sur [Vercel](https://vercel.com) pour être utilisée depuis n'importe où, sans que l'ordinateur soit allumé. En ligne, les données sont stockées dans une base **Upstash Redis** au lieu du dossier `data/`, et l'accès est protégé par un mot de passe.

1. Sur Vercel, importez le dépôt GitHub `gestion-de-presence` (bouton **Add New → Project**).
2. Dans le projet Vercel, onglet **Storage** → **Upstash for Redis** → créez une base (offre gratuite) et liez-la au projet. Les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` sont ajoutées automatiquement.
3. Onglet **Settings → Environment Variables** : ajoutez `APP_PASSWORD` avec le mot de passe de votre choix.
4. Onglet **Deployments** : relancez un déploiement (**Redeploy**) pour prendre en compte ces variables.
5. Pour copier les données existantes du dossier `data/` vers la base en ligne : créez un fichier `.env.local` à la racine du projet contenant les deux variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` (visibles dans l'onglet Storage de Vercel), puis lancez :

   ```bash
   node --env-file=.env.local scripts/migrate-to-redis.mjs
   ```

Sur le téléphone, ouvrez l'adresse du site, entrez le mot de passe, puis utilisez **Ajouter à l'écran d'accueil** (menu du navigateur) pour l'ouvrir comme une application.

**Attention :** une fois en ligne, la version de `start.bat` (sur l'ordinateur) continue d'utiliser le dossier `data/` local. Les deux ne sont pas synchronisées : utilisez la version en ligne.
