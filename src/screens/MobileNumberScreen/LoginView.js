import React from "react";
import {View} from 'react-native';

import OtpSendView from "./OtpSendView";
import OtpView from "./OtpView";

const LoginView = (props) => {

    const {otpScreen, mobileNumber, onChangeMobileNumber, getOtp, error, onFocusTextInput, handleOtpTextChange, otp, submitOtp, otpError} = props;

    return (
        <View style={{flex: 1}}>
            {
                !otpScreen ? 
                    <OtpSendView 
                        mobileNumber={mobileNumber}
                        onChangeMobileNumber={onChangeMobileNumber}
                        getOtp={getOtp}
                        error={error}
                        onFocusTextInput={onFocusTextInput}
                    />:

                    <OtpView 
                        handleOtpTextChange={handleOtpTextChange}
                        otp={otp}
                        submitOtp={submitOtp}
                        otpError={otpError}
                    />
            }
        </View>
    )
}

export default LoginView;