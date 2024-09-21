import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    username: '',
    profileImage: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedProfileImage = await AsyncStorage.getItem('profileImage');

      console.log('Stored Username:', storedUsername);
      console.log('Stored Profile Image:', storedProfileImage);
      
      const user = auth.currentUser;
      
      setUserData({
        username: storedUsername || user?.displayName || 'User',
        profileImage: storedProfileImage || user?.photoURL || '',
      });

      // Update AsyncStorage if needed
      if (user) {
        if (!storedUsername) await AsyncStorage.setItem('username', user.displayName || 'User');
        if (!storedProfileImage && user.photoURL) await AsyncStorage.setItem('profileImage', user.photoURL);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateUserData = async (newData) => {
    try {
      const updatedData = { ...userData, ...newData };
      setUserData(updatedData);

      // Update AsyncStorage
      await AsyncStorage.setItem('username', updatedData.username);
      await AsyncStorage.setItem('profileImage', updatedData.profileImage);

      // Update Firebase profile if needed
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, {
          displayName: updatedData.username,
          photoURL: updatedData.profileImage,
        });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, loadUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
