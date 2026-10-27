# MesBonnesAdresses
gestion adresse

## Prérequis

- Node 20.18.0 (`nvm use 20.18.0`)
- JDK 17 et Android SDK 
- Un téléphone Android branché en USB avec le débogage USB activé

## Démarrer l'app

```bash
npm install
npm run app
```

`npm run app` compile l'app, l'installe sur le téléphone et la lance. Le code JS est embarqué : pas besoin de Metro.

## Générer l'APK

```bash
npm run apk
```

L'APK est créé à la racine : `MesBonnesAdresses.apk`.

## Tests

```bash
npm test              # tests unitaires et fonctionnels (Jest)
npm run e2e           # tests e2e (Maestro, téléphone branché)
npm run storybook     # Storybook sur http://localhost:6006
```

## Firebase

Le projet utilise Firebase Auth et Firestore (formule Spark). Les règles de sécurité et les index sont dans `firestore.rules` et `firestore.indexes.json` :

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project mes-bonnes-adresses-36e1d
```