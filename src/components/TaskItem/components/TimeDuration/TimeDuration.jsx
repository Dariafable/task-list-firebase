import dayjs from 'dayjs';

import './TimeDuration.scss';

const TimeDuration = ({ date }) => {
  const currentDate = dayjs().valueOf();
  const taskDate = Date.parse(date);
  return (
    <div className='task-date'>
      {dayjs(currentDate).diff(taskDate, 'day') <= 0 ? (
        <div className='date-completion'>
          final date:&nbsp; <span className='date-value'>{dayjs(date).format('DD MMM YYYY')}</span>
        </div>
      ) : (
        <div className='date-overdue'>time is over</div>
      )}
    </div>
  );
};

export default TimeDuration;
