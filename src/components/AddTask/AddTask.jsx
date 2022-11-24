import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import './AddTaskStyles.css';

const AddTask = ({ input, addTask, changeInput }) => {
  return (
    <>
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
    </>
  );
};

export default AddTask;
