import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import './AddTaskStyles.scss';

const AddTask = ({ input, addTask, changeInput, date, setDate }) => {
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
          <input
            type='date'
            className='input-date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <AiOutlinePlus onClick={addTask} className='task-add' />
        </div>
      </form>
    </>
  );
};

export default AddTask;
