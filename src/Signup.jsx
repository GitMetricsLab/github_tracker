import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', { username, password }, { withCredentials: true });
      alert(res.data.msg);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
