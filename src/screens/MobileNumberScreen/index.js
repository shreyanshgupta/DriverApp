import React, { useContext, useEffect, useState, useRef } from 'react';
import {Keyboard, View} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import LoginView from './LoginView';
import { AuthContext } from '../../../AuthContext';

const MobileNumberScreen = () => {

    const [mobileNumber, setMobileNumber] = useState('');
    const [otpScreen, setOtpScreen] = useState(false);
    const [error, setError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otp, setOtp] = useState('');
    
    let errorTimeout;
    
    const { signIn } = useContext(AuthContext);

    const onChangeMobileNumber = (text) => {
        setMobileNumber(text.replace(/[^0-9]/g, ''));
    }

    const getOtp = () => {
        Keyboard.dismiss();
        if(mobileNumber.length < 10 ){
            setError('Please enter valid mobile number')
            return
        }
        setOtpScreen(true);
    }

    const onFocusTextInput = () => {
        setError('')
    }

    const handleOtpTextChange = (text) => {
        setOtp(text);
    }

    useEffect(()=>{
        return(()=>{
            clearTimeout(errorTimeout);
        })
    },[])

    const submitOtp = async () => {
        console.log(otp);
        errorTimeout = setTimeout(()=>{
            setOtpError('')
        }, 3000)
        if(otp.length < 4){
            setOtpError('Please enter valid OTP');
            return;
        }else if(otp!='2800'){
            setOtpError('Incorrect OTP');
            return;
        }
        try{
            await EncryptedStorage.setItem("isLoggedIn", 'true');
        }catch(error){

        }
        clearTimeout(errorTimeout);
        signIn();
    }

    return (
        <LoginView 
            mobileNumber={mobileNumber}
            otpScreen={otpScreen}
            onChangeMobileNumber={onChangeMobileNumber}
            getOtp={getOtp}
            error={error}
            onFocusTextInput={onFocusTextInput}
            handleOtpTextChange={handleOtpTextChange}
            otp={otp}
            submitOtp={submitOtp}
            otpError={otpError}
        />
    )
}

export default MobileNumberScreen;