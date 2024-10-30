import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import instance from '../api.js';
import { useNavigate } from 'react-router-dom';

const AddTeacherScreen = () => {

    const [teachername, setTeacherName] = useState("");
    const [teachergender, setTeacherGender] = useState("");
    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }
    },[])
    
    const addteachers = async () => {
        await instance.post('/teacher/add', {
            name: teachername,
            gender: teachergender,
        }, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        }).then((res) => {
            if (res.data.statusmsg === "ok") {
                alert("Teacher added successfully");
            } else {
                alert("Teacher could not be added")
            }
        })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.formContainer}>
                <h3 style={styles.header}>Add New Teacher</h3>
                <div style={styles.form}>
                    <input
                        style={styles.inputField}
                        onChange={(e) => setTeacherName(e.target.value)}
                        type='text'
                        placeholder='Enter Teacher Name'
                        value={teachername}
                    />
                    <select style={styles.selectField} value={teachergender} onChange={(e) => setTeacherGender(e.target.value)}>
                        <option value="" disabled selected>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <br />
                    <button style={styles.submitButton} onClick={addteachers}>Submit</button>
                </div>
            </div>            
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        width: "100%",
        backgroundColor: "#F2EDF3",
    },
    header: {
        textAlign: "center",
        alignItems: "center",
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
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
    },
    inputField: {
        width: "220px",
        height: "20px",
        padding: "10px",
        borderStyle: "none",
        borderRadius: "4px",
        border: "2px solid #AC64FF"
    },
    selectField: {
        width: "245px",
        height: "40px",
        padding: "10px",
        borderStyle: "none",
        borderRadius: "4px",
        border: "2px solid #AC64FF"
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
        fontWeight: "400"
    }
}

export default AddTeacherScreen;