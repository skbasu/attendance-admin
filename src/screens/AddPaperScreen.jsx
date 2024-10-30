import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import instance from '../api.js';
import { useNavigate } from 'react-router-dom';

const AddPaperScreen = () => {

    const [papercode, setpaperCode] = useState("");
    const [papername, setPaperName] = useState("");
    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            navigateTo('/signin', { replace: true });
            localStorage.removeItem("admin-token");
        }
    }, [])

    const addpapers = async () => {
        await instance.post('/paper/add', {
            code: papercode,
            name: papername,
        }, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            },
        }).then((res) => {
            if (res.data.statusmsg === "ok") {
                alert("Paper added successfully");
            } else {
                alert("Paper could not be added")
            }
        })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.formContainer}>
                <h3 style={styles.header}>Add New Paper</h3>
                <div style={styles.form}>
                    <input
                        style={styles.inputField}
                        onChange={(e) => setpaperCode(e.target.value)}
                        type='text'
                        placeholder='Enter Paper Code'
                        value={papercode}
                    />
                    <input
                        style={styles.inputField}
                        onChange={(e) => setPaperName(e.target.value)}
                        type='text'
                        placeholder='Enter Paper Name'
                        value={papername}
                    />
                    <br />
                    <button style={styles.submitButton} onClick={addpapers}>Submit</button>
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

export default AddPaperScreen;