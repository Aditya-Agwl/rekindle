import React from "react";
// import { auth, provider } from "firebase";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

const Login = ({ setUser }) => {
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    return <button onClick={loginWithGoogle}>Login with Google</button>;
};

export default Login;
