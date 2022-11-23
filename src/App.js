import React from 'react';
import TaskList from './components/TaskList';

import { db, storage } from './firebase';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function App() {
  const [tasks, setTasks] = React.useState([]);
  const [input, setInput] = React.useState('');

  //Test/////////////////////////////////////////////////////////////////////

  // State to store uploaded file
  const [file, setFile] = React.useState('');

  // progress
  const [percent, setPercent] = React.useState(0);

  // Handle file upload event and update state - not used yet
  /*   const handleChange = ({ target }) => {
    setFile(target.files[0]);
  }; */

  const uploadFile = (e) => {
    e.preventDefault();

    const file = e.target[0]?.files[0];

    if (!file) return;
    const storageRef = ref(storage, `/files/${file.name}`);

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
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  };
  //Test/////////////////////////////////////////////////////////////////

  // Read todo from firebase
  React.useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ ...doc.data(), id: doc.id });
      });
      setTasks(tasksArr);
    });
    return () => unsubscribe();
  }, [file]);

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
    });
    setInput('');
  };

  //Change input
  const changeInput = ({ target }) => {
    setInput(target.value);
  };

  //Update in firebase
  const toggleCompleted = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), {
      completed: !task.completed,
    });
  };

  //Delete selected task
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  //Clean all tasks
  const cleanAllTasks = () => {
    setTasks([]);
  };

  return (
    <div>
      {/* Test  */}
      <form onSubmit={uploadFile}>
        <input type='file' /* onChange={handleChange}  */ />
        <button type='submit' /* onClick={handleChange} */>Upload</button>
        <p>{percent}</p>
      </form>
      {/* Test */}

      <TaskList
        tasks={tasks}
        addTask={addTask}
        input={input}
        changeInput={changeInput}
        toggleCompleted={toggleCompleted}
        /*   handleChange={handleChange}
        uploadFile={uploadFile} */
        deleteTask={deleteTask}
        cleanAllTasks={cleanAllTasks}
      />
    </div>
  );
}

export default App;
