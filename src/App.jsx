import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ClassesScreen from "./screens/ClassesScreen";
import AddAttendanceScreen from "./screens/AddAttendanceScreen";
import AttendanceScreen from "./screens/AttendanceScreen";
import ViewAttendanceScreen from "./screens/ViewAttendanceScreen";
import StudentScreen from "./screens/StudentScreen";
import PaperScreen from "./screens/PaperScreen";
import TeacherScreen from "./screens/TeachersScreen";
import AddStudentScreen from "./screens/AddStudentScreen";
import AddTeacherScreen from "./screens/AddTeacherScreen";
import AddPaperScreen from "./screens/AddPaperScreen";
import SigninScreen from "./screens/SigninScreen";
import ClassesByDateScreen from "./screens/ClassesByDateScreen";
import LatestScreen from "./screens/LatestScreen";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/addteacher" element={<AddTeacherScreen />} />
          <Route path="/latest" element={<LatestScreen />} />
          <Route path="/addpaper" element={<AddPaperScreen />} />
          <Route path="/addstudent" element={<AddStudentScreen />} />
          <Route path="/classes" element={<ClassesScreen />} />
          <Route path="/classes/:classid/attendance" element={<AddAttendanceScreen />} />
          <Route path="/classes/:classid/view/attendance" element={<AttendanceScreen />} />
          <Route path="/classesbydate" element={<ClassesByDateScreen />} />
          <Route path="/attendance" element={<ViewAttendanceScreen />} />
          <Route path="/student" element={<StudentScreen />} />
          <Route path="/paper" element={<PaperScreen />} />
          <Route path="/teacher" element={<TeacherScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
