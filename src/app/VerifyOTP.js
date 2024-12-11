import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Alert } from "react-native";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { setDoc, doc, Timestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firestore = db;

export default function VerifyOTP({ route }) {
  const info = route.params;
  const verificationId = info.verificationId;
  const phoneNumber = info.phoneNumber;

  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState();

  const { control, handleSubmit } = useForm();
  const navigation = useNavigation();

  useEffect(() => {
    async function saveUid() {
      await AsyncStorage.setItem("uid", uid);
    }
    if (uid) saveUid();
  }, [uid]);

  useEffect(() => {
    async function savePhone() {
      await AsyncStorage.setItem("mobile", phoneNumber);
    }
    if (phoneNumber) savePhone();
  }, [phoneNumber]);

  const verifyOTP = async (data) => {
    if (loading) return;
    setLoading(true);
    const { verificationCode } = data;

    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const authResult = await signInWithCredential(auth, credential);

      const date = new Timestamp.now();
      const user = auth.currentUser;
      const uid = user.uid;
      setUid(uid);

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.data().address) {
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("Category", "clothing");
          navigation.navigate("BotNav");
        } else {
          const myDoc = doc(firestore, "users", uid);
          const docData = {
            uid: uid,
            phone: phoneNumber,
            createdAt: date,
            updatedAt: date,
          };
          await setDoc(myDoc, docData, { merge: true }).then(() => AsyncStorage.setItem("isLoggedIn", "true"), AsyncStorage.setItem("Category", "clothing"), navigation.navigate("Personal"));
        }
      } catch (err) {
        const myDoc = doc(firestore, "users", uid);
        const docData = {
          uid: uid,
          phone: phoneNumber,
          createdAt: date,
          updatedAt: date,
        };
        await setDoc(myDoc, docData, { merge: true }).then(() => AsyncStorage.setItem("isLoggedIn", "true"), AsyncStorage.setItem("Category", "clothing"), navigation.navigate("Personal"));
      }
    } catch (err) {
      Alert.alert("Incorrect OTP!", "An Unexpected Error occured. Kindly check the OTP and try again.");
    }
  };

  const resendOTP = () => {
    navigation.goBack();
    setLoading(false);
  };

  const changeNumber = async () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
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
          <Text style={styles.title1}>B2B Marketplace</Text>
        </View>

        <Image style={{ width: 250, height: 200, marginBottom: 10 }} source={require("../../../assets/Images/login.gif")} />

        <CustomInput
          name="verificationCode"
          placeholder="Enter OTP"
          control={control}
          keyboardType="number-pad"
          rules={{
            required: "OTP is Required",
            minLength: {
              value: 6,
              message: "OTP consists of 6 Digits only",
            },
            maxLength: {
              value: 6,
              message: "OTP consists of 6 Digits only",
            },
          }}
        />
        <CustomButton text={loading ? <ActivityIndicator color="white" /> : "Submit"} onPress={handleSubmit(verifyOTP)} bgColor="#008080" />

        <View style={{ flexDirection: "row", paddingHorizontal: 80 }}>
          <CustomButton text="Change Number" onPress={changeNumber} type="TERTIARY" />

          <CustomButton text="Resend Code" onPress={resendOTP} type="TERTIARY" />
        </View>
      </View>
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

  img: {
    marginTop: 80,
    marginBottom: 40,
    alignSelf: "center",
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 80,
    height: 300,
    width: "80%",
  },

  title: {
    marginBottom: 10,
    fontSize: 25,
    fontWeight: "600",
    width: "85%",
    textAlign: "center",
    marginHorizontal: responsiveWidth(7),
  },
  title1: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: "600",
    width: "85%",
    textAlign: "center",
    justifyContent: "center",
  },
});
