import Task from "./pages/Task";
import Admin from "./Admin/Admin";
import Home from "./pages/Home";

import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.withCredentials = true;
    return (
        <Router>
            <Routes>
            <Route index="/" element={<Home />} />
                <Route path="/task" element={<Task />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
}

export default App

