import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/leaderboard');
        const result = await response.json();

        // FIX: Access the "leaderboard" property of the result
        setData(result.leaderboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Name |</th>
            <th>Wins |</th>
            <th>Loses |</th>
            <th>Win rate |</th>

          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.wins}</td>
                <td>{player.losses}</td>
                <td>{player.win_rate}%</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;