// base URL for backend; change in one place if port/host differs
export const API_URL = "http://localhost:8000";

export async function getStudents(search = "") {
    const url = search
        ? `${API_URL}/students?name=${encodeURIComponent(search)}`
        : `${API_URL}/students`;
    const res = await fetch(url);
    return res.json();
}

export async function getStats() {
    const res = await fetch(`${API_URL}/students/stats`);
    return res.json();
}

export async function addStudent(student) {
    return fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });
}

export async function updateStudent(id, student) {
    return fetch(`${API_URL}/students/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });
}

export async function deleteStudent(id) {
    return fetch(`${API_URL}/students/${id}`, {
        method: "DELETE"
    });
}