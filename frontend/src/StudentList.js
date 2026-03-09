import { useEffect, useState } from "react";
import { deleteStudent, getStudents, API_URL } from "./api";
import { useNavigate } from "react-router-dom";

function StudentList() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadStudents = async () => {
    const data = await getStudents(search);
    setStudents(data);
  };

  useEffect(() => {
    loadStudents();
  }, [search]);

  const handleDelete = async (id) => {
    await deleteStudent(id);
    loadStudents();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>Student List</h2>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={handleSearchChange}
      />

      <button onClick={() => navigate("/add")}>
        Add Student
      </button>

      <button onClick={() => navigate("/stats")}>
        View Statistics
      </button>

      <button onClick={() => window.open(`${API_URL}/students/export`, "_blank")}>
        Export to CSV
      </button>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Birth Year</th>
            <th>Major</th>
            <th>GPA</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
              <td>{s.birth_year}</td>
              <td>{s.major}</td>
              <td>{s.gpa}</td>
              <td>{s.class_ ? s.class_.class_name : "N/A"}</td>
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