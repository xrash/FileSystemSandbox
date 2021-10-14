import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native'
import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker'
import {
  uploadAsync,
  FileSystemUploadType,
} from 'expo-file-system'

const SERVER_URL = 'https://2cb9-2804-431-c7c1-e74f-fa28-19ff-febe-5f69.ngrok.io/upload'

const pickFile = async () => {
  console.log('pickFile begin')

  const permissionResult = await requestMediaLibraryPermissionsAsync()

  if (!permissionResult.granted) {
    throw new Error('permission denied')
  }

  const imageResult = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.All,
    base64: true,
  })

  if (imageResult.cancelled) {
    throw new Error('picker cancelled')
  }

  console.log('pickFile end')

  return imageResult
}

const uploadFile = async (uri: string) => {
  console.log('uploadFile begin')
  const resp = await uploadAsync(SERVER_URL, uri, {
    httpMethod: 'PUT',
    uploadType: FileSystemUploadType.BINARY_CONTENT,
  })
  console.log('resp', resp)
  console.log('uploadFile end')
}

export default function App() {

  const handlePressUploadFile = async () => {
    console.log('handlePressUploadFile begin')

    try {
      const file = await pickFile()
      const { uri } = file
      console.log('handlePressUploadFile uri', uri)
      await uploadFile(uri)
    } catch (e) {
      console.log('caught exception', e)
    }

    console.log('handlePressUploadFile end')
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 256 }}></View>
      <Text>Upload a file.</Text>
      <Button
        title="upload file"
        onPress={handlePressUploadFile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
});
