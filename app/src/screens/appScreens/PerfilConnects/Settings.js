import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, TouchableOpacity, Text, SafeAreaView, StyleSheet, Modal } from 'react-native';
import { getAuth, updateEmail, updatePassword, deleteUser, sendEmailVerification } from 'firebase/auth';
import { getDoc, updateDoc, collection, doc, deleteDoc, getFirestore } from 'firebase/firestore';
import { auth as firebaseAuth, db as firebaseDb } from '../../../config/firebaseConfig'; // Importando auth e db do firebaseConfig
import Fonts from '../../../utils/Fonts';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function Settings({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth(); // Inicializa o auth
  const db = getFirestore(); // Inicializa o db
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const usersCollection = collection(db, "Users");
      const userDocRef = doc(usersCollection, user.uid);

      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setNome(userData.nome || '');
            setEmail(userData.email || '');
            // Não é recomendado armazenar senhas no Firestore
            // setSenha(userData.senha || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleSaveNome = async () => {
    const usersCollection = collection(db, "Users");
    const userDocRef = doc(usersCollection, user.uid);
    try {
      await updateDoc(userDocRef, {
        nome: nome
      });
      Alert.alert('Nome Atualizado com Sucesso');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEmail = async () => {
    try {
      await updateEmail(auth.currentUser, email);
      const usersCollection = collection(db, "Users");
      const userDocRef = doc(usersCollection, user.uid);
      await updateDoc(userDocRef, {
        email: email
      });

      sendEmailVerification(auth.currentUser)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Verifique seu Email',
            text2: 'Por favor verifique seu email para poder continuar!',
            position: 'bottom',
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          console.error("Erro ao enviar email de verificação:", error);
          Alert.alert('Erro', 'Erro ao enviar o e-mail de verificação.');
        });

      console.log('Email Atualizado com Sucesso');
      Alert.alert('Sucesso', 'Email atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o email:', error);
      Alert.alert('Erro', 'Erro ao atualizar o email.');
    }
  };


  const handleSaveSenha = async () => {
    try {
      await updatePassword(auth.currentUser, senha);
      Alert.alert('Senha Atualizada com Sucesso');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao atualizar a senha.');
    }
  };

  const handleSaveAll = async () => {
    try {
      await handleSaveNome();
      await handleSaveEmail();
      await handleSaveSenha();
      Alert.alert('Todas as atualizações foram bem-sucedidas');
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmDeleteAccount = async () => {
    setShowModal(false);
    try {
      if (user) {
        await deleteUser(user);
        await deleteDoc(doc(db, 'Users', user.uid));
        console.log('Conta excluída com sucesso');
        Toast.show({
          type: 'success',
          text1: 'Conta excluída',
          text2: 'Sua conta foi excluída com sucesso',
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
        });
      } else {
        console.log('Nenhum usuário está autenticado no momento');
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao excluir a conta do usuário',
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#333" }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ padding: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Editar Conta</Text>
          <Text style={styles.subtitle}>
            Mantenha seu perfil atualizado e aproveite ao máximo todas as funcionalidades.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={nome ? nome : "Nome"}
            placeholderTextColor={"#626262"}
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder={email ? email : "Email"}
            placeholderTextColor={"#626262"}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha"
              placeholderTextColor={"#626262"}
              value={senha}
              onChangeText={setSenha}
              style={{
                fontFamily: Fonts["poppins-regular"],
                fontSize: 14,
                padding: 10 * 1.7,
                flex: 1,
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#333"
                style={{ paddingHorizontal: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleSaveAll} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Continuar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 3 }} onPress={() => setShowModal(true)}>
          <Text style={{ fontFamily: Fonts["poppins-semiBold"], color: '#ff0000', textAlign: 'center', fontSize: 14 }}>DELETAR CONTA</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza de que deseja <Text style={{ color: '#ff0000' }}>DELETAR</Text> sua conta?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={confirmDeleteAccount} style={[styles.modalButton, styles.confirmButton]}>
                <Text style={styles.modalButtonText}>DELETAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelLogout} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 55,
    marginLeft: 35,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontFamily: Fonts["poppins-bold"],
    marginVertical: 30,
  },
  subtitle: {
    fontFamily: Fonts["poppins-regular"],
    marginTop: -20,
    fontSize: 15,
    maxWidth: "80%",
    textAlign: 'center',
    color: '#fff',
  },
  inputContainer: {
    marginVertical: 30,
  },
  input: {
    fontFamily: Fonts["poppins-regular"],
    fontSize: 14,
    padding: 17,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#444' 
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 10,
  },
  saveButton: {
    padding: 12,
    backgroundColor: '#000',
    marginVertical: 30,
    borderRadius: 10,
  },
  saveButtonText: {
    fontFamily: Fonts["poppins-bold"],
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff' ,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Fonts['poppins-bold'],
  },
  modalButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts['poppins-bold'],
  },
});
