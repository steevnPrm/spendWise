# 💳 SpenWise - Service de Transaction Bancaire

**SpenWise** est une application web et un micro-service de gestion de transactions financières développé avec **Next.js** et **RxJS**. Ce projet démontre une approche rigoureuse pour la gestion des données asynchrones, la sécurité des flux monétaires et la conception d'une interface utilisateur moderne.

## 🚀 Points Forts & Fonctionnalités

* **Programmation Réactive (RxJS)** : Utilisation d'Observables pour orchestrer la validation, le calcul et l'écriture des transactions financières de manière sûre, sans "Callback Hell".
* **Sécurité Native & Source de Vérité** : Le système ne fait aucune confiance au solde envoyé par le client. Toute opération est recalculée côté serveur à partir des fichiers JSON sécurisés (`users.json`).
* **Traçabilité Complète** : Historisation de chaque transfert (montant, expéditeur, destinataire, date) dans une base dédiée (`transactions.json`).
* **Interface Utilisateur Moderne** : Composants interactifs et fluides conçus avec **Tailwind CSS**, enrichis par les icônes de **Lucide React** et les animations de **Framer Motion**.
* **Clean Architecture** : Séparation stricte entre les API Routes (Controllers) et la logique métier centralisée dans les Services.

---

## 🛠 Stack Technique

| Domaine | Technologie | Usage |
| :--- | :--- | :--- |
| **Frontend & Backend** | **Next.js 14+** | Framework principal (App Router), API Routes |
| **Langage** | **TypeScript** | Typage statique renforcé et programmation défensive |
| **Logique Asynchrone** | **RxJS** | Orchestration des pipelines transactionnels |
| **Styling & UI** | **Tailwind CSS** | Styling utilitaire et design responsif |
| **Animations** | **Framer Motion** | Transitions fluides et micro-interactions UI |
| **Persistance** | **Node.js FS** | Stockage local léger (Système de fichiers brut en JSON) |

---

## 📂 Architecture du Projet

```text
SpenWise/
├── client/                     # Application principale Next.js
│   ├── app/
│   │   ├── api/
│   │   │   ├── history/        # API: GET Historique des transactions
│   │   │   ├── transaction/    # API: POST Effectuer un virement
│   │   │   └── users/          # API: GET Liste des utilisateurs
│   │   ├── src/
│   │   │   ├── mockData/       # Base de données locale (users.json, transactions.json)
│   │   │   └── services/       # Logique Core (historyService.ts, transactionService.ts)
│   └── public/                 # Assets statiques
└── README.md                   # Documentation
```

---

## ⚙️ Installation et Démarrage

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/steevnPrm/SpenWise.git
   cd SpenWise/client
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

L'application sera accessible sur : **http://localhost:3000**

---

## Version déployée
- lien : https://spend-wise-self.vercel.app/

## 🧪 Documentation de l'API

### 1. Effectuer une transaction
Effectue un virement strict d'un utilisateur à un autre.

* **URL** : `/api/transaction`
* **Méthode** : `POST`
* **Corps (JSON)** :
  ```json
  {
      "senderId": "550e8400-e29b-41d4-a716-446655440000",
      "receiverId": "b1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "amount": 150.00
  }
  ```

> **🛡️ Note de sécurité** : Le serveur vérifie la solvabilité de l'expéditeur, bloque les montants négatifs, et s'assure des arrondis (`toFixed(2)`).

### 2. Récupérer les utilisateurs
Renvoie la liste complète des utilisateurs avec leurs soldes actuels.

* **URL** : `/api/users`
* **Méthode** : `GET`

### 3. Consulter l'historique
Renvoie le journal de bord persistant des transactions passées.

* **URL** : `/api/history`
* **Méthode** : `GET`

---

## 🛡️ Fonctionnement du pipeline RxJS

Lors d'un virement, le flux suit ce pipeline de sécurité transactionnelle :

1. **Récupération atomique** de l'expéditeur et du bénéficiaire.
2. **Validation** des fonds suffisants et du format numérique (`isNaN`).
3. **Calcul** mathématique avec précision décimale.
4. **Persistance** en cascade via `switchMap` pour garantir que l'historique de chaque transfert s'inscrit sans erreur.
5. **Mise à jour de l'historique** dans `transactions.json`.

---

## 👤 Auteur
**Steevn** – Concepteur Développeur d'Applications (CDA).

---
