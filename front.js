const Students = document.querySelector('#students');
document.addEventListener('DOMContentLoaded', async () => {
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(tab => {
    tab.classList.remove('active')
  });
  if(window.location.pathname === '/') {
    const tab = document.querySelectorAll('.tab')[0];
    tab.classList.add('active');
  } else if(window.location.pathname === '/students.html') {
    const tab = document.querySelectorAll('.tab')[1];
    tab.classList.add('active');

    refreshStudents(Students)
  }
})

document.querySelector('#showStudentAdd')
  .addEventListener('click', () => {
    const menu = document.querySelector('#addStudentMenu');
    document.querySelector('#studentName').value = '';
    menu.classList.toggle('invisible')
  });

const refreshStudents = async (students) => {
  students.innerHTML = '';
  await fetch('/api/students')
      .then((response) => response.json())
      .then((response) => {
        response.forEach((student, index) => {
          const studentNode = document.createElement('li');
          studentNode.classList.add('student')
          
          const name = document.createElement('span');
          name.textContent = student;
          studentNode.appendChild(name);

          const deleteButton = document.createElement('button');
          deleteButton.classList.add('deletingButton');
          deleteButton.textContent = 'X';
          deleteButton.addEventListener('click', async () => {
            await fetch(`/api/students/delete/${index}`, {
              method: 'DELETE',
            });
            refreshStudents(students)
          })
          studentNode.appendChild(deleteButton);

          students.appendChild(studentNode);
        })
    }).catch(() => {
      const errorMessage = document.createElement('span');
      errorMessage.classList.add('errorMessage');
      errorMessage.textContent = 'Error has happened while fetching students';
      students.appendChild(errorMessage);
    })
}

document.querySelector('#addStudentButton')
  .addEventListener('click', async () => {
    const newName = document.querySelector('#studentName').value;
    await fetch(`/api/students/${encodeURI(newName)}`, {
      method: 'POST',
    })
    document.querySelector('#studentName').value = '';
    document.querySelector('#addStudentMenu').classList.toggle('invisible')
    refreshStudents(Students)
  });
