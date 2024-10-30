import React, {useState, useEffect} from 'react';
import PaperCard from '../components/PaperCard';
import Sidebar from '../components/Sidebar';
import instance from '../api.js';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

const ViewAttendanceScreen = () => {
    const navigateTo = useNavigate();
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [attendanceDetails, setAttendanceDetails] = useState([]);
    const [paperwiseattendenace, setPaperwiseattendance] = useState([]);

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
    }, [])

    const getAttendanceDetails = async () => {
        await instance.get(`/student/view/${studentId}`, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        })
        .then((response) => {
            setAttendanceDetails(response.data)
            setPaperwiseattendance(response.data.paperwise);
        })
    }

    const totalhours = attendanceDetails.alltotal_class_hours;
    const presenthours = attendanceDetails.allattended_class_hours;
    const attendancePercentage = (presenthours / totalhours) * 100; 
    const finalText = `${attendancePercentage.toFixed(1)}%`

    return (
        <div style={styles.container}>
            <Sidebar />
            <div>
                <h3 style={styles.header}>Attendance</h3>
                <div>
                    <select style={styles.selectField} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                        <option value="" disabled selected>Select Student</option>
                        {
                            students.map((student) => (
                                <option value={student.student_id}>{student.student_name}</option>
                            ))
                        }
                    </select>
                    <button style={styles.submitButton} onClick={getAttendanceDetails}>Submit</button>
                </div>
                <div style={styles.mainCard}>
                    <p style={styles.pertext}>{finalText}</p>
                    <div style={styles.cardInfo}>
                        <p>Total: {totalhours}</p>
                        <p>Attended: {presenthours}</p>
                        <p>Missed: {totalhours - presenthours}</p>
                    </div>
                </div>
                <div style={styles.papersGrid}>
                    {
                        paperwiseattendenace.map((paperattendace) => (
                            <PaperCard
                                papername={paperattendace.paper_name}
                                papercode={paperattendace.paper_code}
                                paperteacher={paperattendace.teacher_name}
                                gender={paperattendace.teacher_gender}
                                attended={paperattendace.attended_class_hours}
                                total={paperattendace.total_class_hours}
                            />
                        ))
                    }
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
    },
    mainCard:{
        textAlign: "center",
        margin: "auto",
        marginTop : "10px",
        display: "flex",
        justifyContent: "space-evenly",
        width: "350px",
        boxShadow: '0 8px 16px rgba(22, 22, 22, 0.2)',
        transition: '0.3s',
        padding: "10px",
        alignItems: "center",
        height: "120px"
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
        height: "58vh",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        overflowY: "scroll",
        scrollbarWidth: "none",
        gap: "20px",
    }
};

export default ViewAttendanceScreen;