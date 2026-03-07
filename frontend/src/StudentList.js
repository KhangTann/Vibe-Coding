import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "./api";
import { useNavigate } from "react-router-dom";

function StudentList() {

  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const loadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id) => {
    await deleteStudent(id);
    loadStudents();
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Student List</h2>

      <button onClick={() => navigate("/add")}>
        Add Student
      </button>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Major</th>
            <th>GPA</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
              <td>{s.major}</td>
              <td>{s.gpa}</td>
              <td>
                <button onClick={() => navigate(`/edit/${s.student_id}`)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(s.student_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default StudentList;