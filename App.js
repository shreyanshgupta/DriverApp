/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useReducer, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';

import MobileNumberScreen from './src/screens/MobileNumberScreen';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import { AuthContext } from './AuthContext';

const App = () => {

  const Stack = createNativeStackNavigator();

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch(action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
      }
    },
    {
      isLoading: true,
      userToken: null
    }
  )

  useEffect(()=>{
    const getIsUserLoggedIn = async () => {
      let userToken;
      try {
        userToken = await isUserLoggedIn();
        if(userToken === undefined || userToken === null){
          userToken = 'false'
        }
      }catch(e){
        
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken})
    }
    getIsUserLoggedIn();
  },[]);

  const isUserLoggedIn = async () => {
    try {
      const session = await EncryptedStorage.getItem("isLoggedIn");
      return session;
    }catch(error){
      
    }
  }

  const authContext = useMemo(() => ({
    signIn: async(data) => {
      dispatch({ type: 'SIGN_IN', token: 'true' });
    }
  }))

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
      <NavigationContainer>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator>
            {
              state.userToken === 'false' ? (
                <Stack.Screen name="MobileNumberScreen" component={MobileNumberScreen} options={{ title: 'Authentication' }}/>
              ) : (
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
              )
            }
          </Stack.Navigator>
        </AuthContext.Provider>
      </NavigationContainer>
  );
};

export default App;
