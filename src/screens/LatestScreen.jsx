import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import instance from '../api.js';
import './Home.css';
import { convertToDate } from '../utils/formattedDate.js';
import { getInitialsAndTitle } from '../utils/formattedTeachersName.js';
import { useNavigate } from 'react-router-dom';

const LatestScreen = () => {

    const navigateTo = useNavigate();

    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [latest, setLatest] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }

        const getStudents = async () => {
            instance.get("/student", {
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                }
            })
                .then((response) => {
                    setStudents(response.data);
                })
        }
        getStudents();
    }, [students])

    const getLatestDetails = async () => {
        await instance.get(`/student/latest/${studentId}`, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        })
            .then((response) => {
                setLatest(response.data)
            })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ width: "100%", margin: "20px" }}>
                <h3 style={styles.header}>Latest 10 classes</h3>
                <div>
                    <select style={styles.selectField} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                        <option value="" disabled selected>Select Student</option>
                        {
                            students.map((student) => (
                                <option value={student.student_id}>{student.student_name}</option>
                            ))
                        }
                    </select>
                    <button style={styles.submitButton} onClick={getLatestDetails}>Submit</button>
                </div>
                {latest && (
                    <table style={{ marginTop: "10px" }}>
                        <thead>
                            <tr>
                                <th>Paper Code</th>
                                <th>Paper Name</th>
                                <th>Class Date</th>
                                <th>Teacher Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                latest.map((cl) => (
                                    <tr style={{ alignItems: "center" }}>
                                        <td>{cl.paper_code}</td>
                                        <td>{cl.paper_name}</td>
                                        <td style={{ textAlign: "center" }}>{convertToDate(cl.class_date)}</td>
                                        <td style={{ textAlign: "center" }}>{getInitialsAndTitle(cl.teacher_name, cl.teacher_gender)}</td>
                                        <td style={{ textAlign: "center" }}>{
                                            cl.status === "present" ?
                                                (<h4 style={{ color: "green" }}>Present</h4>) : (<h4 style={{ color: "red" }}>Absent</h4>)
                                        }</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )}
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
        fontSize: "30px",
        color: "#AC64FF",
        marginBottom: "10px",
    },
    selectField: {
        width: "245px",
        height: "40px",
        padding: "10px",
        borderStyle: "none",
        borderRadius: "4px",
        border: "2px solid #AC64FF",
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
    },
    mainCard: {
        textAlign: "center",
        margin: "auto",
        marginTop: "10px",
        display: "flex",
        justifyContent: "space-evenly",
        width: "400px",
        boxShadow: '0 8px 16px rgba(22, 22, 22, 0.2)',
        transition: '0.3s',
        padding: "10px",
        alignItems: "center",
        height: "150px"
    },
    pertext: {
        fontSize: "52px",
        fontWeight: "bolder",
    },
    cardInfo: {
        alignItems: "center",
    },
    papersGrid: {
        marginTop: "15px",
        marginLeft: "20px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
    }
};

export default LatestScreen;