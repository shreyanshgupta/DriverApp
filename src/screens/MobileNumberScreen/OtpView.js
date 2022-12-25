import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import OTPInputView from '@twotalltotems/react-native-otp-input'

const OtpView = (props) => {

    const {handleOtpTextChange, otp, submitOtp, otpError} = props;

    return (
        <View style={{marginHorizontal: 16}}>
            <View style={{alignItems: 'center', marginTop: 56, marginBottom: 46}}>
                <Text style={{color: 'black', fontSize: 18}}>Please enter OTP</Text>
            </View>
            <OTPInputView
                pinCount={4} 
                keyboardType='number-pad'
                style={{ height: 50,width: '76%',alignSelf: 'center', marginBottom: 10}}
                codeInputFieldStyle={{color: '#000000',fontSize: 14,fontWeight: 'bold',width: 48,minHeight: 48,backgroundColor: '#FFFFFF',paddingVertical: 13,borderRadius: 6}}
                selectionColor='#000000'
                onCodeChanged={code => {handleOtpTextChange(code)}}
                code={otp}
                codeInputHighlightStyle={{borderColor: '#000000'}}
                autoFocusOnLoad
            />
            {
                otpError.length>0 ? <Text style={{color: 'red', textAlign: 'center'}}>{otpError}</Text> : null
            }      
            <View style={{paddingHorizontal: 40, marginTop: 52}}>
                <TouchableOpacity 
                    style={{backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}
                    onPress={()=>{submitOtp()}} >
                    <Text style={{color: '#FFFFFF', fontSize: 18, padding: 12}}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OtpView;