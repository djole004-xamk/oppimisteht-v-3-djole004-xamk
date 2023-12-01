import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Appbar, FAB, IconButton, Dialog, Button, TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Camera, CameraCapturedPicture, PermissionResponse } from 'expo-camera';
import { useState, useRef } from 'react';

export default function App() {
  
  const kameraRef : any = useRef<Camera>();
  const [kuva, setKuva] = useState<CameraCapturedPicture>();
  const [kuvanNimi, setKuvanNimi] = useState("");
  const [kuvausTila, setKuvausTila] = useState(false);

  const kaynnistaKamera = async () : Promise<void> => {

    const kameralupa : PermissionResponse = await Camera.requestCameraPermissionsAsync();

    setKuvausTila(kameralupa.granted)

    //console.log(kameralupa);

  }

  const suljeKamera = () : void => {
    setKuvausTila(false)
  }

  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);

  const hideDialog = () : void => {
    setDialogVisible(false);
    setKuvausTila(false);
  }

  const otaKuva = async () : Promise<void> => {

    const apukuva : CameraCapturedPicture = await kameraRef.current.takePictureAsync()

    setKuva(apukuva);

    showDialog();

  }

  return (
    (kuvausTila)
    ? 
    <SafeAreaProvider>
      <FAB
        icon="camera"
        label="Ota kuva"
        onPress={otaKuva}
      />
      <Camera style={styles.kuvaustila} ref={kameraRef}>

      </Camera>
      <Dialog visible={dialogVisible} onDismiss={hideDialog}>
        <Dialog.Title>Anna kohteen nimi</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Kuva"
            mode="outlined"
            placeholder='kohteen nimi'
            onChangeText={(uusiTeksti : string) => setKuvanNimi(uusiTeksti)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Done</Button>
        </Dialog.Actions>
      </Dialog>
      <FAB
        icon="cancel"
        label="Sulje"
        onPress={suljeKamera}
      />
    </SafeAreaProvider>
    
    :<>
    <SafeAreaProvider>
    <Appbar.Header style={styles.center}>
      <IconButton 
        icon="camera"
        size={40}
        onPress={kaynnistaKamera}
      />
    </Appbar.Header>
    {(kuva)
    ? 
      <View style={styles.container}>
        <Image
          style={styles.kuva}
          source={{uri : kuva!.uri}}
        />
        <Text style={{ fontSize: 20, margin: 20 }}>{kuvanNimi}</Text>
      </View>
    : null
    }
    </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kuvaustila: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  kuva: {
    flex: 1,
    width: '95%',
    height: '100%',
  },
});
