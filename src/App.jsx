import Task from "./pages/Task";
import Admin from "./Admin/Admin";
import Home from "./pages/Home";
import Referral from "./pages/Referral";
import React, { useEffect, useState } from 'react';

import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//http://localhost:8080
function App() {
    const [userId, setUserId] = useState(null);
    axios.defaults.baseURL = 'https://bitclub-airdrop-sever.vercel.app';
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const initTelegramApp = () => {
            const tg = window.Telegram.WebApp;
            tg.ready();
            setUserId(tg.initDataUnsafe.user.id);
        };

        initTelegramApp();
    }, []);

    return (
        <Router>
            <Routes>
                <Route index="/" element={<Home />} />
                <Route path="/task" element={<Task />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/ref" element={<Referral />} />
            </Routes>
        </Router>
    );
}

export default App

