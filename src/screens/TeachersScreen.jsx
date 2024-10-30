import React, { useState, useEffect } from 'react';
import "./Home.css";
import Sidebar from '../components/Sidebar';
import instance from '../api.js';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';

const TeacherScreen = () => {
    const navigateTo = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [updatedteacherName, setUpdatedteacherName] = useState("");
    const [updatedteacherGender, setUpdatedteacherGender] = useState("");

    const handleClickOpen = (teacher) => {
        setSelectedTeacher(teacher)
        setUpdatedteacherName(teacher.teacher_name);
        setUpdatedteacherGender(teacher.teacher_gender)
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
        getTeachers();
    }, [teachers])

    const updateteachers = async (tid) => {
        await instance.put(`/teacher/edit/${tid}`, {
            name: updatedteacherName,
            gender: updatedteacherGender
        }, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        }).then((res) => {
            if (res.data.statusmsg === "ok") {
                alert("Teacher updated successfully");
                handleClose();
                setUpdatedteacherName("");
                setUpdatedteacherGender("")
            } else {
                alert("Teacher could not be updated")
            }
        })
    }

    const deleteTeacher = async (tid) => {
        await instance.delete(`/teacher/${tid}`, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        })
            .then((res) => {
                if (res.data.statusmsg === "ok") {
                    alert("Teacher deleted successfully");
                } else {
                    alert("Teacher could not be deleted")
                }
            })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ width: "100%", margin: "20px" }}>
                <h3 style={styles.header}>Teachers</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Teacher Name</th>
                            <th>Teacher Gender</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            teachers.map((teacher) => (
                                <tr style={{ alignItems: "center" }}>
                                    <td>{teacher.teacher_name}</td>
                                    <td style={{ textAlign: "center" }}>{teacher.teacher_gender}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button style={styles.editButton} onClick={() => handleClickOpen(teacher)}>Edit</button>
                                        <button style={styles.deleteButton} onClick={() => { if (confirm(`Delete ${teacher.teacher_name} ?`)) { deleteTeacher(teacher.teacher_id) }; }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Dialog open={open} onClose={handleClose}>
                    {selectedTeacher && (
                        <div style={{ padding: "20px" }}>
                            <h3 style={styles.header}>
                                {`Edit ${selectedTeacher.teacher_name}`}
                            </h3>
                            <div>
                                <input
                                    style={styles.inputField}
                                    onChange={(e) => setUpdatedteacherName(e.target.value)}
                                    placeholder="Enter Teacher Name"
                                    value={updatedteacherName}
                                />
                                <br />
                                <br />
                                <select style={styles.selectField} value={updatedteacherGender} onChange={(e) => setUpdatedteacherGender(e.target.value)}>
                                    <option value="" disabled selected>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <br />
                                <br />
                                <button style={styles.submitButton} onClick={() => updateteachers(selectedTeacher.teacher_id)}>Submit</button>
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
        fontSize: "30px",
        color: "#AC64FF",
        marginBottom: "20px",
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
        marginLeft: "20px",
    }
}
export default TeacherScreen;