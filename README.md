# La Voix des Enfants Placés — Vienne

Refonte éditoriale responsive du site de l’association La Voix des enfants placés à Vienne. La présentation, les coordonnées et les propositions éditoriales actuelles ont été fournies par sa représentante et doivent être validées par l’association avant publication.

## État du projet

Cette version comprend le site public, ses pages d’information, une rubrique d’actualités alimentée par Prisma/PostgreSQL, un formulaire de contact avec validation serveur et les métadonnées SEO principales. Un espace privé comprend aussi la connexion, le tableau de bord et les opérations principales sur les articles (création, modification, publication, programmation, archivage et suppression réservée à l’administrateur). Les actualités non publiées ne sont jamais renvoyées aux pages publiques.

La direction artistique privilégie désormais le bleu nuit et le bleu pétrole, avec un accent bleu clair. Le site propose des images d’illustration génériques, sans présenter les personnes photographiées comme des familles accompagnées par l’association ou comme des témoins. Les actualités publiées avec une image apparaissent dans un diaporama d’accueil avec leur titre, catégorie et lien vers l’article.

Le logo fourni dans `public/images/WhatsApp Image 2026-10-18 at 18.20.45.jpeg` est utilisé dans les en-têtes public et administrateur ainsi qu’au pied de page. La favicon reprend son emblème.

Le hero d’accueil peut afficher automatiquement une vidéo YouTube muette en boucle derrière un voile bleu. Seul un administrateur peut activer ou désactiver la vidéo et remplacer son lien depuis `/admin/settings`. Lorsque la vidéo est activée, le lecteur YouTube se charge à l’ouverture de la page ; les visiteurs sont informés dans la notice de confidentialité. La vidéo proposée est [« Pourquoi autant de placements abusifs ? » de La Maison des Maternelles – France Télévisions](https://www.youtube.com/watch?v=LnIO5TXB2X0) ; vérifier que ce contenu reste approprié et disponible avant la mise en production.

Sans variable `DATABASE_URL`, l’accueil et la rubrique `/actualites` affichent un aperçu non persistant des articles de présentation fournis par l’association. Après connexion de la base et création d’un compte administrateur, la commande `npm run db:seed-content` importe les articles publiés et leurs catégories. Les contenus déjà présents sous les mêmes adresses ne sont jamais écrasés ; ils pourront ensuite être modifiés dans l’espace d’administration.

Sans variable `DATABASE_URL`, `/admin/login` propose aussi un accès à `/admin/demo`, une maquette de l’espace d’administration alimentée uniquement par des exemples fictifs. Elle est en lecture seule et ne donne pas accès aux routes d’administration réelles ni aux opérations d’écriture. La maquette reste disponible une fois la base configurée, mais l’accès réel passe alors par la connexion habituelle.

Vercel Blob est le stockage des fichiers, pas la base des comptes : les images sont hébergées dans Blob et leurs fiches (`url`, nom, type, taille, auteur) sont enregistrées dans le modèle Prisma `Media`. L’envoi d’images est réservé aux utilisateurs connectés à l’administration et accepte JPEG, PNG et WebP jusqu’à 4 Mo. La session d’administration et les rôles restent gérés par Prisma (`User` et `Session`) dans PostgreSQL.

**La plateforme complète reste à construire.** Une médiathèque de consultation/gestion dédiée, la gestion des tags, l’éditeur riche, les prévisualisations et l’interface de modération restent à réaliser. Les tests d’intégration et les parcours d’administration avec PostgreSQL sont également à compléter. La protection anti-spam du formulaire doit être complétée par une limitation de débit/WAF. Vérifier les mentions légales et la notice de confidentialité avant publication.

## Développement local

Prérequis : Node.js 22.6 ou plus, npm et une base PostgreSQL.

```bash
npm ci
cp .env.example .env
```

Renseigner `DATABASE_URL`, `PRISMA_DATABASE_URL` et `SESSION_SECRET` dans `.env`. `POSTGRES_URL` peut également être présent comme alias fourni par le fournisseur ; le schéma Prisma utilise `DATABASE_URL` pour l’application et `PRISMA_DATABASE_URL` pour les commandes Prisma nécessitant une connexion directe. Pour activer l’envoi d’images, ajouter `BLOB_STORE_ID` et `BLOB_READ_WRITE_TOKEN` depuis les variables de l’intégration Vercel Blob, sans préfixe `NEXT_PUBLIC_` et sans commiter les valeurs. En local, récupérer les variables via `vercel env pull` ou les configurer dans le `.env` ignoré par Git.

```bash
npm run db:generate
npm run db:migrate
npm run admin:create
npm run db:seed-content
npm run dev
```

L’import initial crée les catégories et les articles de présentation avec le premier compte administrateur trouvé. Les contenus sont modifiables dans `/admin/articles` et leurs catégories dans `/admin/categories`.

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
2. Configurer `DATABASE_URL` avec l’URL de connexion de l’application et `PRISMA_DATABASE_URL` avec l’URL directe utilisée pour les migrations Prisma.
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

Les migrations ne sont pas exécutées au démarrage d’une instance. Aucun secret ne doit être préfixé par `NEXT_PUBLIC_` ni commité. Prévoir une sauvegarde PostgreSQL gérée et tester périodiquement la restauration.

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
- Gestion des tags, éditeur riche, médiathèque complète, modération, paramètres et tests de parcours/autorisation avec PostgreSQL et Vercel Blob.
