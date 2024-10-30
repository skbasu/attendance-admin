import React, {useState, useEffect} from "react";
import Sidebar from "../components/Sidebar";
import instance from '../api.js';
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigateTo = useNavigate();

    const [classdate, setClassDate] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [papers, setPapers] = useState([]);
    const [paperId, setPaperId] = useState("");
    const [classmode, setClassMode] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }

        const getTeachers = async () => {
            instance.get("/teacher", {
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                }
            })
            .then((response) => {
                setTeachers(response.data);
            })
        }

        const getPapers = async () => {
            instance.get("/paper", {
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                }
            })
            .then((response) => {
                setPapers(response.data);
            })
        }

        getTeachers();
        getPapers();
    }, [teachers, papers])

    const addClass = async () => {
        instance.post("/class/add", {
            date: classdate,
            teacher_id: teacherId,
            paper_id: paperId,
            mode: classmode
        }, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        }).then((res) => {
            if (res.data.statusmsg === "ok") {
                alert("Class added successfully");
                setClassDate("");
                setTeacherId("");
                setPaperId("")
                setClassMode("")
            } else {
                alert("Class could not be added")
            }
        })        
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.formContainer}>
                <h3 style={styles.header}>Add New Class</h3>
                <div style={styles.form}>
                    <input
                        style={styles.inputField}
                        onChange={(e) => setClassDate(e.target.value)}
                        type='date'
                        placeholder='Enter Class Date'
                        value={classdate}
                    />
                    <select style={styles.selectField} value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
                        <option value="" disabled selected>Select Teacher</option>
                        {
                            teachers.map((teacher) => (
                                <option value={teacher.teacher_id}>{teacher.teacher_name}</option>
                            ))
                        }
                    </select>
                    <select style={styles.selectField} value={paperId} onChange={(e) => setPaperId(e.target.value)}>
                        <option value="" disabled selected>Select Paper</option>
                        {
                            papers.map((paper) => (
                                <option value={paper.paper_id}>{paper.paper_name}</option>
                            ))
                        }
                    </select>
                    <select style={styles.selectField} value={classmode} onChange={(e) => setClassMode(e.target.value)}>
                        <option value="" disabled selected>Select Class Mode</option>
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                    </select>
                    <br />
                    <button style={styles.submitButton} onClick={addClass}>Submit</button>
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
    submitButton:{
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

export default Home;