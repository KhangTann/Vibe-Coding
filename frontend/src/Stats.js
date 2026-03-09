import { useEffect, useState } from "react";
import { getStats } from "./api";

function Stats() {
  const [stats, setStats] = useState({});

  const loadStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Statistics</h2>
      <p>Total Students: {stats.total_students}</p>
      <p>Average GPA: {stats.average_gpa}</p>
      <h3>Students by Major:</h3>
      <ul>
        {Object.entries(stats.students_by_major || {}).map(([major, count]) => (
          <li key={major}>{major}: {count}</li>
        ))}
      </ul>
    </div>
  );
}

export default Stats;