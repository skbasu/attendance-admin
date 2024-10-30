import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import instance from '../api';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';


const PaperScreen = () => {
    const navigateTo = useNavigate();
    const [papers, setPapers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [updatedpaperCode, setUpdatedpaperCode] = useState("");
    const [updatedpaperName, setUpdatedpaperName] = useState("");

    const handleClickOpen = (paper) => {
        setSelectedPaper(paper)
        setUpdatedpaperCode(paper.paper_code);
        setUpdatedpaperName(paper.paper_name)
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
    }, [papers]);

    const updatepapers = async (pid) => {
        await instance.put(`/paper/edit/${pid}`, {
            code: updatedpaperCode,
            name: updatedpaperName,
        }, {
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        }).then((res) => {
            if (res.data.statusmsg === "ok") {
                alert("Paper updated successfully");
                handleClose();
                setUpdatedpaperCode("");
                setUpdatedpaperName("");
            } else {
                alert("Paper could not be updated")
            }
        })
    }

    const deletePaper = async (pid) => {
        await instance.delete(`/paper/${pid}`,{
            headers: {
                "Content-Type": "application/json",
                "admin-token": localStorage.getItem("admin-token"),
            }
        })
            .then((res) => {
                if (res.data.statusmsg === "ok") {
                    alert("Paper deleted successfully");
                } else {
                    alert("Paper could not be deleted")
                }
            })
    }

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={{ width: "100%", margin: "10px" }}>
                <h3 style={styles.header}>Papers</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Paper Code</th>
                            <th>Paper Name</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            papers.map((paper) => (
                                <tr style={{ alignItems: "center" }}>
                                    <td>{paper.paper_code}</td>
                                    <td>{paper.paper_name}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <button onClick={() => handleClickOpen(paper)} style={styles.editButton}>Edit</button>
                                        <button style={styles.deleteButton} onClick={() => { if (confirm(`Delete ${paper.paper_name} ?`)) { deletePaper(paper.paper_id) }; }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Dialog open={open} onClose={handleClose}>
                    {selectedPaper && (
                        <div style={{ padding: "20px" }}>
                            <h3 style={styles.header}>
                                {`Edit ${selectedPaper.paper_name}`}
                            </h3>
                            <div>
                                <input
                                    style={styles.inputField}
                                    onChange={(e) => setUpdatedpaperCode(e.target.value)}
                                    placeholder="Enter Paper Code"
                                    value={updatedpaperCode}
                                />
                                <br />
                                <br />
                                <input
                                    style={styles.inputField}
                                    onChange={(e) => setUpdatedpaperName(e.target.value)}
                                    placeholder="Enter Paper Name"
                                    value={updatedpaperName}
                                />
                                <br />
                                <br />
                                <button style={styles.submitButton} onClick={() => updatepapers(selectedPaper.paper_id)}>Submit</button>
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
        fontSize: "20px",
        color: "#AC64FF",
        marginBottom: "20px",
    },
    inputField: {
        width: "220px",
        height: "20px",
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

export default PaperScreen;