import React from 'react';
import TaskList from './components/TaskList/TaskList';

import { storage } from './firebase';
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL } from 'firebase/storage';

function App() {
  //Test////////////////////////////////////////////////////////////////////////////////////////////////////
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

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

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
  //Test/////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      {/* Test  */}
      <form onSubmit={uploadFile}>
        <input type='file' /* onChange={handleChange}  */ />
        <button type='submit' /* onClick={handleChange} */>Upload</button>
        <p>{percent}</p>
      </form>
      {/* Test */}

      <TaskList />
    </div>
  );
}

export default App;
