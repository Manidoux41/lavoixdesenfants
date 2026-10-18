# La Voix des Enfants Placés — Vienne

Refonte éditoriale responsive du site de l’association. Le contenu actuellement vérifié sur le site source présente une association qui porte la parole des parents et des enfants placés et encourage le dialogue, l’accès aux droits et la recherche de solutions adaptées à l’intérêt de l’enfant. Les coordonnées précises, responsables, modalités d’adhésion, témoignages et campagnes n’ont pas été repris faute de vérification.

## État du projet

Cette version comprend le site public, ses pages d’information, une rubrique d’actualités alimentée par Prisma/PostgreSQL, un formulaire de contact avec validation serveur et les métadonnées SEO principales. Un espace privé comprend aussi la connexion, le tableau de bord et les opérations principales sur les articles (création, modification, publication, programmation, archivage et suppression réservée à l’administrateur). Les actualités non publiées ne sont jamais renvoyées aux pages publiques.

La direction artistique privilégie désormais le bleu nuit et le bleu pétrole, avec un accent bleu clair. Le site propose des images d’illustration génériques, sans présenter les personnes photographiées comme des familles accompagnées par l’association ou comme des témoins. Les actualités publiées avec une image apparaissent dans un diaporama d’accueil avec leur titre, catégorie et lien vers l’article.

Sans variable `DATABASE_URL`, l’accueil et la rubrique `/actualites` affichent trois articles fictifs dans le diaporama et la liste afin de permettre de prévisualiser les images, catégories et liens d’articles. Chaque page d’exemple est signalée comme contenu de démonstration et ne représente pas une publication officielle. Ces exemples disparaissent dès que la base est configurée ; les articles publiés en base prennent alors le relais.

Sans variable `DATABASE_URL`, `/admin/login` propose aussi un accès à `/admin/demo`, une maquette de l’espace d’administration alimentée uniquement par des exemples fictifs. Elle est en lecture seule et ne donne pas accès aux routes d’administration réelles ni aux opérations d’écriture. La maquette reste disponible une fois la base configurée, mais l’accès réel passe alors par la connexion habituelle.

**Ce n’est pas encore la plateforme complète demandée.** La gestion des catégories est disponible (création et association aux articles), mais la gestion des tags, l’éditeur riche, les prévisualisations, la médiathèque, l’interface de modération et les paramètres éditoriaux restent à réaliser. Les tests d’intégration et les parcours d’administration avec PostgreSQL sont également à compléter. Le schéma Prisma contient des modèles préparatoires pour certaines fonctions, mais ne constitue pas leur interface. La protection anti-spam du formulaire doit être complétée par une limitation de débit/WAF. Ne pas mettre en production avant d’avoir terminé ces éléments et vérifié les mentions légales et la notice de confidentialité.

## Développement local

Prérequis : Node.js 22.6 ou plus, npm et une base PostgreSQL.

```bash
npm ci
cp .env.example .env
```

Renseigner `DATABASE_URL` et `DIRECT_URL` dans `.env`. En local, les deux peuvent utiliser la même URL de base PostgreSQL.

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

Ouvrir <http://localhost:3000>. Pour contrôler les changements :

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

Les tests unitaires ciblés utilisent le test runner natif de Node.js 22. La base de données n’est pas incluse. Sans `DATABASE_URL`, le site public s’affiche avec les états vides des actualités et le formulaire de contact indique qu’il n’est pas activé.

## Contact

Le formulaire valide les champs côté serveur avec Zod, utilise un champ piège anti-robot et envoie les demandes au prestataire Resend. Pour l’activer, configurer :

- `RESEND_API_KEY` : clé privée Resend, exclusivement côté serveur.
- `CONTACT_EMAIL` : adresse de réception vérifiée par l’association.
- `CONTACT_FROM` : expéditeur vérifié dans le compte Resend.

Le message est transmis au service d’envoi de courriels et n’est pas conservé dans la base applicative. La notice de confidentialité doit être revue au regard de la configuration et des durées de conservation réellement appliquées. Ne pas demander ni envoyer de pièces judiciaires ou de détails sensibles relatifs à un enfant par ce formulaire. La protection anti-spam actuelle (validation + honeypot) ne remplace pas une limitation de débit/WAF avant ouverture publique.

## Images et droits d’utilisation

Les images de [public/images/](./public/images/) sont des illustrations génériques sous les licences libres mentionnées ci-dessous. Elles ne représentent aucune famille accompagnée par l’association et ne constituent pas des témoignages réels. Les crédits sont conservés pour respecter les licences et faciliter leur vérification :

| Fichier | Photo source | Usage |
|---|---|---|
| `family-silhouettes.jpg` | [Unsplash image](https://images.unsplash.com/photo-1511895426328-dc8714191300), [licence Unsplash](https://unsplash.com/license) | Illustration de liens familiaux, personnes vues de dos |
| `support-community.jpg` | [Unsplash image](https://images.unsplash.com/photo-1511632765486-a01980e01a18), [licence Unsplash](https://unsplash.com/license) | Illustration de soutien entre adultes |
| `access-to-information.jpg` | [Unsplash image](https://images.unsplash.com/photo-1450101499163-c8848c66ca85), [licence Unsplash](https://unsplash.com/license) | Illustration de documents et d’information |
| `parent-child-together.jpg` | Sonia Sevilla, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Mother_hugged_her_child_and_walking_-_Kashmar_kudak_park001.JPG), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Illustration d’un temps partagé entre parent et enfant |
| `father-child-walk.jpg` | mrhayata, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Father_and_Child.jpg), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | Illustration d’un père et son enfant vus de dos |
| `parent-child-shoreline.jpg` | PattayaPatrol, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DSC_7746_A_parent_and_child_walk_along_the_shoreline_at_sunset_the_sun_casting_a_golden_path_across_the_water.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Illustration d’un parent et d’un enfant marchant ensemble |
| `mother-child-distance.jpg` | Aurora Mazzoldi, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aurora_Mazzoldi_-_Mother_6_-_Loneliness.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Illustration artistique de la distance entre une mère et son enfant |

Les images doivent rester présentées comme des illustrations, jamais comme les membres, les familles accompagnées ou les témoignages de l’association. Avant toute publication, vérifiez les textes alternatifs et conservez les crédits associés aux fichiers.

## Base de données et déploiement Vercel

`prisma/schema.prisma` définit PostgreSQL, les articles, utilisateurs, catégories, mots-clés, médias, témoignages, sessions et paramètres. Les brouillons, articles programmés et contenus archivés sont exclus des requêtes publiques.

1. Créer une base PostgreSQL gérée compatible avec Prisma.
2. Configurer `DATABASE_URL` avec l’URL de connexion adaptée à l’exécution serverless et `DIRECT_URL` avec une connexion directe pour les migrations.
3. Configurer `NEXT_PUBLIC_SITE_URL` avec l’origine canonique publique.
4. Configurer les variables Resend si le formulaire doit être actif.
5. Appliquer les migrations versionnées depuis un poste/CI connecté à la base :

   ```bash
   npm run db:generate
   npm run db:deploy
   ```

6. Dans le développement local, créer les futures migrations avec `npm run db:migrate -- --name description-du-changement`. Ne lancez pas les migrations à chaque démarrage de l’application.
7. Connecter le dépôt Git à Vercel et configurer les mêmes variables dans les environnements appropriés.
8. Après déploiement, vérifier le domaine personnalisé, les URL canoniques, le formulaire, `robots.txt`, `sitemap.xml` et les pages légales.

Les migrations ne sont pas exécutées au démarrage d’une instance. Aucun secret ne doit être préfixé par `NEXT_PUBLIC_` ni commité. Prévoir une sauvegarde PostgreSQL gérée et tester périodiquement la restauration. Les images d’articles n’ont pas encore de flux d’envoi/stockage médias : ne pas dépendre du disque local pour des fichiers persistants.

### Premier compte administrateur

Après avoir créé la base et appliqué sa migration :

1. Définir `SESSION_SECRET` avec une valeur aléatoire d’au moins 32 octets (par exemple `openssl rand -base64 32`).
2. Renseigner temporairement `BOOTSTRAP_ADMIN_EMAIL` et `BOOTSTRAP_ADMIN_PASSWORD` dans le `.env` local ignoré par Git. Choisir un mot de passe long (au moins 14 caractères).
3. Exécuter `npm run admin:create`. Le script ne crée le premier administrateur que si la table des utilisateurs est vide; le mot de passe est dérivé avec scrypt.
4. Retirer immédiatement les deux variables `BOOTSTRAP_ADMIN_*` du `.env`.

La connexion utilise une session aléatoire conservée sous forme hachée en base et un cookie `HttpOnly`, `SameSite=Lax`, `Secure` en production. Les tentatives invalides sont limitées par couple adresse/client, avec identifiant de client pseudonymisé par HMAC.

## Informations à confirmer avant publication

- Coordonnées publiques et identité juridique exacte de l’association.
- Responsable de publication, siège et hébergeur à mentionner.
- Contenus détaillés sur l’histoire, les actions et les modalités de soutien.
- Responsable de traitement et politique de conservation des courriels.
- Autorisations de publication et éventuels droits sur le logo, les photos et les témoignages.
- Gestion des tags, éditeur riche, médiathèque, modération, paramètres et tests de parcours/autorisation avec PostgreSQL.
