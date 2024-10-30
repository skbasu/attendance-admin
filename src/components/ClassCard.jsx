import React, { useState, useEffect } from 'react';
import './ClassCard.css';
import { convertToDate } from '../utils/formattedDate.js'
import { getInitialsAndTitle } from '../utils/formattedTeachersName.js';
import { Link } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ViewListIcon from '@mui/icons-material/ViewList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import instance from '../api.js';


const ClassCard = ({ classId, date, teacherName, gender, paperCode, paperName, classMode }) => {

    const [papers, setPapers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    

    useEffect(() => {
        const token = localStorage.getItem("admin-token");

        const getTeachers = async () => {
            instance.get("/teacher",{
                headers: {
                    "Content-Type": "application/json",
                    "admin-token": token,
                },
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
                },
            })
                .then((response) => {
                    setPapers(response.data);
                })
        }

        getTeachers();
        getPapers();
    }, [teachers, papers]);

    const deleteClass = async (classId) => {
        await instance.delete(`/class/${classId}`, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            },
        })
            .then((res) => {
                if (res.data.statusmsg === "ok") {
                    alert("Class deleted successfully");
                } else {
                    alert("Class could not be deleted")
                }
            })
    }

    return (
        <div className="card-container">
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h2 style={{ fontSize: "18px", color: "#AC64FF" }}>{convertToDate(date)}</h2>
                    <HighlightOffIcon onClick={() => { if (confirm(`Delete ${getInitialsAndTitle(teacherName, gender)}'s class on ${convertToDate(date)} ?`)) { deleteClass(classId) }; }} style={{ color: "red", cursor: "pointer" }} />
                </div>
                <h3 style={{ fontSize: "16px", color: "grey" }}>{getInitialsAndTitle(teacherName, gender)}</h3>
                <p style={{ fontSize: "16px", color: "black", fontWeight: "bolder" }}>{paperCode}</p>
                <p>{paperName}</p>
                <p style={{ fontSize: "13px", color: "grey" }}>{classMode}</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link to={`/classes/${classId}/attendance`}>
                        <AddBoxIcon style={{ color: "#AC64FF" }} />
                    </Link>
                    <br />
                    <Link to={`/classes/${classId}/view/attendance`}>
                        <ViewListIcon style={{ color: "#AC64FF" }} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

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

export default ClassCard;
