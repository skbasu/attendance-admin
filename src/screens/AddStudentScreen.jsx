import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import instance from '../api';
import { useNavigate } from 'react-router-dom';

const AddStudentScreen = () => {

    const navigateTo = useNavigate();

    const [studentid, setStudentId] = useState("");
    const [studentemail, setStudentEmail] = useState("");
    const [studentpassword, setStudentpassword] = useState("");
    const [studentname, setStudentName] = useState("");
    const [studentsemester, setStudentSemester] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }
    }, [])
        
    const addStudents = async () => {
        await instance.post('student/add', {
            id: studentid,
            email: studentemail,
            password: studentpassword,
            name: studentname,
            semester: studentsemester
        }, {
            headers: {
                "Content-Type" : "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        }).then((res) => {
            if (res.data.statusmsg === "ok"){
                alert("Student added successfully");
            } else {
                alert("Student could not be added")
            }
        })
    }

     
    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.formContainer}>
                <h3 style={styles.header}>Add New Student</h3>
                <div style={styles.form}>
                    <input
                        style={styles.inputField}
                        onChange={(e) => setStudentId(e.target.value)}
                        type='text'
                        placeholder='Enter Student Id'
                        value={studentid}
                    />
                    <input
                        style={styles.inputField}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        type='email'
                        placeholder='Enter Student Email'
                        value={studentemail}
                    />
                    <input
                        style={styles.inputField}
                        onChange={(e) => setStudentpassword(e.target.value)}
                        type='password'
                        placeholder='Enter Student Password'
                        value={studentpassword}
                    />
                    <input
                        style={styles.inputField}
                        onChange={(e) => setStudentName(e.target.value)}
                        type='text'
                        placeholder='Enter Student Name'
                        value={studentname}
                    />
                    <input
                        style={styles.inputField}
                        onChange={(e) => setStudentSemester(e.target.value)}
                        type='text'
                        placeholder='Enter Student Semester'
                        value={studentsemester}
                    />
                    <br />
                    <button style={styles.submitButton} onClick={addStudents}>Submit</button>
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

export default AddStudentScreen;