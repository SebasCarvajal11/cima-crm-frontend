// src/components/TaskList/TaskList.jsx
import React, { useState } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="bg-gray-50 p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Mis Tareas</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Agregar nueva tarea"
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <button 
          onClick={handleAddTask}
          className="ml-3 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Agregar
        </button>
      </div>
      <ul className="list-none p-0">
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center bg-white p-3 mb-3 rounded shadow-sm">
            <span>{task}</span>
            <button 
              onClick={() => handleDeleteTask(index)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 hover:shadow-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
