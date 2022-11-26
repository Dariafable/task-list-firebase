import { RiCloseLine } from 'react-icons/ri';
import './ModalStyles.css';

const Modal = ({ open, setOpen, newValueTask, handleChangeTask, handleEditTask }) => {
  const clickSave = () => {
    handleEditTask();
    setOpen(false);
  };

  return (
    <div className={`overlay animated ${open ? 'show' : ''}`}>
      <div className='modal'>
        <RiCloseLine onClick={() => setOpen(false)} className='icon-modal' />

        <div className='title-wrapper'>
          <p className='title-task'>task</p>
          <input
            className='title-input'
            name='title'
            type='text'
            value={newValueTask.title}
            onChange={handleChangeTask}
          />
        </div>

        <div className='desc-wrapper'>
          <p className='desc-title'>description</p>
          <textarea
            className='desc-textarea'
            name='description'
            type='text'
            value={newValueTask.description}
            onChange={handleChangeTask}
          />
        </div>

        <div className='title-date'>final date</div>
        <input
          type='date'
          name='date'
          className='date-input'
          value={newValueTask.date}
          onChange={handleChangeTask}
        />

        <span onClick={clickSave} className='save-change'>
          save
        </span>
      </div>
    </div>
  );
};

export default Modal;
