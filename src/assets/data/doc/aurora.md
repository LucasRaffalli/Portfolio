# 🚀 Objectif du projet

Centraliser en une seule application toutes les fonctionnalités utiles pour jouer à Destiny 2, afin de faciliter la recherche d’informations et d’améliorer la connaissance du jeu.

# 🧱 Architecture Technique

## 🌐 **Stack principale**

- **Frontend** : Next.js(React), TypeScript, TailwindCSS, (HeroUI ou Shadcn  )
- **Backend** : Node.js + GraphQL (Apollo Server)
- **Base de données** : MongoDB
- **Authentification** : BetterAuth (custom) + OAuth2 Bungie
- **Paiement** : Stripe
- **Analytics** : Umami
- **Application cible** : Web & Mobile (PWA)
- **CI/CD** : GitHub Actions
- **Hébergement** :  Vercel / Render /  railway

## ⚙️ **Architecture front-end**

### Choix : **Next.js(React) + (HeroUI ou Shadcn) + TailwindCSS**

- ✅ **Next.js** : SSR/SSG pour un rendu rapide, bon SEO (utile pour les pages publiques ou docs), et routing intégré.
- ✅ **React** : composabilité, logique UI claire, écosystème énorme.
- ✅ (**HeroUI ou Shadcn) + TailwindCSS** : composants accessibles, personnalisables, légers → parfait pour un design clean et dynamique.
- ❌ Pas de Angular : trop lourd pour un app centrée joueur.
- ❌ Pas de Vue : bien, mais moins maîtrisé et moins cohérent avec le reste de la stack.

## 🔐 **Authentification hybride**

### Choix : **BetterAuth + OAuth2 Bungie**

- ✅ **BetterAuth** (lib custom) : gère le login classique (email/mdp), sessions sécurisées, 2FA, gestion de rôles, multi-profils.
- **Bungie Manifest** : téléchargé et parsé régulièrement (via cron ou cache invalidation) pour obtenir les métadonnées du jeu (armes, perks, stats, etc.).
- ✅ **OAuth2 Bungie** : permet de récupérer les infos des comptes Destiny 2 (inventaire, stats, persos, etc.) dès la connexion.
- ✅ Possibilité de lier un compte Bungie à un compte local Aurora.
- ❌ Auth0 / Clerk : solutions fermées, surdimensionnées pour une app auto-hébergée.
- ❌ Firebase Auth : difficile à custom, peu adapté à un login + compte lié Bungie.

## 🗃️ **Base de données**

### Choix : **MongoDB uniquement**

- ✅ **MongoDB** : base NoSQL flexible, parfaite pour gérer des structures variées et évolutives comme :
    - Comptes utilisateurs
    - Inventaires, objets, perks, armures
    - Builds personnalisés
    - Statistiques et historiques
    - Sessions, droits, et préférences utilisateur
    - Abonnements Premium et logs d’activité
- ✅ **MongoDB sur Railway** : hébergement managé, scaling simple, intégration directe dans le workflow CI/CD.
- ⚠️ Pourquoi ce choix ?
    - Architecture plus simple à maintenir (une seule BDD)
    - Modélisation souple adaptée aux données de jeu
    - Compatible avec une croissance progressive du projet
- ❌ Full SQL : trop rigide pour les données très dynamiques du jeu.

## 🔗 **API & communication**

- ✅ **GraphQL** : souplesse côté client (pas de over-fetching), introspection facile pour développeurs tiers.
- ✅ **Synchronisation périodique** avec l'API Bungie pour garder l'inventaire et les stats à jour côté Aurora.
- ✅ **Apollo Server** (backend), **Apollo Client** (frontend) : cache intégré, dev rapide.
- ❌ REST : trop verbeux pour une app très modulaire comme Aurora.

## 💳 **Paiement**

- ✅ **Stripe** : leader du marché, intégration simple avec webhooks, gestion des abonnements et paiements one-shot.
- ✅ **Modèle freemium** : accès gratuit + premium avec fonctionnalités avancées = accessible et scalable.
- ✅ **Stockage carte géré par Stripe** : aucune gestion sensible côté Aurora, conformité PCI-DSS assurée.
- ❌ PayPal / LemonSqueezy : moins personnalisables, moins adaptés à des intégrations complexes et multi-profils.

## 📊 **Analytics**

- ✅ **Umami** : RGPD-compliant, léger, auto-hébergeable, pas d'injection abusive de tracking.
- ✅ **Sentry + LogRocket** : suivi des erreurs et analyse UX en temps réel pour une app robuste et fluide.
- 🔐 Données anonymisées, sans cookie tiers, 100% côté serveur.
- ❌ Google Analytics : trop intrusif, non RGPD par défaut, surdimensionné pour le besoin.

## 🚀 **CI/CD & DevOps**

- **CI** : GitHub Actions → lint, build, test à chaque push.
- **CD** : déploiement automatique via Railway / Vercel selon l’environnement.
- **Monitoring** : LogRocket pour le front, Sentry côté back.
- 🌍 **Environnements** : staging (Railway) / prod (Vercel ou Render selon couche).

## 📱 **Ciblage multi-plateforme**

- ✅ Application **PWA optimisée pour desktop** (navigateur).
- ❌ Pas de version native mobile pour la v1 (prévu plus tard via Capacitor ou portage ciblé).
- Plus tard : portage possible en **Electron** (desktop) ou **Capacitor** (mobile) si besoin natif.

## 🌐 **Hébergement & Infrastructure**

- ✅ **Frontend sur Vercel** (Hobby → Pro → Business) : déploiement simplifié, CI/CD natif, edge caching performant.
- ✅ **Backend sur Render** : auto-deploy, support Node.js natif, scaling automatique dès le plan Pro.
- ✅ **Base de données sur Railway** : simple à gérer, pricing linéaire, bonne UX pour monter en charge progressivement.
- ❌ Pas de VPS type OVH ou Hetzner pour le moment : plus complexe à maintenir, peu rentable à petite échelle.

# 🛠️ Modules et mises à jour

## 🧳 **InventoryMaster** *(inspiré de DIM)*

**Objectif** : Gérer et transférer les équipements entre personnages rapidement.

- 🔍 Vue détaillée : armes, armures, mods, consommables, shaders.
- 🧭 Filtres avancés : rareté, classe, élément, statistique, saison, type.
- ⚡ Transfert instantané entre coffre et persos.
- 📦 Organisation intelligente : catégories personnalisables.
- 📝 Tagging, favoris, lock automatique.

## 🛡️ **ArmorForge** *(inspiré de D2ArmorPicker)*

**Objectif** : Créer des sets optimisés basés sur les stats et mods.

- 📊 Filtres : mobilité, résilience, récupération, intellect, discipline, force.
- 🧱 Sélection de doctrine (sous-classe), mods (armure/artéfact/saison).
- 💾 Sauvegarde & comparaison de builds.
- 🎨 Interface intuitive en drag & drop.
- 🔀 Simulation live du score total (100/100/40 par ex.).

## ⚔️ **BuildShare** *(inspiré de Mobalytics D2)*

**Objectif** : Explorer et partager les builds de la communauté.

- 🧩 Builds PVE / PVP / activité / classe / exotiques.
- ⭐ Notation communautaire (likes, tiers, feedback).
- 📚 Guides intégrés : explications par l’auteur, vidéos.
- 🔄 Import rapide dans ton inventaire ou ArmorForge.

## 🏆 **ActivityReport** *(RaidReport, DungeonReport, StrikeReport)*

**Objectif** : Visualiser les performances passées dans les activités principales.

- 📈 Stats : nombre de complétions, temps moyen, wipes, score.
- 🧍 Comparaison multi-persos ou entre joueurs.
- 🏅 Affichage des meilleurs runs et armes utilisées.
- 🗓️ Historique visuel et export possible.

## 📊 **StatSynth** *(outil maison d’analyse)*

**Objectif** : Calculer, comparer et visualiser les performances des armes/builds.

- 🔫 Dégâts, TTK, portée effective, temps de rechargement.
- 📉 Graphiques comparatifs (ex: DPS comparé entre deux armes avec mods).
- 🧪 Simulateur de builds avec stats dynamiques.
- 📤 Export : CSV, PNG, lien partagé.

## 📜 **LoreKeeper** *(inspiré de Braytech)*

**Objectif** : Suivre le lore, les triomphes et les événements quotidiens.

- 📖 Accès au lore officiel + triomphes débloqués.
- 👥 Infos sur le clan, membres actifs, annonces.
- 📅 Planning hebdo/journalier : Nuit Noire, Bannière de Fer, défis.
- 🔔 Alerte push : loot rare, activité ouverte, changement de reset.

## 🔍 **GodRollBuilder** *(inspiré de Light.gg)*

**Objectif** : Construire et consulter les meilleurs god rolls.

- 🧠 Recherche par nom/type/stats d’arme.
- 🛠️ Création manuelle ou suggestion automatique de rolls.
- 🌟 Visualisation de la probabilité de drop (si dispo).
- 🔗 Partage rapide via lien ou code unique.

## 🧰 **PerkSight** *(inspiré de Foundry)*

**Objectif** : Comprendre et optimiser les perks d’armes.

- 🧾 Détails chiffrés : +stats, cooldown, bonus actifs.
- 🔁 Visualisation dynamique des perks actifs selon config.
- 🎯 Suggestions de combo de perks (synergies).
- 🔬 Mode test pour comparer deux setups rapidement.

## 📈 **ProgressMaster** *(inspiré de DestinyRecipes)*

**Objectif** : Optimiser la progression XP et ressources.

- 🔍 XP tracker par activité (bounty, saison, focus).
- 🗃️ Coffre : suggestions de nettoyage, doublettes, équipements obsolètes.
- 📈 Suivi des ressources principales (ascendant shards, upgrade modules...).
- 📑 Rapport hebdo exportable (PDF ou dans Aurora).

## 🤖 **AI_Assistant** *(Aurora exclusive)*

**Objectif** : T'aider activement à tout moment.

- 🤖 Recommandations de builds, mods et perks selon ton profil.
- ❓ Réponses aux questions sur les mécaniques du jeu.
- 📚 Tutoriels interactifs intégrés aux modules.
- 🧠 Amélioration continue via feedback utilisateur et apprentissage.

# 📊 Comparaison d’outils pour Destiny 2

| **Outil** | **Catégorie** | **UX/UI** | **Fonctionnalités principales** | **Points forts** | **Points faibles** |
| --- | --- | --- | --- | --- | --- |
| Destiny Item Manager (DIM) | Mobile/Web | Bonne | Transfert d'objets, gestion du coffre-fort, création de sets d'équipement | Efficace pour la gestion d'inventaire, multi-plateformes | Interface parfois chargée, fonctionnalités avancées moins évidentes |
| Braytech.org | Web | Bonne | Recherche d'objets, comparaison d'objets, suivi de collection, création de builds | Interface propre et intuitive, large éventail de fonctionnalités | Peut nécessiter un compte premium pour certaines fonctionnalités |
| light.gg | Web | Moyenne | Recherche rapide d'objets, actualités Destiny 2, informations sur les vendeurs | Recherche ultra rapide, mise en avant des nouveautés | Interface perfectible, signalements de bugs de filtres |
| Foundry | Web | Excellente | Comparaison d'objets, analyse détaillée des perks, création de builds | UX/UI moderne et agréable, informations détaillées sur les objets | Fonctionnalités plus limitées comparé à d'autres outils |
| D2armorPicker | Web | Faible | Recherche et comparaison d'armures uniquement | Fonctionnalité unique pour les builds d'armure | Interface peu intuitive, lenteur relative, filtres complexes |
| DestinyRecipe | Web | Moyenne | Statistiques de jeu, suivi de progression | Outil externe avec stats et conseils. |  |
| Mobalytics  | Web | Moyenne | Création de builds d'équipement, optimisation selon les activités | Assistant pour la création de builds optimisés | Fonctionnalités principalement axées sur la création de builds |

# 🌟 Vision globale

## ⚔️ Vision Aurora

Aurora est conçue comme une plateforme évolutive, en phase avec la durée de vie prolongée de Destiny 2 jusqu’en 2026 avec l’Année de la Prophétie. Actuellement en bêta/prototype, elle deviendra pleinement fonctionnelle à partir de mi-2026, avec des mises à jour régulières pour s’adapter aux nouveautés du jeu et offrir une expérience optimale, fluide et complète aux joueurs.

## ✨ Avantages clés pour les utilisateurs

- Un outil précis. Une interface simple. Partout, tout le temps./

## 🎯 Public Cible

Aurora s'adresse à trois profils de joueurs Destiny 2 :

- **Les passionnés / hardcore players** :
    
    Optimisent leurs builds, connaissent la méta, veulent aller vite. Aurora leur offre des outils centralisés et puissants.
    
- **Les joueurs réguliers** :
    
    Veulent progresser sans se perdre entre plusieurs sites. Aurora simplifie leur routine de jeu (coffre, builds, activités hebdo).
    
- **Les nouveaux joueurs / casuals** :
    
    Ne savent pas par où commencer. Aurora, avec son IA intégrée et son UI claire, les guide étape par étape.
    

👉 En regroupant tout, Aurora répond à tous ces profils en adaptant la **complexité** selon les besoins.

## 🗺️ Roadmap de développement Aurora

| Période | Objectif | Modules livrés |
| --- | --- | --- |
| Août - Décembre 2025 (Q3-Q4) | Prototype MVP | InventoryMaster (gestion d’inventaire) uniquement |
| Janvier - Mars 2026 (Q1) | Version Bêta publique | Début intégration des autres modules (BuildShare, etc.) |
| Avril 2026 et après | Lancement officiel | DestinyLoreCompanion, version mobile, abonnement Premium |
| Après lancement | Mises à jour continues | IA améliorée, modules communautaires, événements en jeu |

## ⚡ Expérience utilisateur souhaitée

Nous voulons une expérience rapide, claire et nette sur notre produit pour que l’utilisateur ait envie de l’utiliser. Nous voulons lui offrir la possibilité d’avoir tout à côté de lui. S'il veut chercher un triomphe, il n'aura pas loin de lui. S'il veut savoir une information sur une arme, pas de problème, il y a une barre de recherche ainsi que des filtres. Avec ceci, nous donnons à l’utilisateur le contrôle et la possibilité de tout savoir en un minimum de temps.

# 💰 Modèle Économique

Aurora est gratuit pour tous. Passe au niveau supérieur avec la version Premium : IA avancée, accès anticipé aux nouveautés et thèmes exclusifs pour une expérience sur-mesure.

## 🎁 Fonctionnalités gratuites

- Accès aux modules de base (InventoryMaster, BuildShare, ArsenalBuilder…)
- Mises à jour régulières sans limitation
- IA simplifiée (AI_Aurora Lite) pour suggestions de mods/perks de base
- Intégration complète avec l’API Bungie
- Recherche rapide, filtres, partage de builds communautaires
- ~~Navigation fluide sans publicité~~

## 💎 Fonctionnalités Premium

- IA avancée (AI_Aurora Pro) : analyse poussée et recommandations contextuelles
- Thèmes exclusifs et personnalisation visuelle
- Accès anticipé aux nouveaux modules expérimentaux

## 💸 Sources de revenus

- **Abonnement mensuel/annuel**
- **Achat in-app:** cosmétique ou utilitaire (theme, ia)
- **Partenariats** (streamers, concours, outils partenaires)
- **~~Éventuelles pubs non intrusives** pour les utilisateurs non Premium~~

# 📢 Stratégie de Lancement & Marketing

## 🚦 Phases de lancement

- **Alpha fermée (Q3 -Q4 2025)** : test par un petit groupe de joueurs via Discord/invitations.
- **Bêta publique (Q1 2026)** : ouverture plus large pour affiner l’UX avec les retours communautaires.
- **Lancement officiel (avril 2026)**

## 📣 Communication

- Présence sur reddit , Discord, forums Bungie.
- **Partenariats avec streamers/YouTubers** pour tester l'app en live.
- Campagnes **Twitter/X, Instagram**, TikTok avec teasers vidéo.
- Création d’un **site vitrine avec démo interactive** (mini buildshare ou preview ArsenalBuilder).

## 🎯 Objectifs marketing

Créer une base d’utilisateurs solides via le bouche-à-oreille, des outils communautaires et une UX soignée.

# 🔮 Vision Long Terme & Évolutivité

Aurora ne se limite pas à Destiny 2. L’objectif est de suivre l’évolution de l’écosystème Bungie et d’assurer la pérennité de l’outil sur le long terme.

## 🚀 Objectifs post-lancement

- **Compatibilité Destiny 2 sur les nouveaux changements** grâce à une architecture modulaire.
- **Version mobile native** (iOS/Android) avec synchronisation en temps réel.
- **Extension vers d’autres jeux de type looter shooter** (si la demande est forte).
- **IA Aurora** de plus en plus performante, capable de recommander des synergies PvP/PvE complexes.
- **Open API Aurora** pour permettre à d'autres devs ou communautés d’intégrer les modules (ex : créer son propre overlay stream).

## 🤝 Évolution communautaire

- Ajoute un **"Votez pour le prochain module"** dès la version publique.
- Engage la commu en lui donnant une impression de co-construction.
- **Intégration avec les outils tiers** (OBS, Notion, Discord bots, etc.).
- Événements communautaires réguliers (build battles, concours, etc.).

# 🔚 Conclusion & Appel à l’Action

Aurora est bien plus qu’un simple hub pour Destiny 2. C’est une vision ambitieuse : offrir à chaque joueur, qu’il soit casual ou hardcore, un outil complet, fluide et intelligent pour améliorer son expérience.

Avec un design moderne, des mises à jour régulières, une IA évolutive et une orientation communautaire forte, Aurora veut devenir **le compagnon incontournable** des Gardiens, aujourd’hui comme demain.