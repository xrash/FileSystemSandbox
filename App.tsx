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

const SERVER_BASE_URL = 'http://7167-2804-431-c7c1-e74f-fa28-19ff-febe-5f69.ngrok.io'

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

const uploadFileBinary = async (uri: string) => {
  console.log('uploadFileBinary begin')
  console.log('uploadFileBinary uri', uri)
  const resp = await uploadAsync(`${SERVER_BASE_URL}/upload-binary`, uri, {
    httpMethod: 'PUT',
    uploadType: FileSystemUploadType.BINARY_CONTENT,
  })
  console.log('uploadFileBinary resp', resp)
  console.log('uploadFileBinary end')
}

const uploadFileMultipart = async (uri: string) => {
  console.log('uploadFileMultipart begin')
  console.log('uploadFileMultipart uri', uri)
  const resp = await uploadAsync(`${SERVER_BASE_URL}/upload-multipart`, uri, {
    httpMethod: 'PUT',
    uploadType: FileSystemUploadType.MULTIPART,
    fieldName: 'file',
  })
  console.log('uploadFileMultipart resp', resp)
  console.log('uploadFileMultipart end')
}

export default function App() {

  const handlePressUploadBinary = async () => {
    console.log('handlePressUploadBinary begin')

    try {
      const file = await pickFile()
      const { uri } = file
      await uploadFileBinary(uri)
    } catch (e) {
      console.log('exception', e)
    }

    console.log('handlePressUploadBinary end')
  }

  const handlePressUploadMultipart = async () => {
    console.log('handlePressUploadMultipart begin')

    try {
      const file = await pickFile()
      const { uri } = file
      await uploadFileMultipart(uri)
    } catch (e) {
      console.log('exception', e)
    }

    console.log('handlePressUploadMultipart end')
  }

  return (
    <View style={styles.container}>
      <View style={{ height: 256 }}></View>
      <View style={{ margin: 32 }}>
        <Button
          title="upload file binary"
          onPress={handlePressUploadBinary}
        />
      </View>
      <View style={{ margin: 32 }}>
        <Button
          title="upload file multipart"
          onPress={handlePressUploadMultipart}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
})
