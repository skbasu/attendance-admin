import React, { useState, useEffect } from "react";
import ClassCard from "../components/ClassCard";
import Sidebar from "../components/Sidebar";
import instance from '../api.js';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const ClassesScreen = () => {

    const [papers, setPapers] = useState([]);
    const [paperId, setPaperId] = useState("");
    const [classes, setClasses] = useState([]);
    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
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
        getPapers();
    }, [papers, classes])

    const getClasses = async () => {
        await instance.get(`/class/${paperId}`, {
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
                <h3 style={styles.header}>Classes</h3>
                <div>
                    <select style={styles.selectField} value={paperId} onChange={(e) => setPaperId(e.target.value)}>
                        <option value="" disabled selected>Select Paper</option>
                        {
                            papers.map((paper) => (
                                <option value={paper.paper_id}>{paper.paper_name}</option>
                            ))
                        }
                    </select>
                    <button style={styles.submitButton} onClick={getClasses}>Submit</button>
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
                                classMode={clas.class_mode}
                                classId={clas.class_id}
                                insertedclass={clas}
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
    selectField: {
        width: "245px",
        height: "40px",
        padding: "10px",
        borderStyle: "none",
        borderRadius: "4px",
        border: "2px solid #AC64FF",
        marginLeft: "20px",
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

export default ClassesScreen;