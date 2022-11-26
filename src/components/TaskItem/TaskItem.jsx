import React from 'react';
import dayjs from 'dayjs';
import { db, storage } from '../../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { RiDeleteBin3Line, RiBallPenLine, RiAttachment2, RiCloseLine } from 'react-icons/ri';

import { ref, uploadBytesResumable, uploadBytes, getDownloadURL } from 'firebase/storage';

import Modal from '../Modal/Modal';
import './TaskItemStyles.css';

const TaskItem = ({ key, task, toggleCompleted, deleteTask }) => {
  //State for editing a task (for a new value of a task)
  const [newValueTask, setNewValueTask] = React.useState({
    title: task.title,
    description: task.description,
    date: task.date,
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
      date: newValueTask.date,
    });
  };

  const handleChangeTask = (e) => {
    e.preventDefault();
    setNewValueTask({ ...newValueTask, [e.target.name]: e.target.value });
  };

  // edit date tasks
  const currentDate = dayjs().valueOf();
  const taskDate = Date.parse(task.date);

  // Uploading a file to fb storage and uploading progress
  const [selectedFile, setSelectedFile] = React.useState('');
  const [percent, setPercent] = React.useState(0);
  const filePicker = React.useRef(null);

  // TEST ?? /////// надо что-то сделать с инпутом мб
  const uploadFile = async () => {
    await updateDoc(doc(db, 'tasks', task.id), {
      file: selectedFile,
    });
    /* setPercent(0); */
  };
  // TEST ?? ////

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];

    if (!file) return null;
    const storageRef = ref(storage, `files/${file.name}`);

    uploadBytes(storageRef, file).then((snapshot) => {
      e.target[0].value = '';
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log(downloadURL);
        setSelectedFile(downloadURL);
      });
    });
    /* handleFile(); ?? */

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err)
    );
  };

  const handlePicker = () => {
    filePicker.current.click();
  };

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
            {/* File upload */}
            <form onSubmit={handleSubmit}>
              <input ref={filePicker} className='input-hidden' type='file' name='file' />
              <button type='submit' onClick={uploadFile}>
                upload
              </button>
              <p>{percent}</p>
              <a href={task.file} target='_blank'>
                {task.file ? 'attached file' : ''}
              </a>
            </form>
            <RiAttachment2 type='submit' onClick={handlePicker} className='task-options' />

            {/* Editing */}
            <RiBallPenLine onClick={() => handleModal()} className='task-options' />

            <Modal
              open={open}
              setOpen={setOpen}
              newValueTask={newValueTask}
              handleChangeTask={handleChangeTask}
              handleEditTask={handleEditTask}
            />

            {/* Deleting */}
            <RiDeleteBin3Line onClick={() => deleteTask(task.id)} className='task-options' />
          </div>
        </div>

        {/* General info */}
        <div className='item-desc'>
          <p className='task-desc'>{task.description || 'no description yet'}</p>
        </div>

        {/* Task date */}
        <div className='task-date'>
          {currentDate <= taskDate ? (
            <div className='date-completion'>
              final date:&nbsp; {dayjs(task.date).format('DD MMM YYYY')}
            </div>
          ) : (
            <div className='date-overdue'>time is over</div>
          )}
        </div>
      </li>
    </>
  );
};

export default TaskItem;
