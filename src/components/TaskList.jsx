import React from 'react';
import dayjs from 'dayjs';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiDeleteBin3Line, RiBallPenLine, RiAttachment2 } from 'react-icons/ri';
import { FcReading } from 'react-icons/fc';

import './TaskListStyles.css';

const TaskList = ({
  tasks,
  addTask,
  input,
  changeInput,
  toggleCompleted,
  /* handleChange,
  uploadFile, */
  deleteTask,
  cleanAllTasks,
}) => {
  const currentDate = dayjs().format('DD MMM YYYY');

  return (
    <div className='task-container'>
      <h1 className='task-head'>
        <FcReading />
        task list
      </h1>
      <div className='date-box'>
        <span className='current-date'>{currentDate}</span>
      </div>
      <form onSubmit={addTask}>
        <div className='task-input'>
          <input
            value={input}
            onChange={changeInput}
            className='input-inner'
            placeholder='add task'
            type='text'
          />
          <AiOutlinePlus onClick={addTask} className='task-add' />
        </div>
      </form>

      <ul>
        {tasks.map((task) => {
          return (
            <li className='task-item' key={task.id}>
              <div className='item-name'>
                <div className='task-right'>
                  <input
                    onChange={() => toggleCompleted(task)}
                    type='checkbox'
                    checked={task.completed ? 'checked' : ''}
                  />
                  <h4
                    onClick={() => toggleCompleted(task)}
                    className={task.completed ? 'task-completed' : 'task-title'}
                  >
                    {task.title}
                  </h4>
                </div>
                <div className='task-left'>
                  <RiAttachment2 className='task-options' />
                  <RiBallPenLine className='task-options' />
                  <RiDeleteBin3Line onClick={() => deleteTask(task.id)} className='task-options' />
                </div>
              </div>
              <div className='item-desc'>
                <p className='task-desc'>{task.description || 'no description yet'}</p>
              </div>
            </li>
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
