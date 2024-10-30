import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import instance from '../api.js';

const SigninScreen = () => {

  const navigateTo = useNavigate();

  const [adminEmail, setAdminEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      navigateTo('/signin');
      localStorage.removeItem("admin-token");
    } else {
      navigateTo('/');
    }
  }, []);

  const handleSignin = async () => {
    setEmailError("");
    setPasswordError("");
    const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!adminEmail) {
      setEmailError("Email should not be blank")
    } else if (!regex.test(adminEmail)) {
      setEmailError("Not a valid email");
    } else if (!adminPassword) {
      setPasswordError("Password should not be blank");
    } else {
      await instance.post("/admin/signin", {
        email: adminEmail,
        password: adminPassword,
      })
      .then((response) => {
        if (response.data.status === "user exist") {
          localStorage.setItem("admin-token", response.data.token);
          localStorage.setItem("adminId", response.data.admin.admin_id);
          navigateTo("/");
        }
      })
      .catch((err) => {
        if (err.response.data.statusmsg === "donotexist"){
          setEmailError(err.response.data.msg);
        } else {
          setPasswordError(err.response.data.msg);
        }
      })
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h3 style={styles.header}>Sign In</h3>
        <div style={styles.form}>
          <input
            onChange={(e) => setAdminEmail(e.target.value)}
            style={styles.inputField}
            type='email'
            placeholder='Enter Your Email'
            value={adminEmail}
          />
          <p
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "3px"
            }}
          >{emailError}</p>
          <input
            onChange={(e) => setAdminPassword(e.target.value)}
            style={styles.inputField}
            type='password'
            placeholder='Enter Your Password'
            value={adminPassword}
          />
          <p
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "3px"
            }}
          >{passwordError}</p>
          <button onClick={handleSignin} style={styles.submitButton}>Sign In</button>
       </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#F2EDF3",
    display: "flex",              
    justifyContent: "center",     
    alignItems: "center",         
    height: "100vh",              
  },
  header: {
    textAlign: "center",
    fontSize: "30px",
    color: "#AC64FF",
    marginBottom: "20px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",      
    alignItems: "center",          
    width: "100%",
    height: "100vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputField: {
    width: "220px",
    height: "20px",
    padding: "10px",
    borderStyle: "none",
    borderRadius: "4px",
    border: "2px solid #AC64FF",
    marginTop: "12px"
  },
  submitButton: {
    height: "35px",
    width: "130px",
    color: "aliceblue",
    borderStyle: "none",
    borderRadius: "4px",
    backgroundColor: "#AC64FF",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "400",
    marginTop: "12px"
  }
};



export default SigninScreen;