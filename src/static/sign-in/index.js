
function createAccount() {

  let inUsername = document.getElementById('username3').value
  let inFName = document.getElementById('fname3').value
  let inLName = document.getElementById('lname3').value
  let inPassword = document.getElementById('password3').value
  let inEmail = document.getElementById('email3').value

  let inSelect = document.getElementById('gridRadios1').checked ? 'employee' : 'admin'

  inData = `{
    "username": "${inUsername}",
    "password": "${inPassword}",
    "firstName": "${inFName}",
    "lastName": "${inLName}",
    "email": "${inEmail}",
    "role": "${inSelect}"
  }`

  fetch('http://localhost:3000/users/', {
    body: inData,
    headers: {
      'content-type': 'application/json'
    },
    method: 'PUT' // Should probably change this to post
  })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401) {
        throw 'Invalid Credentials';
      }
      if (resp.status === 200) {
        return resp.json();
      }
      throw 'Unable to login at this time, please try again later';
    })
    .then(data => {
      console.log('success')
      // window.location = '../Test/pages/button.html';
    })
    .catch(err => {
      document.getElementById('error-message').innerText = err;
    })


}


function login() {
  const username = document.getElementById('inputUsername').value;
  const password = document.getElementById('inputPassword').value;

  const credential = { username, password }; // this will create an object like {username: 'blake', password: 'pass'} based on the values in those variables

  fetch('http://localhost:3000/auth/login', {
    body: JSON.stringify(credential),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    method: 'POST'
  })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401) {
        throw 'Invalid Credentials';
      }
      if (resp.status === 200) {
        return resp.json();
      }
      throw 'Unable to login at this time, please try again later';
    })
    .then(data => {
      // Any Data you want to save goes here!
      localStorage.setItem('fname', data.fName)

      alert(data.role)
      if (data.role == 'admin') {
        window.location = '../Test/pages/tables.html';
      } else{
        window.location = '../Test/pages/buttons.html'
      }

    })
    .catch(err => {
      document.getElementById('error-message').innerText = err;
    })

}
