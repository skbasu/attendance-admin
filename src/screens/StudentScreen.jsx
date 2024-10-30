import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import './Home.css';
import instance from '../api';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';

const StudentScreen = () => {
  const navigateTo = useNavigate();
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updatedstudentName, setUpdatedstudentName] = useState("");
  const [updatedstudentEmail, setUpdatedstudentEmail] = useState("");
  const [updatedstudentSem, setUpdatedstudentSem] = useState("");

  const handleClickOpen = (student) => {
    setSelectedStudent(student)
    setUpdatedstudentName(student.student_name);
    setUpdatedstudentEmail(student.student_email)
    setUpdatedstudentSem(student.student_semester)
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
  }, [students])

  const updateStudents = async (sid) => {
    await instance.put(`student/edit/${sid}`, {
      email: updatedstudentEmail,
      name: updatedstudentName,
      semester: updatedstudentSem
    }, {
      headers: {
        "Content-Type": "application/json",
        "admin-token": localStorage.getItem("admin-token"),
      }
    }).then((res) => {
      if (res.data.statusmsg === "ok") {
        alert("Student updated successfully");
        handleClose();
        setUpdatedstudentEmail("");
        setUpdatedstudentName("");
        setUpdatedstudentSem("");
      } else {
        alert("Student could not be updated")
      }
    })
  }

  const deleteStudent = async (sid) => {
    await instance.delete(`/student/${sid}`, {
      headers: {
        "Content-Type": "application/json",
        "admin-token": localStorage.getItem("admin-token"),
      }
    })
    .then((res) => {
      if (res.data.statusmsg === "ok") {
        alert("Student deleted successfully");
      } else {
        alert("Student could not be deleted")
      }
    })
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={{ width: "100%", margin: "10px"}}>
        <h3 style={styles.header}>Students</h3>
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Sem</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {
              students.map((student) => (
                <tr>
                  <td style={{ textAlign: "center" }}>{student.student_id}</td>
                  <td>{student.student_name}</td>
                  <td>{student.student_email}</td>
                  <td style={{ textAlign: "center" }}>{student.student_semester}</td>
                  <td style={{ textAlign: "center" }}>
                    <button style={styles.editButton} onClick={() => handleClickOpen(student)}>Edit</button>
                    <button style={styles.deleteButton} onClick={() => { if (confirm(`Delete ${student.student_name} ?`)) { deleteStudent(student.student_id) }; }}>Delete</button>
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
                {`Edit ${selectedStudent.student_name}`}
              </h3>
              <div>
                <input
                  style={styles.inputField}
                  onChange={(e) => setUpdatedstudentName(e.target.value)}
                  placeholder="Enter Student Name"
                  value={updatedstudentName}
                />
                <br />
                <br />
                <input
                  style={styles.inputField}
                  onChange={(e) => setUpdatedstudentEmail(e.target.value)}
                  placeholder="Enter Student Email"
                  value={updatedstudentEmail}
                />
                <br />
                <br />
                <input
                  style={styles.inputField}
                  onChange={(e) => setUpdatedstudentSem(e.target.value)}
                  placeholder="Enter Student Semester"
                  value={updatedstudentSem}
                />
                <br />
                <br />
                <button style={styles.submitButton} onClick={() => updateStudents(selectedStudent.student_id)}>Submit</button>
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
export default StudentScreen;