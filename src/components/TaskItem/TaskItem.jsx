import React from 'react';
import { db } from '../../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { RiDeleteBin3Line, RiBallPenLine, RiAttachment2 } from 'react-icons/ri';

import Modal from '../Modal/Modal';
import './TaskItemStyles.css';

const TaskItem = ({ key, task, toggleCompleted, deleteTask }) => {
  //State for editing a task (for a new value of a task)
  const [newValueTask, setNewValueTask] = React.useState({
    title: task.title,
    description: task.description,
  });

  //State for modal window
  const [open, setOpen] = React.useState(false);

  const handleModal = () => {
    setOpen(true);
  };

  const handleEditTask = async () => {
    await updateDoc(doc(db, 'tasks', task.id), {
      title: newValueTask.title,
      description: newValueTask.description,
    });
  };

  const handleChangeTask = (e) => {
    e.preventDefault();
    setNewValueTask({ ...newValueTask, [e.target.name]: e.target.value });
  };
  console.log(newValueTask);

  return (
    <>
      <li className='task-item' key={key}>
        <div className='item-name'>
          <div className='task-left'>
            <input
              onChange={() => toggleCompleted(task)}
              type='checkbox'
              checked={task.completed ? 'checked' : ''}
            />
            <h4 className={task.completed ? 'task-completed' : 'task-title'}>{task.title}</h4>
          </div>
          <div className='task-right'>
            <RiAttachment2 className='task-options' />
            <RiBallPenLine onClick={() => handleModal()} className='task-options' />

            <Modal
              open={open}
              setOpen={setOpen}
              newValueTask={newValueTask}
              handleChangeTask={handleChangeTask}
              handleEditTask={handleEditTask}
            />

            <RiDeleteBin3Line onClick={() => deleteTask(task.id)} className='task-options' />
          </div>
        </div>
        <div className='item-desc'>
          <p className='task-desc'>{task.description || 'no description yet'}</p>
        </div>
      </li>
    </>
  );
};

export default TaskItem;
