import { useState } from 'react'
import {Routes, Navigate, Route} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobForm from './pages/JobForm.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard/></ProtectedRoute>
            }/>
            <Route path="/jobs/new" element={
                <ProtectedRoute><JobForm/></ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/login"/>}/>
            
            {/*<div className="bg-red-400 text-white p-4">Tailwind Works</div>*/}
        </Routes>
    )
}

export default App
