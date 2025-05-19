import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import NewTask from './pages/NewTask';
import Profile from './pages/Profile';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/tasks" replace />} />
              <Route path="tasks" element={
                <PrivateRoute>
                  <TaskList />
                </PrivateRoute>
              } />
              <Route path="tasks/:id" element={
                <PrivateRoute>
                  <TaskDetail />
                </PrivateRoute>
              } />
              <Route path="tasks/new" element={
                <PrivateRoute>
                  <NewTask />
                </PrivateRoute>
              } />
              <Route path="profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App; 