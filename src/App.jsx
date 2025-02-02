import Task from "./pages/Task";
import Admin from "./Admin/Admin";
import Home from "./pages/Home";
import Referral from "./pages/Referral";
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//http://localhost:8080 
function App() {
    axios.defaults.baseURL = 'https://bitclub-airdrop-sever.vercel.app';
    axios.defaults.withCredentials = true;
    const manifestUrl = '/tonconnect-manifest.json';
    return (
        <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Router>
            <Routes>
            <Route index="/" element={<Home />} />
                <Route path="/task" element={<Task />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/ref" element={<Referral />} />
            </Routes>
        </Router>
        </TonConnectUIProvider>
    );
}

export default App

