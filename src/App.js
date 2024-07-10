import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [reminderInput, setReminderInput] = useState('');
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility

  useEffect(() => {
    // Request notification permission when the component mounts
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          console.log('Notification permission denied');
        }
      });
    }
  }, []);

  useEffect(() => {
    // Set up notifications for tasks with reminders
    tasks.forEach((task) => {
      if (task.reminder) {
        const reminderTime = new Date(task.date);
        reminderTime.setHours(reminderTime.getHours() - parseInt(task.reminder));

        const now = new Date();
        const timeout = reminderTime.getTime() - now.getTime();

        if (timeout > 0) {
          setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification('Reminder', {
                body: `Reminder for task: ${task.text}`,
              });
            }
          }, timeout);
        }
      }
    });
  }, [tasks]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleAddTask = () => {
    if (taskInput) {
      setTasks([...tasks, { text: taskInput, date: date, reminder: reminderInput }]);
      setTaskInput('');
      setReminderInput('');
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleTickTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  return (
    <div className="App">
      <h1>To-Do List App</h1>
      <button onClick={() => setShowCalendar(!showCalendar)}>
        {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
      </button>
      {showCalendar && (
        <Calendar
          onChange={handleDateChange}
          value={date}
        />
      )}
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Add new task"
      />
      <input
        type="number"
        value={reminderInput}
        onChange={(e) => setReminderInput(e.target.value)}
        placeholder="Reminder in hours"
        min="0"
      />
      <button onClick={handleAddTask}>Add Task</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.text} (Due: {task.date.toDateString()})
            <button onClick={() => handleTickTask(index)}>✔️</button>
            <button onClick={() => handleDeleteTask(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
