import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const OtpSendView = (props) => {

    const {mobileNumber, onChangeMobileNumber, getOtp, error, onFocusTextInput} = props;

    return (
        <View style={{marginHorizontal: 16, flex: 1}}>
            <View style={{alignItems: 'center', marginTop: 56, marginBottom: 46}}>
                <Text style={{color: 'black', fontSize: 18}}>Please input your mobile number</Text>
            </View>
            <View style={{backgroundColor: '#FFFFFF', borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{padding: 8}}>
                    <Text style={{color: '#000000', fontSize: 18, borderRightColor: '#000000', borderRightWidth: 1, paddingRight:8}}>+91</Text>
                </View>
                <TextInput 
                    onFocus={()=>{onFocusTextInput()}}
                    value={mobileNumber}
                    onChangeText={(text)=>onChangeMobileNumber(text)}
                    placeholder="Enter mobile number"
                    placeholderTextColor='grey'
                    style={{color: '#000000', fontSize: 18}}
                    keyboardType='numeric'
                    maxLength={10}
                />
            </View>
            {
                error.length>0 ? <Text style={{color: 'red', marginVertical: 4}}>{error}</Text> : null
            }      
            <View style={{paddingHorizontal: 40, marginTop: 30}}>
                <TouchableOpacity 
                    style={{backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}
                    onPress={()=>{getOtp()}} >
                    <Text style={{color: '#FFFFFF', fontSize: 18, padding: 12}}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OtpSendView;