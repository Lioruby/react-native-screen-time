# Setup Guide pour React Native Screen Time

## Installation

### 1. Installation du module

```bash
# Depuis GitHub
npm install git+https://github.com/lioruby/react-native-screen-time.git

# Ou en local si vous développez
npm install file:../path/to/react-native-screen-time
```

### 2. Configuration Expo

Dans votre `app.json` ou `app.config.js` :

```json
{
  "expo": {
    "name": "Votre App",
    "slug": "votre-app",
    "platforms": ["ios"],
    "ios": {
      "deploymentTarget": "15.0",
      "bundleIdentifier": "com.votre.app"
    },
    "plugins": [
      "expo-dev-client",
      "react-native-screen-time"
    ]
  }
}
```

### 3. Installation d'expo-dev-client (OBLIGATOIRE)

```bash
expo install expo-dev-client
```

**Important :** Screen Time API ne fonctionne PAS avec Expo Go. Vous devez utiliser un development build.

### 4. Build du projet

```bash
# Nettoyage complet
expo prebuild --clean

# Build et installation sur appareil iOS physique
expo run:ios --device
```

## Test du module

```typescript
import React, { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { ScreenTimeApi, debugModule } from 'react-native-screen-time';

export default function App() {
  useEffect(() => {
    // Debug pour vérifier que le module est chargé
    debugModule();
  }, []);

  const testScreenTime = async () => {
    try {
      console.log('Requesting authorization...');
      await ScreenTimeApi.requestAuthorization();
      Alert.alert('Success', 'Screen Time access granted!');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Test Screen Time" onPress={testScreenTime} />
    </View>
  );
}
```

## Dépannage

### Erreur "Cannot find native module"

1. **Vérifiez que vous utilisez un development build :**
   ```bash
   expo install expo-dev-client
   expo prebuild --clean
   expo run:ios --device
   ```

2. **Testez sur un appareil physique :**
   - Screen Time API ne fonctionne pas sur simulateur
   - Utilisez un iPhone/iPad réel

3. **Vérifiez la configuration :**
   - Plugin ajouté dans app.json
   - iOS deployment target >= 15.0

4. **Nettoyage complet :**
   ```bash
   expo prebuild --clean
   rm -rf node_modules
   npm install
   expo run:ios --device
   ```

### Module trouvé mais méthodes indisponibles

- Assurez-vous d'être sur iOS (pas Android/Web)
- Testez sur appareil physique uniquement
- Vérifiez que Screen Time est activé dans Réglages iOS

### Problèmes d'autorisation

- Screen Time doit être activé dans Réglages > Temps d'écran
- L'autorisation ne s'affiche qu'une fois par installation
- Désinstallez/réinstallez l'app pour reset les permissions

## Configuration minimale requise

- **iOS 15.0+**
- **Expo SDK 47+**
- **Development build** (pas Expo Go)
- **Appareil physique iOS**
- **Screen Time activé** dans les réglages