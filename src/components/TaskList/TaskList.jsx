import React from 'react';
import dayjs from 'dayjs';
import { FcReading } from 'react-icons/fc';
import { db } from '../../firebase';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

import TaskItem from '../TaskItem/TaskItem';
import AddTask from '../AddTask/AddTask';

import './TaskListStyles.css';

const TaskList = () => {
  const currentDate = dayjs().format('DD MMM YYYY');

  // States for tasks and input value
  const [tasks, setTasks] = React.useState([]);
  const [input, setInput] = React.useState('');

  // Read tasks from fb
  React.useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ ...doc.data(), id: doc.id });
      });
      setTasks(tasksArr);
    });
    return () => unsubscribe();
  }, []);

  // Add task
  const addTask = async (e) => {
    e.preventDefault(e);
    if (input === '') {
      alert('Please enter a valid todo');
      return;
    }
    await addDoc(collection(db, 'tasks'), {
      title: input,
      completed: false,
      description: '',
      file: false,
      date: currentDate, //it will be added dayjs after a while
    });
    setInput('');
  };

  // Change input
  const changeInput = ({ target }) => {
    setInput(target.value);
  };

  // Completed task/update in fb
  const toggleCompleted = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), {
      completed: !task.completed,
    });
  };

  // Delete selected task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  // Clean all tasks just on the client-side
  const cleanAllTasks = () => {
    setTasks([]);
  };

  return (
    <div className='task-container'>
      <h1 className='task-head'>
        <FcReading />
        task list
      </h1>
      <div className='date-box'>
        <span className='current-date'>{currentDate}</span>
      </div>

      <AddTask input={input} changeInput={changeInput} addTask={addTask} />

      <ul className='all-tasks'>
        {tasks.map((task) => {
          return (
            <TaskItem
              /*  key={task.id} */
              task={task}
              toggleCompleted={toggleCompleted}
              deleteTask={deleteTask}
            />
          );
        })}
      </ul>

      <div className='task-bottom'>
        <span className='task-length'>
          {tasks.length < 1 ? 'you have no tasks' : `tasks: ${tasks.length}`}
        </span>

        <span className='task-clean' onClick={cleanAllTasks}>
          clean all
        </span>
      </div>
    </div>
  );
};

export default TaskList;
