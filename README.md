# 💰 spendWise | Gestionnaire de Dépenses Full-Stack

**spendWise** est une application SaaS de gestion financière conçue pour offrir une expérience utilisateur fluide tout en garantissant une robustesse technique de niveau entreprise. Ce projet illustre une maîtrise de l'architecture découplée, séparant la stratégie d'acquisition de la logique métier.

---

## 🚀 Concept & Vision

L'objectif est de permettre aux utilisateurs de centraliser, catégoriser et analyser leurs flux financiers de manière sécurisée.

* **Challenge :** Concilier un SEO performant pour la visibilité et une interface applicative complexe pour la gestion de données.
* **Solution :** Une architecture hybride exploitant **Next.js** pour la vitrine et **Angular** pour le dashboard métier.

---

## 🏗️ Architectures Logicielles

### 🔙 Backend : Architecture N-Tier (Layered)

Développé avec **NestJS**, le backend suit une séparation stricte des responsabilités pour faciliter la maintenance et les tests :

* **Controller Layer :** Gestion des points d'entrée API, validation des DTOs et gestion des réponses.
* **Service Layer (Business Logic) :** Centralisation de la logique métier (calculs, tris complexes, règles de gestion).
* **Data Access Layer :** Abstraction de la persistance via **Prisma ORM** pour une sécurité accrue contre les injections SQL.
* **Modular Design :** Découpage par domaines fonctionnels (Auth, Expenses, Categories).

### 🔜 Frontend : Architecture Réactive & Service-Oriented

L'application **Angular** repose sur des patterns de conception modernes :

* **Service-Based :** Toute la logique de communication et de traitement de données est déportée dans des services injectables.
* **Reactive Pattern (RxJS) :** Gestion asynchrone des flux de données (Streams) pour une interface réactive sans rechargements inutiles.
* **Smart & Dumb Components :** Séparation entre composants logiques (gestion d'état) et composants de présentation (UI réutilisable).

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle & Justification |
| --- | --- | --- |
| **Landing Page** | **Next.js** | Rendu statique (SSG) pour un SEO optimal et un LCP ultra-rapide. |
| **Dashboard** | **Angular** | Framework robuste pour les SPAs complexes, typage strict et écosystème RxJS. |
| **API** | **NestJS** | Framework Node.js structuré (TS) inspiré d'Angular pour une cohérence Full-Stack. |
| **Database** | **PostgreSQL** | Base de données relationnelle fiable pour l'intégrité des flux financiers. |
| **ORM** | **Prisma** | Typage sécurisé de la base de données et accélération du développement. |
| **DevOps** | **Docker** | Isolation de la base de données de test et reproductibilité des environnements. |

---

## ✨ Fonctionnalités Clés

* [x] **Authentification Sécurisée :** Inscription, connexion (JWT) et gestion fine du profil utilisateur.
* [x] **Gestion des Dépenses :** CRUD complet avec possibilité de lier chaque transaction à une catégorie.
* [x] **Moteur de Recherche :** Système de filtrage dynamique et tri par critères (date, montant, catégorie).
* [x] **Sécurité (Guards) :** Protection des routes Front et Back via des Guards optimisées.

---

## 🧪 Stratégie de Qualité (Plan de Test)

* **Tests Unitaires :** Validation isolée de la logique métier dans les services (NestJS & Angular).
* **Tests d'Intégration :** Utilisation d'une base de données de test sous **Docker** pour valider les interactions réelles avec Prisma.
* **Monitoring :** Architecture prête pour l'implémentation de logs et de surveillance des performances.

---

## 📦 Installation rapide

1. **Installation des dépendances**
```bash
npm install # À exécuter dans chaque dossier (api, web, landing)

```


2. **Lancement de l'infrastructure**
```bash
docker-compose up -d # Base de données PostgreSQL
npx prisma migrate dev # Synchronisation du schéma

```


3. **Démarrage des services**
```bash
npm run start:dev # Backend NestJS
ng serve # Frontend Angular

```



---

*Projet réalisé par [PYRAM Steven] – Développeur Full-Stack.*

---
