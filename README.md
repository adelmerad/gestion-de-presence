# Gestion des présences — CIM

Application de suivi des présences et de calcul de la paie du personnel.

## Utilisation

L'application est en ligne : [gestion-de-presence-sooty.vercel.app](https://gestion-de-presence-sooty.vercel.app). Elle fonctionne sur ordinateur et sur téléphone, depuis n'importe où. Un mot de passe est demandé à la première connexion, puis l'appareil reste connecté.

Sur le téléphone, utilisez **Ajouter à l'écran d'accueil** (menu du navigateur) pour l'ouvrir comme une application.

## Fonctionnement

- **Calendrier** : cliquez sur un jour pour indiquer qui était présent. Le vendredi est automatiquement un jour de repos (non modifiable). Sur téléphone, chaque présent est représenté par une pastille de couleur (le chiffre indique le nombre de scanners de Nadjib).
- **Paie** : chaque employé présent est payé le tarif journalier de son rôle, sauf le **manipulateur** (Nadjib) qui est payé par scanner effectué (donc 0 DA s'il n'a fait aucun scanner). Les montants se règlent dans la page **Tarifs**.
- **Récapitulatif** : le panneau à côté du calendrier affiche le total du mois affiché, par employé et au global. Il se met à jour automatiquement.
- **Employés** : la page "Employés" permet d'ajouter un nouvel employé ou de désactiver un employé qui ne travaille plus (son historique de paie est conservé).

## Hébergement et données

L'application est hébergée sur [Vercel](https://vercel.com) (offre gratuite) et se met à jour automatiquement à chaque envoi sur la branche `main` de GitHub. Les données sont stockées dans une base **Upstash Redis** (offre gratuite).

Réglages dans Vercel (**Environment Variables**), suivis d'un **Redeploy** après chaque modification :

- `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` : accès à la base, visibles dans la console Upstash (section **REST API** de la base).
- `APP_PASSWORD` : le mot de passe de l'application. Le changer déconnecte tous les appareils.

Le dossier `data/` sur l'ordinateur contient l'ancienne version locale des données, conservée comme sauvegarde. Il n'est plus mis à jour.

## Développement

Prérequis : [Node.js](https://nodejs.org/) 18 ou plus récent.

```bash
npm install
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000).

**Attention :** si un fichier `.env.local` contient les variables Upstash, la version lancée sur l'ordinateur lit et modifie les **vraies données en ligne**. Sans ce fichier, elle utilise le dossier `data/`.

Pour recopier le dossier `data/` dans la base en ligne (refusé si la base contient déjà des présences, sauf avec `--force` qui les remplace) :

```bash
node --env-file=.env.local scripts/migrate-to-redis.mjs
```
