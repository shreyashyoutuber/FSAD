import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser } from '../api';

const DatabaseTest = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setMessage("Error fetching users: " + err.message);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await createUser({ name, email });
            setMessage("User added successfully!");
            setName('');
            setEmail('');
            loadUsers();
        } catch (err) {
            setMessage("Error adding user: " + err.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>MySQL Database Connection Test</h1>

            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>Add New User</h3>
                <form onSubmit={handleAddUser}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>Add User</button>
                </form>
                {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
            </div>

            <h3>Existing Users in MySQL:</h3>
            {users.length === 0 ? (
                <p>No users found in database.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f4f4f4' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '20px' }}>
                <a href="/">Back to Home</a>
            </div>
        </div>
    );
};

export default DatabaseTest;
