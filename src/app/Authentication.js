import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, ToastAndroid, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../components/CustomInput";
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import { initializeApp } from "firebase/app";
import { getAuth, PhoneAuthProvider } from "firebase/auth";
import { collection, query, where, getFirestore, getDocs } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { auth, firebaseConfig } from "../../../firebase";
import AppLoading from "expo-app-loading";
import { useFonts, Poppins_100Thin, Poppins_100Thin_Italic, Poppins_200ExtraLight, Poppins_200ExtraLight_Italic, Poppins_300Light, Poppins_300Light_Italic, Poppins_400Regular, Poppins_400Regular_Italic, Poppins_500Medium, Poppins_500Medium_Italic, Poppins_600SemiBold, Poppins_600SemiBold_Italic, Poppins_700Bold, Poppins_700Bold_Italic, Poppins_800ExtraBold, Poppins_800ExtraBold_Italic, Poppins_900Black, Poppins_900Black_Italic } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Authentication() {
  // const [loading, setLoading] = useState(false);
  // const { control, handleSubmit } = useForm();
  // const navigation = useNavigation();

  // const recaptchaVerifier = useRef(null);
  // const [verificationId, setVerificationId] = useState("");
  // const [checkMobileNumber, setCheckMobileNumber] = useState(false);

  // const goToVerifyOTP = async (data) => {
  //   if (loading) {
  //     return;
  //   }
  //   setLoading(true);

  //code by priyanshi start
  // const { mobile } = data;
  // const phoneNumber = "+91".concat(mobile);

  // const phoneRef = collection(firestore, "sellers");
  // const q = query(phoneRef, where("phone", "==", mobile));
  // const querySnapshot = await getDocs(q);
  // const userData = querySnapshot.docs.map((doc) => doc.data());

  // if (
  //     userData != "" ||
  //     sellersMobileArray.find((element) => element == phoneNumber)
  // ) {
  //     setCheckMobileNumber(true);
  // }
  // //code by priyanshi end
  // if (checkMobileNumber) {
  //     const phoneProvider = new PhoneAuthProvider(auth);

  //     try {
  //         const verificationId = await phoneProvider.verifyPhoneNumber(
  //             phoneNumber,
  //             recaptchaVerifier.current
  //         );
  //         setVerificationId(verificationId);
  //         ToastAndroid.show("OTP Sent Successfully !", ToastAndroid.SHORT);
  //         setLoading(false);
  //         navigation.navigate("VerifyOTP", {
  //             verificationId: verificationId,
  //             mobile: mobile,
  //         });
  //     } catch (err) {
  //         Alert.alert("An Unexpected Error Occured", "Kindly try Again Later.");
  //         setLoading(false);
  //     }
  // } else {
  //     Alert.alert(
  //         "Mobile Number Not Registered",
  //         "This mobile number is not linked with any seller. Kindly check the mobile number and try again."
  //     );
  //     setLoading(false);
  // }

  //   const { mobile } = data;
  //   const phoneNumber = "+91".concat(mobile);

  //   const phoneRef = collection(firestore, "sellers");
  //   const q = query(phoneRef, where("phone", "==", mobile));
  //   const querySnapshot = await getDocs(q);
  //   const userData = querySnapshot.docs.map((doc) => doc.data());
  //   // console.log(userData);
  //   const isRegistered = userData.length > 0;

  //   const phoneProvider = new PhoneAuthProvider(auth);

  //   try {
  //     const verificationId = await phoneProvider.verifyPhoneNumber(
  //       phoneNumber,
  //       recaptchaVerifier.current
  //     );
  //     setVerificationId(verificationId);
  //     ToastAndroid.show("OTP Sent Successfully!", ToastAndroid.SHORT);
  //     setLoading(false);
  //     navigation.navigate("VerifyOTP", {
  //       verificationId: verificationId,
  //       mobile: mobile,
  //       isRegistered: isRegistered,
  //     });
  //   } catch (err) {
  //     console.log(err)
  //     Alert.alert("An Unexpected Error Occured", "Kindly try Again Later.");
  //     setLoading(false);
  //   }
  // };

  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm();
  const navigation = useNavigation();

  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState("");

  useEffect(() => {
    async function checkIsLoggedIn() {
      const login = await AsyncStorage.getItem("isLoggedIn");
      if (login === "true") navigation.navigate("BotNav");
    }
    checkIsLoggedIn();
  }, []);

  const sendVerification = async (data) => {
    if (loading) {
      return;
    }
    setLoading(true);

    const { mobile } = data;
    const phoneNumber = "+91".concat(mobile);
    const phoneProvider = new PhoneAuthProvider(auth);

    try {
      const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current);
      setVerificationId(verificationId);
      ToastAndroid.show("OTP Sent Successfully", ToastAndroid.SHORT);
      setLoading(false);
      navigation.navigate("VerifyOTP", { verificationId: verificationId, phoneNumber: phoneNumber });
    } catch (err) {
      Alert.alert("An Unexpected Error Occured", "Kindly try Again Later.");
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} attemptInvisibleVerification={true} androidHardwareAccelerationDisabled={true} androidLayerType="software" />

        <Image
          style={{
            width: 300,
            height: 170,
            marginTop: 30,
            resizeMode: "contain",
          }}
          source={require("../../../assets/Images/logo-app.png")}
        />
        <View
          style={
            {
              // flexDirection: "row",
            }
          }
        >
          <Text style={styles.title}>Bolesale</Text>
        </View>

        <Image style={{ width: 300, height: 250 }} source={require("../../../assets/Images/login.gif")} />

        <CustomInput
          name="mobile"
          placeholder="Enter Mobile Number"
          control={control}
          keyboardType="phone-pad"
          rules={{
            required: "Phone Number is Required",
            minLength: {
              value: 10,
              message: "Mobile Number should consist of 10 Numbers",
            },
            maxLength: {
              value: 10,
              message: "Mobile Number should consist of 10 Numbers Only",
            },
          }}
        />

        <View style={styles.space}></View>

        <CustomButton
          text={loading ? <ActivityIndicator color="white" /> : "Send OTP"}
          // onPress={handleSubmit(goToVerifyOTP)}
          onPress={handleSubmit(sendVerification)}
          bgColor="#008080"
        />

        {/* <CustomButton
          text="Want to Become a Seller? Click Here"
          onPress={goToRegister}
          type="TERTIARY"
        /> */}
      </View>
      {/* <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Newuser")}
        >
          <Text>
            Not having an account ?
          </Text>
          </TouchableOpacity>
        </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  title: {
    fontFamily: "Poppins_500Medium",
    marginBottom: 10,
    fontSize: 30,
    fontWeight: "600",
    width: "85%",
    textAlign: "center",
    marginHorizontal: responsiveWidth(7),
  },

  space: {
    marginBottom: 20,
  },
});
