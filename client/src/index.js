import React, { lazy, Suspense } from "react";
import ReactDOM from 'react-dom/client';
import './assests/scss/style.scss'
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

const Login = lazy(() => import('./components/Login'))
const Signup = lazy(() => import('./components/SignUp'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={"Loadinng"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);

