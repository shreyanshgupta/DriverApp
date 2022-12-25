import React from "react";
import { View, Text } from "react-native";

const SplashScreen = () => {
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 40, fontWeight: 'bold', color: '#000000'}}>DRIVER APP</Text>
        </View>
    )
}

export default SplashScreen;