import React from 'react';
import { getInitialsAndTitle } from '../utils/formattedTeachersName.js'

const PaperCard = ({ papername, papercode, paperteacher, attended, total, gender}) => {

    const attendancePercentage = (attended / total) * 100
    const finalText = `${attendancePercentage.toFixed(1)}%`
 
    return (
        <div style={styles.paperCard}>
            <p style={styles.paperSub}>{papername}</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <p style={styles.paperCode}>{papercode}</p>
                <p style={styles.paperTeacher}>{getInitialsAndTitle(paperteacher, gender)}</p>
            </div>
            <p style={styles.perText}>{finalText}</p>
            <div style={styles.paperInfo}>
                <p>Total: <strong>{total}</strong></p>
                <p style={{ marginLeft: "10px" }}>Attended: <strong>{attended}</strong></p>
                <p style={{ marginLeft: "10px" }}>Missed: <strong>{total - attended}</strong></p>
            </div>
        </div>
    )
}

const styles = {
    paperCard: {
        width: "220px",
        boxShadow: '0 8px 16px rgba(22, 22, 22, 0.2)',
        transition: '0.3s',
        padding: "15px",
        alignItems: "center",
        height: "150px",
        display: "flex",
        flexDirection: "column", 
        justifyContent: "space-between"
    },
    paperSub: {
        fontSize: "14px",
    },
    paperCode: {
        fontWeight: "bold",
        color: "gray",
        fontSize: "13px",
    },
    paperTeacher: {
        fontWeight: "bolder",
        fontSize: "13px",
        marginLeft: "20px",
    },
    perText: {
        fontSize: "32px",
        fontWeight: "bolder",
        marginTop: "20px"
    },
    paperInfo: {
        display: "flex", 
        justifyContent: "space-between",
        fontSize: "13px",  
        marginTop: "auto",  
        marginLeft: "5px"   
    }
};

export default PaperCard;