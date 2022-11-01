import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
  const [tasks, setTasks] = useState([]);

  const [isVisibleForm, setFormVisibility] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      let tasks = await fetchTasks();
      setTasks(tasks);
    };
    getTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    return await res.json();
  };

  const addTask = async (task) => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    let newTask = await res.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    fetch("http://localhost:5000/tasks/" + id, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id != id));
  };

  const toggleReminder = (id) => {
    let task = tasks.find((t) => t.id == id);
    fetch("http://localhost:5000/tasks/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, reminder: !task.reminder }),
    });

    setTasks(
      tasks.map((t) => (t.id == id ? { ...t, reminder: !t.reminder } : t))
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setFormVisibility(!isVisibleForm)}
          isVisibleForm={isVisibleForm}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {isVisibleForm && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  "No Tasks"
                )}
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
