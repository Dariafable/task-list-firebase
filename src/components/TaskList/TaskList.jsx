import React from 'react';
import dayjs from 'dayjs';
import { FcReading } from 'react-icons/fc';
import { db } from '../../firebase';
import {
  query,
  collection,
  orderBy,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

import TaskItem from '../TaskItem/TaskItem';
import AddTask from '../AddTask/AddTask';

import './TaskListStyles.scss';

const TaskList = () => {
  const currentDate = dayjs().format('DD MMM YYYY');

  // States for tasks, dates and input value
  const [tasks, setTasks] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [date, setDate] = React.useState('');

  // Read tasks from fb
  React.useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('timestamp', 'desc'));
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
    e.preventDefault();
    if (!input || !date) {
      alert('Please enter a valid task');
      return;
    }
    await addDoc(collection(db, 'tasks'), {
      title: input,
      completed: false,
      description: '',
      file: '',
      date: date,
      timestamp: serverTimestamp(),
    });
    setInput('');
    setDate('');
  };

  const changeInput = ({ target }) => {
    const inputValue = target.value;
    setInput(inputValue);
  };

  const toggleCompleted = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), {
      completed: !task.completed,
    });
  };

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

      <AddTask
        input={input}
        changeInput={changeInput}
        addTask={addTask}
        date={date}
        setDate={setDate}
      />

      <ul className='all-tasks'>
        {tasks.map((task) => {
          return (
            <React.Fragment key={task.id}>
              <TaskItem task={task} toggleCompleted={toggleCompleted} deleteTask={deleteTask} />
            </React.Fragment>
          );
        })}
      </ul>

      <div className='task-bottom'>
        <span className='task-length'>
          {!tasks.length ? 'you have no tasks' : `tasks: ${tasks.length}`}
        </span>

        <span className='task-clean' onClick={cleanAllTasks}>
          clean all
        </span>
      </div>
    </div>
  );
};

export default TaskList;
