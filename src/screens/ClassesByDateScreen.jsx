import React, { useState, useEffect } from "react";
import ClassCard from "../components/ClassCard";
import Sidebar from "../components/Sidebar";
import instance from "../api";
import { useNavigate } from 'react-router-dom';
import './Home.css';

const ClassesByDateScreen = () => {

    const [classes, setClasses] = useState([]);
    const [classdate, setclassDate] = useState("");
    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }
    },[])

    const getClassesByDate = async () => {
        await instance.get(`/class/classes/${classdate}`, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        })
            .then((response) => {
                setClasses(response.data);
            })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div>
                <h3 style={styles.header}>Classes By Date</h3>
                <div>
                    <input
                        onChange={(e) => setclassDate(e.target.value)}
                        style={styles.inputField}
                        type='date'
                        placeholder='Enter Date'
                    />
                    <button onClick={getClassesByDate} style={styles.submitButton}>Submit</button>
                </div>
                <div className="classes">
                    {
                        classes.map((clas) => (
                            <ClassCard
                                date={clas.class_date}
                                teacherName={clas.teacher_name}
                                gender={clas.teacher_gender}
                                paperCode={clas.paper_code}
                                paperName={clas.paper_name}
                                classType={clas.class_type}
                                classMode={clas.class_mode}
                                classId={clas.class_id}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        backgroundColor: "#F2EDF3",
    },
    header: {
        marginTop: "20px",
        fontSize: "30px",
        color: "#AC64FF",
        marginBottom: "10px",
        marginLeft: "20px",
    },
    inputField: {
        width: "220px",
        height: "20px",
        padding: "10px",
        borderStyle: "none",
        borderRadius: "4px",
        border: "2px solid #AC64FF",
        marginLeft: "20px"
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
        marginLeft: "20px",
    }
}

export default ClassesByDateScreen;