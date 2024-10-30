import React, { useState, useEffect } from 'react';
import { useMatch,useNavigate } from 'react-router-dom';
import instance from '../api.js';
import Sidebar from '../components/Sidebar.jsx';
import './Home.css';
import Dialog from '@mui/material/Dialog';
import { convertToDate } from '../utils/formattedDate.js';
import { getInitialsAndTitle } from '../utils/formattedTeachersName.js';

const AttendanceScreen = () => {

    const match = useMatch("/classes/:classid/view/attendance")
    const classid = match.params.classid;
    const navigateTo = useNavigate();

    const [students, setStudents] = useState([]);
    const [classinfo, setclassInfo] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [updatedstudentStatus, setUpdatedstudentStatus] = useState("");

    const handleClickOpen = (student) => {
        setSelectedStudent(student)
        setUpdatedstudentStatus(student.status);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }

        const getStudents = async () => {
            await instance.get(`/class/attendance/${classid}`,{
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                }
            })
            .then((response) => {
                setStudents(response.data)
            })
        }

        const getclassinfo = async () => {
            await instance.get(`/class/info/${classid}`, {
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                }
            })
            .then((res) => {
                setclassInfo(res.data[0]);
            })
        }

        getStudents();
        getclassinfo();
    }, [students, classinfo])

    const updateStudentStatus = async (sid) => {
        await instance.put(`class/attendance/${classid}/${sid}`, {
            status: updatedstudentStatus
        }, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        }).then((res) => {
            if (res.data.statusmsg === "ok") {
                alert("Student's status updated successfully");
                handleClose();
                setUpdatedstudentStatus("");
            } else {
                alert("Student's status could not be updated")
            }
        })
    }

    const deleteStudentfromClass = async (sid) => {
        await instance.delete(`class/attendance/${classid}/${sid}`,{
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        })
            .then((res) => {
                if (res.data.statusmsg === "ok") {
                    alert("Student deleted from the class successfully");
                } else {
                    alert("Student could not be deleted from the class")
                }
            })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ width: "100%", margin: "20px" }}>
                <h3 style={styles.header}>Attendance</h3>
                <div style={{ display: "flex", justifyContent: "space-between", color: "grey" }}>
                    <h3>{convertToDate(classinfo?.class_date)}</h3>
                    <h3>{classinfo?.paper_code}</h3>
                    <h3>{classinfo?.paper_name}</h3>
                    <h3>{getInitialsAndTitle(classinfo?.teacher_name, classinfo?.teacher_gender)}</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            students.map((student) => (
                                <tr>
                                    <td style={{ textAlign: "center" }}>{student.student_id}</td>
                                    <td>{student.student_name}</td>
                                    <td style={{ textAlign: "center" }}>{
                                        student.status === "present" ?
                                            (<h4 style={{ color: "green" }}>Present</h4>) : (<h4 style={{ color: "red" }}>Absent</h4>)
                                    }</td>
                                    <td style={{textAlign: "center" }}>
                                        <button style={styles.editButton} onClick={() => handleClickOpen(student)}>Edit</button>
                                        <button style={styles.deleteButton} onClick={() => { if (confirm(`Delete ${student.student_name} from this class?`)) { deleteStudentfromClass(student.student_id) }; }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Dialog open={open} onClose={handleClose}>
                    {selectedStudent && (
                        <div style={{ padding: "20px" }}>
                            <h3 style={styles.header}>
                                {`Edit ${selectedStudent.student_name}'s Status`}
                            </h3>
                            <div>
                                <select style={styles.selectField} value={updatedstudentStatus} onChange={(e) => setUpdatedstudentStatus(e.target.value)}>
                                    <option value="" disabled selected>Select Status</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                </select>
                                <br />
                                <br />
                                <button style={styles.submitButton} onClick={() => updateStudentStatus(selectedStudent.student_id)}>Submit</button>
                            </div>
                        </div>
                    )}
                </Dialog>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        width: "100%",
        backgroundColor: "#F2EDF3",
    },
    header: {
        fontSize: "25px",
        color: "#AC64FF",
        marginBottom: "20px",
        marginLeft: "10px",
    },
    selectField: {
        width: "245px",
        height: "40px",
        padding: "10px",
        borderStyle: "none",
        borderRadius: "4px",
        border: "2px solid #AC64FF",
        marginLeft: "10px",
    },
    editButton: {
        height: "35px",
        width: "80px",
        color: "aliceblue",
        borderStyle: "none",
        borderRadius: "4px",
        backgroundColor: "#AC64FF",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "400",
        marginLeft: "20px",
    },
    deleteButton: {
        height: "35px",
        width: "80px",
        color: "aliceblue",
        borderStyle: "none",
        borderRadius: "4px",
        backgroundColor: "red",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "400",
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
        marginLeft: "10px"
    }
}

export default AttendanceScreen;