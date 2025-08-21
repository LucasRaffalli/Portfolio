# 📌 Nom du projet

**Nom global** : AN0M ARCHIVE / Anomaly archive (branding officiel)

**Slogan** : "Seuls ceux qui perçoivent les failles méritent les fragments."

---

# 🚀 Objectif du projet

Créer une application immersive et communautaire autour de Destiny 2, centrée sur la découverte de récompenses cachées via un système de fragments, d’énigmes et de progression chiffré. Le but est d’impliquer les joueurs dans une chasse aux secrets orchestrée comme un **ARG** (Alternate Reality Game).

---

## 🧱 Architecture Technique

### 🌐 Stack principale

- **Frontend** : Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn UI
- **Backend** : Express.js (REST API), Node.js, typescript
- **Base de données** : MongoDB (via mongoose)
- **Authentification** : BetterAuth (frontend) + OAuth2 Bungie (backend)
- **CI/CD** : Railway (déploiement automatique)
- **Outils** : Axios, Helmet, dotenv, express-rate-limit, cors

---

## 🔐 Authentification Bungie

- **OAuth2 Bungie** : identification, récupération de `bungieId`, `displayName`, etc.
- **Flow sécurisé** :
    1. Redirection vers Bungie
    2. Callback vers backend `/api/auth/callback`
    3. Récupération du `access_token`
    4. Appel Bungie API → récupération profil
    5. Stockage ou mise à jour du joueur en BDD
- **Scopes requis** : `ReadBasicUserProfile`
- **Local** : Token stocké côté frontend
- **Production** : JWT + cookies sécurisés

[Def de chaque modules utiliser](https://www.notion.so/Def-de-chaque-modules-utiliser-24069cac35078021af67c8f3143f0aea?pvs=21)

---

## 🔑 Variantes du nom (UI, logs, etc.)

| Variante | Utilisation | Style |
| --- | --- | --- |
| **AN-0M** | UI, logs système | Principal, clair |
| **Æno** | branding mystique | Mystique |
| **A.N.M.L.Y** | dans les logs ou debug | IA ou glitché |
| **A-NOM** | terminaux militaires | Chiffré |
| **NOM4** | easter eggs, codes | Stylisé |

---

# 🧰 Fonctionnalités

- Gestion des bannières à débloquer via codes fragmentés
- Intégration OAuth2 Bungie sécurisée
- Suivi des joueurs et de leur progression
- Interfaces d’administration selon rôles (admin, éditeur, influenceur)
- Classement et leaderboard
- Historique des bannières débloquées
- Mode immersif terminal/interface corrompue
- Intégration Discord/Notifications sociales (indirectes)
- Easter Eggs personnalisés
- Système de **liens exclusifs** pour créer des événements communautaires
- **Énigmes privées ou publiques** selon paramètre influenceur
- Personnalisation visuelle poussée (fond, effets visuels, sonores)
- Classements individuels par influenceur
- Outils pour live/stream (QR codes, énigmes en direct)

# 🔧 Extensions futures possibles

### 🛠️ Admin Principal

- 🔒 **Gestion globale**
    - Ajouter / modifier / désactiver une bannière
    - Gérer tous les fragments et étapes associées
- 📊 **Surveillance & Stats**
    - Suivi global de progression
    - Accès complet aux logs, exports CSV, etc.
- 🔐 **Gestion des rôles**
    - Ajouter / retirer des éditeurs ou influenceurs
    - Définir permissions spécifiques

### 🎛️ Panel Éditeur

- ✍️ **Modification des bannières existantes**
    - Ajouter ou modifier les étapes
    - Intégrer indices et malus pendant la résolution
- 🚫 **Restrictions**
    - Ne peut pas supprimer ou créer une bannière
    - Accès limité aux stats publiques uniquement

### 📣 Panel Influenceur

- 📈 **Suivi d'impact**
    - Voir nombre de gagnants via ses liens de promo
    - Suivre la progression individuelle des joueurs de sa communauté
    - Classement personnel (top 10 des plus rapides)
- 🧩 **Création d'événements exclusifs**
    - Génération de bannières réservées à ses abonnés/communauté
    - Énigmes personnalisées (textes, visuels, mécaniques)
    - Envoi de **notifications audio/visuelles dans l’app** (indices exclusifs, annonces)
- 🎨 **Personnalisation avancée**
    - Templates visuels uniques (cadres, glitch, effets)
    - Ajout de musiques personnalisées lors du déblocage
    - QR code pour énigmes live
- 🔒 **Confidentialité contrôlée**
    - Possibilité de rendre l’event **public ou privé**
    - Bannières cachées du terminal public sauf via lien influenceur
    - Activation différée : rendre publique une bannière après X jours

### 🌍 Panel Public

- 🖼️ **Galerie**
    - Visualisation des bannières débloquées et actives
- 📊 **Progression Globale**
    - Pourcentage de fragments trouvés
    - Classement des joueurs
- 📜 **Historique**
    - Derniers succès débloqués visibles publiquement

---

# 🎯 Fonctionnement du système d’énigmes et progression

1. **Saisie du code par le joueur**
    
    Le joueur entre un code numérique dans le terminal.
    
2. **Validation du code**
    - Si le format est incorrect, un message d’erreur s’affiche et il doit ressaisir.
    - Si le format est correct, le terminal affiche un contenu (message d’erreur, texte chiffré, etc.), souvent chiffré ou immersif.
3. **Exploration des indices**
    
    Ce contenu sert d’indice ou de point de départ pour résoudre des énigmes.
    
    Les indices peuvent être des fichiers, logs, messages corrompus, références à des personnages in-game, etc.
    
4. **Résolution de l’énigme**
    
    Le joueur doit trouver la bonne réponse ou effectuer une action liée à l’énigme.
    
5. **Validation de la réponse**
    - Si la réponse est correcte, un fragment de code est débloqué pour le joueur.
    - Si la réponse est fausse, un message d’échec s’affiche (ex : "Fail data", "Resource corrupted") et le joueur peut retenter.
6. **Progression**
    - Chaque fragment débloqué s’ajoute au profil du joueur (ex : `23A-BBB-CCC` où `23` fragments sont débloqués).
    - Les fragments combinés permettent de débloquer la bannière finale associée.
7. **Sécurité / anti-brute force**
    - Pas de blocage trop strict, mais un système anti-bot (rate limiting, captchas éventuellement) pour éviter le spam de codes au hasard.

## 🧩 Points importants

- Les codes ne délivrent pas directement un fragment mais ouvrent une section immersive contenant des énigmes.
- Les fragments ne sont débloqués qu’après résolution correcte.
- Chaque bannière a un code final composé de plusieurs fragments (ex : `AAA-BBB-CCC`).
- Plusieurs codes peuvent mener à différentes énigmes dans une même bannière.
- Les énigmes doivent être cohérentes avec l’univers Destiny 2 (ex : références lore, mécaniques du jeu).
- Certains codes affichent juste des messages chiffré ou erreurs pour l’ambiance.
- Il faut gérer les états : saisie, validation, affichage contenu, résolution énigme, succès/échec, progression.

## 📡 Notifications internes

- **Système** : info générique (ex: "Un fragment a été trouvé.")
- **Indice** : contextuel, déclenché par une action ou un timing
- **Succès** : un utilisateur a complété un code

> Les notifications ne spoilent pas directement, elles guident subtilement.
> 

> 2 type de format pour les challenges `(IsSharedChallenge)` permet de dire si les groupe fragments son séparé en plusieurs énigmes (une énigme par fragment) ou groupe en 3 fragments en 3 énigmes
> 

```
{
    "bannerId": "banner-001",
    "title": "Les Échos de la Rupture",
    "description": "Une bannière mystérieuse liée à un ancien secret de la Rupture.",
    "codeFormat": "AAA-BBB-CCC",
    "isSharedChallenge": true,
    "finalCode": {
        "AAA": {
            "A1": "S",
            "A2": "P",
            "A3": "D"
        },
        "BBB": {
            "B1": "K",
            "B2": "4",
            "B3": "7"
        },
        "CCC": {
            "C1": "1",
            "C2": "A",
            "C3": "9"
        }
    },
    "challenges": [
        {
            "fragmentId": [
                "A1",
                "A2",
                "A3"
            ],
            "challengeType": "ASCII",
            "groups": [
                {
                    "accessCode": "0024",
                    "promptLines": [
                        "Il marche dans l'ombre,",
                        "Son regard perce la nuit,",
                        "Toujours fidèle à son maître."
                    ]
                },
                {
                    "accessCode": "5994",
                    "promptLines": [
                        "Il protège sans bruit,",
                        "Compagnon des jours sombres,",
                        "Son nom est murmuré partout."
                    ]
                }
            ],
            "expectedAnswer": "76848368",
            "hintLines": [
                "Un compagnon de lumière,",
                "Toujours à vos côtés,",
                "Il éclaire votre chemin,",
                "Son nom commence par S."
            ],
            "rewardId": "fragment_A1_A2_A3_reward",
            "visibility": "active",
            "createdAt": "2025-07-10T08:00:00Z",
            "updatedAt": "2025-07-10T08:00:00Z"
        },
        {
            "fragmentId": [
                "B1",
                "B2",
                "B3"
            ],
            "challengeType": "ASCII",
            "groups": [
                {
                    "accessCode": "1579",
                    "promptLines": [
                        "Trois points, trois traits, trois points,",
                        "Un signal d'urgence universel,",
                        "Utilisé en mer et sur terre,",
                        "Quel est ce code célèbre ?"
                    ]
                },
                {
                    "accessCode": "8888",
                    "promptLines": [
                        "Un appel à l'aide,",
                        "Trois lettres identiques,",
                        "Le monde le connaît,",
                        "Quel est ce message ?"
                    ]
                }
            ],
            "expectedAnswer": "78439",
            "hintLines": [
                "C'est un appel à l'aide,",
                "Utilisé par les marins,",
                "Trois lettres identiques,",
                "Commence par S."
            ],
            "rewardId": "fragment_B1_B2_B3_reward",
            "visibility": "active",
            "createdAt": "2025-07-10T08:00:00Z",
            "updatedAt": "2025-07-10T08:00:00Z"
        },
        {
            "fragmentId": [
                "C1",
                "C2",
                "C3"
            ],
            "challengeType": "ASCII",
            "groups": [
                {
                    "accessCode": "3141",
                    "promptLines": [
                        "Je suis invisible mais tu peux me sentir,",
                        "Je peux être une brise ou une tempête,",
                        "Je fais tourner les moulins,",
                        "Qui suis-je ?"
                    ]
                },
                {
                    "accessCode": "7777",
                    "promptLines": [
                        "Je parcours le monde sans jamais être vu,",
                        "Je fais danser les feuilles,",
                        "Parfois doux, parfois violent,",
                        "Quel est mon nom ?"
                    ]
                }
            ],
            "expectedAnswer": "86101110116",
            "hintLines": [
                "Je souffle sans être vu,",
                "Je fais bouger les feuilles,",
                "Je peux être doux ou violent,",
                "Mon nom commence par V."
            ],
            "rewardId": "fragment_C1_C2_C3_reward",
            "visibility": "active",
            "createdAt": "2025-07-10T08:00:00Z",
            "updatedAt": "2025-07-10T08:00:00Z"
        }
    ],
    "playersProgress": [
        {
            "userId": "user-1234",
            "bungieId": "bungie-5678",
            "displayName": "GuardianX",
            "unlockedFragments": [
                "A1",
                "A3",
                "B2",
                "C1"
            ],
            "currentProgress": "2A-1B-1C",
            "complete": false,
            "lastUpdated": "2025-07-10T08:10:00Z"
        },
        {
            "userId": "user-9876",
            "bungieId": "bungie-4321",
            "displayName": "LightBringer",
            "unlockedFragments": [
                "A1",
                "A2",
                "A3",
                "B1",
                "B2",
                "B3",
                "C1",
                "C2",
                "C3"
            ],
            "currentProgress": "3A-3B-3C",
            "complete": true,
            "lastUpdated": "2025-07-10T08:15:00Z"
        }
    ]
}
```

---

```jsx
{
    "bannerId": "banner-001",
    "title": "Les Échos de la Rupture",
    "description": "Une bannière mystérieuse liée à un ancien secret de la Rupture.",
    "codeFormat": "AAA-BBB-CCC",
    "isSharedChallenge": false,
    "finalCode": {
        "AAA": {
            "A1": "S",
            "A2": "P",
            "A3": "D"
        },
        "BBB": {
            "B1": "K",
            "B2": "4",
            "B3": "7"
        },
        "CCC": {
            "C1": "1",
            "C2": "A",
            "C3": "9"
        }
    },
    "challenges": [
        {
            "fragmentId": ["A1"],
            "challengeType": "ASCII",
            "accessCode": "0024",
            "promptLines": [
                "Un compagnon fidèle,",
                "Son nom commence par S."
            ],
            "expectedAnswer": "7684",
            "hintLines": [
                "Un compagnon de lumière."
            ],
            "rewardId": "fragment_A1_reward",
            "visibility": "active",
            "createdAt": "2025-07-10T08:00:00Z",
            "updatedAt": "2025-07-10T08:00:00Z"
        },
        {
            "fragmentId": ["A2"],
            "challengeType": "ASCII",
            "accessCode": "0025",
            "promptLines": [
                "Toujours à vos côtés,",
                "Son nom commence par P."
            ],
            "expectedAnswer": "8368",
            "hintLines": [
                "Il éclaire votre chemin."
            ],
            "rewardId": "fragment_A2_reward",
            "visibility": "active",
            "createdAt": "2025-07-10T08:00:00Z",
            "updatedAt": "2025-07-10T08:00:00Z"
        },
        //etc
    ],
    "playersProgress": [
        {
            "userId": "user-1234",
            "bungieId": "bungie-5678",
            "displayName": "GuardianX",
            "unlockedFragments": ["A1", "B2", "C1"],
            "currentProgress": "1A-1B-1C",
            "complete": false,
            "lastUpdated": "2025-07-10T08:10:00Z"
        }
    ]
}
```