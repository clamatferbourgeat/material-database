# Material Database — Bibliothèque des matériaux

Site statique en français, prêt à être publié sur GitHub Pages.

## Contenu
- 16 matériaux répartis en 8 familles.
- Une page d'accueil éditoriale avec recherche, filtres, tri et favoris.
- Une fiche détaillée générée automatiquement pour chaque matériau.
- Deux visuels par matériau : matière / texture et application.
- Comparateur de trois matériaux.
- Données centralisées dans `data/materials.json`.

## Tester en local
Le site charge un fichier JSON avec `fetch()`. Il faut donc le lancer via un petit serveur local et non en ouvrant directement `index.html` en `file://`.

Avec Python installé :
```bash
python -m http.server 8000
```
Puis ouvrir http://localhost:8000

## Publier sur GitHub Pages
1. Créer un dépôt GitHub, par exemple `material-database`.
2. Téléverser le contenu de ce dossier à la racine du dépôt (le fichier `index.html` doit être à la racine).
3. Dans Settings > Pages, choisir Deploy from a branch, branche `main`, dossier `/ (root)`.
4. Enregistrer et attendre la publication.
5. Ouvrir `https://VOTRE-PSEUDO.github.io/material-database/`.

## Ajouter un matériau
Ajouter un objet au tableau dans `data/materials.json`, en conservant les champs d'un matériau existant :
`id`, `name`, `category`, `family`, `subtitle`, `description`, `density`, `price`, `priceNote`, `properties`, `pros`, `cons`, `uses`, `process`, `texture`, `application`, `textureAlt`, `applicationAlt`.

La fiche est créée automatiquement à l'adresse `material.html?id=identifiant`.

## Notes importantes
- Les photographies sont chargées depuis Unsplash via des URL externes ; une connexion Internet est nécessaire.
- Les prix et propriétés sont des ordres de grandeur pédagogiques, non des spécifications contractuelles. Ils dépendent des grades, normes, fournisseurs, dimensions et conditions d'utilisation.
- Les images d'illustration ne constituent pas une certification de l'identité exacte du matériau photographié. Remplacez-les par des images vérifiées si le site est destiné à un usage professionnel ou commercial.
