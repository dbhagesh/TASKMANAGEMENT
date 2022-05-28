import React, { lazy, Suspense } from "react";
import ReactDOM from 'react-dom/client';
import './assests/scss/style.scss'
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Result, Spin, Button } from 'antd';
import { useNavigate, Navigate } from "react-router-dom";

const Login = lazy(() => import('./components/Login'))
const Signup = lazy(() => import('./components/SignUp'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={
      <div className="fallback-spinner">
        <Spin />
      </div>
    }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="*"
            element={
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);

