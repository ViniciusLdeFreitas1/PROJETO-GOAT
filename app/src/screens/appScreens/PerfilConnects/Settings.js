import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, TouchableOpacity, Text, SafeAreaView, StyleSheet, Modal } from 'react-native';
import { updateEmail, updatePassword, deleteUser } from 'firebase/auth';
import { getDoc, updateDoc, collection, doc, deleteDoc, getFirestore } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Fonts from '../../../utils/Fonts';
import { auth, db } from '../../../config/firebaseConfig';

export default function Settings({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const user = auth.currentUser;
  const usersCollection = collection(db, "Users");
  const userId = user.uid;
  const userDocRef = doc(usersCollection, userId);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNome(userData.nome || '');
          setEmail(userData.email || '');
          setSenha(userData.senha || '');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveNome = async () => {
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
      // Verifica se o e-mail foi alterado
      if (email === user.email) {
        Alert.alert('Nenhuma alteração', 'O e-mail é o mesmo do atual.');
        return;
      }
      
      // Atualiza o e-mail do usuário
      await updateEmail(auth.currentUser, email);
      
      // Atualiza o e-mail no Firestore
      await updateDoc(userDocRef, {
        email: email
      });
      
      console.log('Email Atualizado com Sucesso');
      Alert.alert('Sucesso', 'Email atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o email:', error);
  
      let errorMessage = "Erro ao atualizar o e-mail.";
      
      // Verifica o tipo de erro e define a mensagem adequada
      if (error.code === 'auth/invalid-email') {
        errorMessage = "O e-mail fornecido é inválido.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este e-mail já está em uso por outra conta.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Você precisa fazer login novamente para atualizar o e-mail.";
      }
  
      Alert.alert('Erro', errorMessage);
    }
  };
  

  const handleSaveSenha = async () => {
    try {
      await updatePassword(auth.currentUser, senha);
      await updateDoc(userDocRef, {
        senha: senha
      });
      Alert.alert('Senha Atualizada com Sucesso');
    } catch (error) {
      console.error(error);
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
      const user = auth.currentUser;
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Conta</Text>
          <Text style={styles.subtitle}>
            Mantenha seu perfil atualizado e aproveite ao máximo todas as funcionalidades.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder={nome ? nome : "Nome"}
            placeholderTextColor="#626262"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder={email ? email : "Email"}
            placeholderTextColor="#626262"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#626262"
              value={senha}
              onChangeText={setSenha}
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleSaveAll} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Continuar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza de que deseja <Text style={styles.deleteText}>DELETAR</Text> sua conta?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={confirmDeleteAccount} style={styles.confirmButton}>
                <Text style={styles.modalButtonText}>DELETAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelLogout} style={styles.cancelButton}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ... (resto do código)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  backButton: {
    position: 'absolute',
    top: 30, // Altere a posição vertical para 20 para mover o botão para cima
    left: 20,
    zIndex: 10,
  },
  innerContainer: {
    padding: 20,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts['poppins-semiBold'],
    color: '#fff', // Alterado para branco
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts['poppins-regular'],
    color: '#fff', // Alterado para branco
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    color: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: Fonts['poppins-regular'],
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontFamily: Fonts['poppins-regular'],
  },
  eyeIcon: {
    paddingHorizontal: 10,
    color: "#F56D09"
  },
  saveButton: {
    backgroundColor: "#F56D09",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts['poppins-semiBold'],
  },
  deleteButton: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#ff0000',
    fontFamily: Fonts['poppins-semiBold'],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    color: "#333",
    fontFamily: Fonts['poppins-semiBold'],
    marginBottom: 20,
  },
  deleteText: {
    color: '#ff0000',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts['poppins-semiBold'],
  },
});
