import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'InProgress' | 'Completed';
  categoryId: string;
  userId: string;
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        const data = await response.json();
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete task');
        }

        navigate('/tasks');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container>
        <Typography sx={{ mt: 4 }}>
          Task not found
        </Typography>
      </Container>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'inprogress':
        return 'warning';
      case 'todo':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            {task.title}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              sx={{ mr: 1 }}
            />
            <Chip
              label={task.status}
              color={getStatusColor(task.status)}
            />
          </Box>
          <Typography variant="body1" paragraph>
            {task.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Due Date: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/tasks/${id}/edit`)}
            >
              Edit Task
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Delete Task
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TaskDetail; 