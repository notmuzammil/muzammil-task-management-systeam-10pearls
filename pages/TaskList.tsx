import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { RootState } from '../store';
import { setTasks, setLoading, setError } from '../store/slices/taskSlice';

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        dispatch(setTasks(data));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch tasks'));
      }
    };

    fetchTasks();
  }, [dispatch]);

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

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Tasks
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/tasks/new')}
        >
          Create New Task
        </Button>
      </Box>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} lg={4} key={task.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {task.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TaskList; 