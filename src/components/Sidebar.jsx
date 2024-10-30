import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Sidebar.css';
import Dialog from '@mui/material/Dialog';
import instance from "../api";

function Sidebar() {

    const navigateTo = useNavigate();

    const userId = localStorage.getItem("adminId")

    const [open, setOpen] = useState(false);
    const [mailopen, setMailOpen] = useState(false);
    const [adminProfile, setAdminProfile] = useState([]);
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        const getAdminProfile = async () => {
            await instance.get(`/admin/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                },
            })
                .then((res) => {
                    setAdminProfile(res.data[0])
                })
        }

        getAdminProfile();
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem("admin-token");
        localStorage.removeItem("adminId");
        navigateTo('/signin');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleMailClickOpen = () => {
        setMailOpen(true);
    };

    const handleMailClose = () => {
        setSubject("")
        setContent("")
        setMailOpen(false);
    };

    const sentAttendanceEmail = async () => {
        await instance.get("/admin/email/send-attendance-emails", {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            },
        })
            .then((res) => {
                if (res.data.statusmsg === "ok") {
                    setOpen(false);
                    alert("Attendance email sent");
                }
            })
            .catch((err) => {
                if (err.response.data.statusmsg === "noclasses") {
                    alert(err.response.data.msg)
                }
            })
    }

    const sentEmail = async () => {
        if (!subject) {
            alert("Subject could be blank")
        } else if (!content) {
            alert("Content could be blank")
        } else {
            await instance.post('/admin/email/send-custom-emails', {
                subject: subject,
                content: content,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": localStorage.getItem("admin-token"),
                },
            }).then((res) => {
                if (res.data.statusmsg === "ok") {
                    setSubject("")
                    setContent("")
                    alert("Email sent successfully");
                    setMailOpen(false);
                }
            })
                .catch((err) => {
                    alert(err.message);
                })
        }
    }

    return (
        <div className="sidebar">
            <Link to="/">Home</Link>
            <Link to="/addstudent">Add Student</Link>
            <Link to="/addteacher">Add Teacher</Link>
            <Link to="/addpaper">Add Paper</Link>
            <Link to="/classes">Classes</Link>
            <Link to="/classesbydate">Classes By Date</Link>
            <Link to="/latest">Latest Classes</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/student">Students</Link>
            <Link to="/paper">Papers</Link>
            <Link to="/teacher">Teachers</Link>
            <Link onClick={handleMailClickOpen}>Send Email</Link>
	    <Link onClick={handleClickOpen}>Profile</Link>
            <Dialog open={open} onClose={handleClose}>
                <div style={{ padding: "20px" }}>
                    <h3 style={styles.header}>
                        Admin Profile
                    </h3>
                    <div>
                        <h3 style={{ fontSize: "20px" }}>{adminProfile.admin_name}</h3>
                        <h3 style={{ fontSize: "16px", color: "gray" }}>{adminProfile.admin_email}</h3>
                        <br />
                        <button style={styles.submitButton} onClick={sentAttendanceEmail}>Send Attendance Mail</button><br /><br />
                        <button style={styles.submitButton} onClick={handleSignOut}>Sign out</button>
                    </div>
                </div>
            </Dialog>
            <Dialog open={mailopen} onClose={handleMailClose}>
                <div style={{ padding: "20px" }}>
                    <h3 style={styles.header}>
                        Sent Email
                    </h3>
                    <div>
                        <textarea
                            style={styles.inputField}
                            type="text"
                            placeholder="Enter subject"
                            value={subject}
                            cols="20" rows="5"
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <br />
                        <br />
                        <textarea
                            style={styles.inputField}
                            type="text"
                            placeholder="Enter content"
                            value={content}
                            cols="20" rows="5"
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <br /><br />
                        <button style={styles.submitButton} onClick={sentEmail}>Sent Email</button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

const styles = {
    header: {
        fontSize: "20px",
        color: "#AC64FF",
        marginBottom: "20px",
        textAlign: "center"
    },
    submitButton: {
        height: "35px",
        width: "100%",
        color: "aliceblue",
        borderStyle: "none",
        borderRadius: "4px",
        backgroundColor: "#AC64FF",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "400"
    },
    inputField: {
        width: "220px",
        height: "20px",
        padding: "10px",
        borderStyle: "none",
        borderRadius: "4px",
        border: "2px solid #AC64FF"
    },
}

export default Sidebar;
