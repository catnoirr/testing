
"use client"

import { auth } from "../app/firebase"
import {
    ConfirmationResult,
    signInWithPhoneNumber,
    RecaptchaVerifier,
  } from "firebase/auth";
import React, { useState, useEffect,FormEvent,useTransition } 
from 'react'
import{
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "./ui/input-otp"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
function OTPlogin() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [errer , setErrer] = useState("");
    const [success , setSuccess] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
    const [RecaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [isPending, startTransition] = useTransition();
    useEffect(() => {
        let timer
        if (resendCountdown > 0) {
          timer = setTimeout(() => 
            setResendCountdown(resendCountdown - 1)
          , 1000);
        }
   return () => {
          clearTimeout(timer);
        };
    }),[resendCountdown];

    useEffect(() => {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
       
      );
      setRecaptchaVerifier(recaptchaVerifier);
    }, [auth]);
const requestOtp = async (e) => {
  e?.preventDefault();
  setResendCountdown(60);
  startTransition(async() => {
      setErrer("");
      if(!recaptchaVerifier){
        
      }
  })
}

  return(
    <div>
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            Please Enter your number with the country code
          </p>
          
        </form>

      )}
      <Button 
      disabled={!phoneNumber || isPending || resendCountdown > 0}
      onClick={() => requestOtp()}
      className="mt-5"
      >
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown} seconds`
          : isPending
          ? "Sending OTP"
          :"Send OTP"
        }
        
      </Button>
      <div className="p-10 text-center">
     {errer && <p className="text-red-500">{errer}</p>}
     {success && <p className="text-green-500">{success}</p>}
      </div>
      <div id="recaptcha-container"/>
    </div>
  );
  
}

export default OTPlogin
