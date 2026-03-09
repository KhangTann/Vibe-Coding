import { useState, useEffect } from "react";
import { updateStudent } from "./api";
import { useNavigate, useParams } from "react-router-dom";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    birth_year: "",
    major: "",
    gpa: "",
    class_id: ""
  });

  const [classes, setClasses] = useState([]);

  const loadClasses = async () => {
    const res = await fetch("http://localhost:8000/classes");
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateStudent(id, {
      ...form,
      birth_year: Number(form.birth_year),
      gpa: Number(form.gpa)
    });

    navigate("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Student</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} /><br />
        <input name="birth_year" placeholder="Birth Year" onChange={handleChange} /><br />
        <input name="major" placeholder="Major" onChange={handleChange} /><br />
        <input name="gpa" placeholder="GPA" onChange={handleChange} /><br />
        <select name="class_id" onChange={handleChange}>
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.class_id} value={c.class_id}>{c.class_name}</option>
          ))}
        </select><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditStudent;