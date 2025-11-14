import React, { useState } from 'react';


function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTodos([...todos, input.trim()]);
    setInput('');
  };

  const removeTodo = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
  };

  return (
    <div className="todo-app" style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Todo App</h2>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a todo..."
          style={{ flex: 1, padding: 6 }}
        />
        <button type="submit" style={{ padding: '6px 12px' }}>Add</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
        {todos.length === 0 && <li style={{ color: '#888' }}>No todos yet.</li>}
        {todos.map((todo, idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span>{todo}</span>
            <button onClick={() => removeTodo(idx)} style={{ background: '#f44', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
