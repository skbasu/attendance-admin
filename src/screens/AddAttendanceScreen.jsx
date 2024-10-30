import React, { useState, useEffect } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import instance from '../api.js';
import Sidebar from '../components/Sidebar.jsx';
import { convertToDate } from '../utils/formattedDate.js';
import { getInitialsAndTitle } from '../utils/formattedTeachersName.js';

const AddAttendanceScreen = () => {

    const match = useMatch("/classes/:classid/attendance")
    const classid = match.params.classid;
    const navigateTo = useNavigate();

    const [studentids, setStudentIds] = useState("");
    const [studentstatus, setStudentStatus] = useState("");
    const [classinfo, setclassInfo] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }

        const getclassinfo = async () => {
            await instance.get(`/class/info/${classid}`, {
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                },
            })
                .then((res) => {
                    setclassInfo(res.data[0]);
                })
        }

        const getStudents = async () => {
            await instance.get("/student", {
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
        getclassinfo();
    }, [classinfo, students])

    const addAttendance = async () => {
        const valuesArray = studentids.split(',').map(value => value.trim());
        await instance.post(`/class/records/${classid}`, {
            student_ids: valuesArray,
            status: studentstatus,
        }, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            },
        }).then((res) => {
            if (res.data.statusmsg === "ok") {
                alert("Attendance added successfully");
                setStudentIds("");
                setStudentStatus("");
            } else {
                alert("Attendance could not be added");
            }
        })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ flex: "0.7" }}>
                <h3 style={styles.header}>Add Attendance</h3>
                <div style={{ marginLeft: "20px", marginBottom: "10px", color: "grey" }}>
                    <h3>{convertToDate(classinfo?.class_date)}</h3>
                    <h3>{classinfo?.paper_code}</h3>
                    <h3>{classinfo?.paper_name}</h3>
                    <h3>{getInitialsAndTitle(classinfo?.teacher_name, classinfo?.teacher_gender)}</h3>
                </div>
                <div>
                    <input
                        style={styles.inputField}
                        onChange={(e) => setStudentIds(e.target.value)}
                        placeholder='Enter Student Ids or Roll Nos'
                        value={studentids}
                    />
                    <br />
                    <br />
                    <select style={styles.selectField} value={studentstatus} onChange={(e) => setStudentStatus(e.target.value)}>
                        <option value="" disabled selected>Select Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                    <br />
                    <br />
                    <button style={styles.submitButton} onClick={addAttendance}>Submit</button>
                </div>
            </div>  
            <div style={{  borderLeft: "1px solid #AC64FF" }}>
                <h1 style={{ margin: "10px", color: "#AC64FF" }}>Students</h1>
                <div style={{ marginTop: "10px"}}>
                    {
                        students.map((student) => (
                            <div style={{ display: "flex", alignItems: "center", margin: "10px", color: "grey" }}>
                                <h3 style={{ fontSize: "18px" }}>{student.student_id}</h3>
                                <h3 style={{ fontSize: "18px", marginLeft: "25px" }}>{student.student_name}</h3>
                            </div>
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

export default AddAttendanceScreen;