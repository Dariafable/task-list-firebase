import React from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { RiDeleteBin3Line, RiBallPenLine, RiAttachment2 } from 'react-icons/ri';
import { TiDocumentDelete } from 'react-icons/ti';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { db, storage } from '../../firebase';
import Modal from '../Modal/Modal';
import TimeDuration from './components/TimeDuration/TimeDuration';
import './TaskItemStyles.scss';

const TaskItem = ({ task, toggleCompleted, deleteTask }) => {
  const [open, setOpen] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const [newValueTask, setNewValueTask] = React.useState({
    title: task.title,
    description: task.description,
    date: task.date,
  });

  const filePicker = React.useRef(null);

  const handleModal = () => {
    setOpen(true);
  };

  const handleEditTask = async () => {
    await updateDoc(doc(db, 'tasks', task.id), {
      title: newValueTask.title,
      description: newValueTask.description,
      date: newValueTask.date,
    });
  };

  const handleChangeTask = (e) => {
    setNewValueTask({ ...newValueTask, [e.target.name]: e.target.value });
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setPercent(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateDoc(doc(db, 'tasks', task.id), {
            file: downloadURL,
          });
        });
        setPercent(0);
      }
    );
  };

  const deleteFile = () => {
    updateDoc(doc(db, 'tasks', task.id), {
      file: '',
    });
  };

  const handlePicker = () => {
    filePicker.current.click();
  };

  return (
    <li className='task-item'>
      <div className='item-name'>
        <div className='task-left'>
          <input
            name='isCompleted'
            onChange={() => toggleCompleted(task)}
            type='checkbox'
            checked={task.completed}
          />
          <h4 className={task.completed ? 'task-completed' : 'task-title'}>{task.title}</h4>
        </div>
        <div className='task-right'>
          <input
            ref={filePicker}
            className='input-hidden'
            type='file'
            name='file'
            onChange={(e) => uploadFile(e)}
          />
          {percent ? (
            <div className='progress-container'>
              <progress className='task-progress' max='100' value={percent} />
            </div>
          ) : null}
          {task.file && (
            <span className='task-file'>
              <a className='file-link' href={task.file} target='_blank' rel='noreferrer'>
                file
              </a>
              <TiDocumentDelete className='file-remover' onClick={deleteFile} />
            </span>
          )}
          <RiAttachment2 className='task-options' type='submit' onClick={handlePicker} />
          <RiBallPenLine className='task-options' onClick={handleModal} />
          <RiDeleteBin3Line className='task-options' onClick={() => deleteTask(task.id)} />
          <Modal
            open={open}
            setOpen={setOpen}
            newValueTask={newValueTask}
            handleChangeTask={handleChangeTask}
            handleEditTask={handleEditTask}
          />
        </div>
      </div>
      <div className='item-desc'>
        <p className='task-desc'>{task.description || 'no description yet'}</p>
      </div>
      <TimeDuration date={task.date} />
    </li>
  );
};

export default TaskItem;
