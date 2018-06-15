function logout() {

  fetch('http://localhost:3000/auth/logout', {
    credentials: 'include',
    method: 'delete'
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
      localStorage.setItem('fname', '')
      localStorage.setItem("userData", '[')
      window.location = '../../login/index.html'

    })
    .catch(err => {
      localStorage.setItem('fname', '')
      localStorage.setItem("userData", '[')
      window.location = '../../login/index.html'
      //document.getElementById('error-message').innerText = err;
    })
}

function startTime() {
  var today = new Date();
  var month = today.getMonth();
  var day = today.getDay();
  var year = today.getFullYear();

  var h = today.getHours();
  var h12 = ((h + 11) % 12) + 1;
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('timeDisp').innerHTML =
    "It is currently " + month + "/" + day + "/" + year + " - " + h12 + ":" + m + checkAmPM(h)//+ ":" + s;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
  return i;
}

function checkAmPM(h) {
  if (h > 12) {
    return ' PM'
  } else {
    return ' AM'
  }
}

function clearAll() {
  document.getElementById('userx-table-body').innerHTML = ''
  localStorage.setItem("userData", '[')
}

function getReUserStatus() {
  // const body = document.getElementById('item-table-body');
  console.log('here')
  let status = 'pending'

  fetch('http://localhost:3000/reimbursement/' + status, { credentials: 'same-origin' })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401 || resp.status === 403) {
        return;
      }
      return resp.json();
    })
    .then((user) => {

      // TESTING
      console.log('fetch called, contents are ' + user[0])
      console.log(user[0])

      // clear table
      const body = document.getElementById('userx-table-body');
      body.innerHTML = '';
      localStorage.setItem("userData", '[')

      // populate the table for each movie

      let i = 0;
      while (i < user.length) {

        document.getElementById('userx-table-body').innerHTML += `
 
      <tr bgcolor="#80dfff">
      <th id="reTable" value ="2" colspan="50" scope="row">Submitted: [${user[i].status}] ${(new Date(user[i].timestamp)).toLocaleString("en-US")}</th>
      <tr>
      <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Amount</th>
            <th scope="col">Description</th>
            <th scope="col">Time of Expense</th>
          </tr>`;

        (user[i].items).forEach(addItem);
        i++
      }


    })
    .catch(err => {
      console.log(err);
      const body = document.getElementById('userx-table-body');
      body.innerText = 'Unable to retreive data';
    });

}

function getReByStatus() {

  //Get user option
  let select1 = document.getElementById('pending1').checked
  let select2 = document.getElementById('approved1').checked
  let select3 = document.getElementById('denied1').checked

  let option = ''
  if (select1) {
    option = 'pending'
  } else if (select2) {
    option = 'approved'
  } else {
    option = 'denied'
  }

  //Fetch Request
  fetch('http://localhost:3000/reimbursement/status/' + option, {
    credentials: 'include'
  })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401 || resp.status === 403) {
        return;
      }
      return resp.json();
    })
    .then((user) => {

      // clear table
      // const body = document.getElementById('re-table-body');
      // body.innerHTML = '';
      dTable.clear()
      dTable.draw()

      // populate the table for each movie
      console.log(user)
      user.forEach(addRe);

      //New method
      dTable.draw()

    })
    .catch(err => {
      console.log(err);
      const body = document.getElementById('re-table-body');
      body.innerText = 'Unable to retreive data';
    });


  //alert("selected " + option + "!")

  //Add to table

}

function allSubmit() {
  // Parse local storage data
  allData = localStorage.getItem('userData') + ']'
  console.log(allData)

  fetch('http://localhost:3000/reimbursement/user/', {
    body: allData,
    method: "POST",
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
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
      let myUsername = resp.username
    })
    .catch(err => {
      console.log('successfully sent data')
      document.getElementById('userx-table-body').innerHTML = ''
      localStorage.setItem("userData", '[')
      //document.getElementById('error-message').innerText = err;
    })
}

function addReimbursements() {
  let inTitle = document.getElementById('inputTitle').value
  let inAmount = document.getElementById('inputAmount').value
  let inDescription = document.getElementById('inputDescription').value
  let inTime = document.getElementById('inputTime').value

  //Clear
  document.getElementById('inputTitle').value = ''
  document.getElementById('inputAmount').value = ''
  document.getElementById('inputDescription').value = ''
  document.getElementById('inputTime').value = ''


  items = `{
    "title": "${inTitle}",
    "amount": "${inAmount}",
    "description": "${inDescription}",
    "timeOfExpense": "${inTime}"
  }`

  if (localStorage.getItem("userData") != '[') {
    tempStr = localStorage.getItem("userData") + ',' + items
  } else {
    tempStr = '[' + items
  }

  localStorage.setItem("userData", tempStr)
  console.log(localStorage.getItem("userData"))


  let seeIt = document.getElementById('userx-table-body')

  //Table could be populated with past Reimbursements
  let check1 = document.getElementById('reTable') && document.getElementById('reTable').getAttribute('value')
  if (check1 == '2') {
    seeIt.innerHTML = ''
    //localStorage.setItem("userData", '[') <--Shouldnt be needed
  }


  //Initialize First Row if Table is Empty
  let check2 = document.getElementById('tableOn') && document.getElementById('tableOn').getAttribute('value')
  if (check2 != "1") {
    seeIt.innerHTML += `
    <thead>
      <tr id="tableOn" value="1">
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">Amount</th>
        <th scope="col">Description</th>
        <th scope="col">Time of Expense</th>
      </tr>
    </thead>`
  }


  seeIt.innerHTML += `
  
    <th scope="col">#</th>
    <th scope="col">${inTitle}</th>
    <th scope="col">${inAmount}</th>
    <th scope="col">${inDescription}</th>
    <th scope="col">${inTime.substr(0, 10) + " " + inTime.substr(11, 15)}</th>
     `


}


function viewPastRe() {
  // const body = document.getElementById('item-table-body');

  fetch('http://localhost:3000/reimbursement/user', { credentials: 'same-origin' })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401 || resp.status === 403) {
        return;
      }
      return resp.json();
    })
    .then((user) => {

      // TESTING
      console.log('fetch called, contents are ' + user[0])
      console.log(user[0])

      // clear table
      const body = document.getElementById('userx-table-body');
      body.innerHTML = '';
      localStorage.setItem("userData", '[')

      // populate the table for each movie

      let i = 0;
      while (i < user.length) {

        document.getElementById('userx-table-body').innerHTML += `

        <tr bgcolor="#80dfff">
        <th id="reTable" value ="2" colspan="50" scope="row">Submitted: [${user[i].status}] ${(new Date(user[i].timestamp)).toLocaleString("en-US")} </th>
        <tr>
        <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Amount</th>
              <th scope="col">Description</th>
              <th scope="col">Time of Expense</th>
            </tr>`;

        (user[i].items).forEach(addItem);
        i++
      }


    })
    .catch(err => {
      console.log(err);
      const body = document.getElementById('userx-table-body');
      body.innerText = 'Unable to retreive data';
    });


}



function modalItems() {

  $('#exampleModalLong').modal('show');


}



function retreiveAllUsers() {
  fetch('http://localhost:3000/users/', {

    credentials: 'include'
  })
    .then(resp => {
      console.log(resp.status)
      if (resp.status === 401 || resp.status === 403) {
        return;
      }
      return resp.json();
    })
    .then((user) => {

      // clear table
      const body = document.getElementById('user-table-body');
      body.innerHTML = '';

      // populate the table for each movie
      user.forEach(addMovie);
    })
    .catch(err => {
      console.log(err);
      const body = document.getElementById('user-table-body');
      body.innerText = 'Unable to retreive data';
    });
}

function addItem(user) {
  const body = document.getElementById('userx-table-body');

  body.innerHTML += `
    <tr>
      <th scope="row">1</th>
      <td>${user.title}</td>
      <td>${user.amount}</td>
      <td>${user.description}</td>
      <td>${user.timeOfExpense}</td>
    </tr>
  `;

  // $('#exampleModalLong').modal('show');
}

function addItemx(user) {
  const body = document.getElementById('itemM-table-body');

  body.innerHTML += `
    <tr>
      <th scope="row">1</th>
      <td>${user.title}</td>
      <td>${user.amount}</td>
      <td>${user.description}</td>
      <td>${user.timeOfExpense}</td>
    </tr>
  `;

  $('#exampleModalLong').modal('show');
}

function reQuery(inUser, inTime) {
  fetch('http://localhost:3000/reimbursement/' + inUser + '/' + inTime, {
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
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

      console.log('fresh data!')
      console.log(data)
      // clear table
      const body = document.getElementById('itemM-table-body');
      body.innerHTML = '';

      // populate the table for each movie
      document.getElementById('itemM-table-body').innerHTML += `

        <tr bgcolor="#80dfff">
        <th colspan="50" scope="row">Submitted: ${(new Date(data.timestamp)).toLocaleString("en-US")}</th>
        <tr>
        <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Amount</th>
              <th scope="col">Description</th>
              <th scope="col">Time of Expense</th>
            </tr>`;
      data.items.forEach(addItemx);



    })
    .catch(err => {
      console.log('successfuly sent data')
      //document.getElementById('error-message').innerText = err;
    })
}





function addRe(user) {
  const body = document.getElementById('re-table-body');
  let inName = user.username
  console.log("name is")
  console.log(typeof inName)


  dTable.row.add([
    `#`,
    `${user.username}`,
    `${(new Date(user.timestamp)).toLocaleString("en-US")}`,
    `<button type="button" onClick ="reQuery(\'${user.username}\', \'${user.timestamp}\')" class="btn btn-primary">view</button>`,
    `${user.approver}`,
    `${user.status}`,
    `<button type="button" onClick ="fate(\'${user.username}\', \'${user.timestamp}\',\'${user.status}\')" class="btn btn-primary">Change Status</button>`,
  ])


  // body.innerHTML += `
  //   <tr>
  //     <th scope="row">1</th>
  //     <td>${user.username}</td>
  //     <td>${user.timestamp}</td>
  //     <td><button type="button" onClick ="reQuery(\'${user.username}\', \'${user.timestamp}\')" class="btn btn-primary">view</button></td>
  //     <td>${user.approver}</td>
  //     <td>${user.status}</td>
  //     <td><button type="button" onClick ="fate(\'${user.username}\', \'${user.timestamp}\',\'${user.status}\')" class="btn btn-primary">Change Status</button></td>
  //   </tr>
  // `;



}

function fate(inUser, inTime, inStatus) {

  let target = document.getElementById('mStatus');
  target.innerHTML = ``
  target.innerHTML += `Current Status: <br><h2 style="color:blue;">${inStatus}</h2><br><br>`
  target.innerHTML += "Please select how you would like to update the status:"

  target.innerHTML += `<br>
  <button onClick="statChange(\'${inUser}\',\'${inTime}\',\'approved\')" type="button" class="btn btn-success">Approve</button>
  <button onClick="statChange(\'${inUser}\',\'${inTime}\',\'denied\')" type="button" class="btn btn-secondary">Deny</button>`
  $('#statusModal').modal('show')
}

function statChange(inUser, inTime, option) {
  //alert(inUser + ' ' + inTime + ' ' + option)
  fetch('http://localhost:3000/reimbursement/', {
    headers: {
      'content-type': 'application/json'
    },
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify({
      username: inUser,
      timestamp: inTime,
      newStatus: option
    })
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
      //alert('UPDATED')
      window.location.reload()
    })
    .catch(err => {
      console.log('successfuly sent data')
      window.location.reload()
      //document.getElementById('error-message').innerText = err;
    })

}

function addMovie(user) {
  const body = document.getElementById('user-table-body');

  // const row = document.createElement('tr'); // create <tr>
  // let data = document.createElement('td'); // create <td>
  // data.innerText = movie.year; // assign value to the td
  // row.appendChild(data); // append the td to the row
  // data = document.createElement('td');
  // data.innerText = movie.title;
  // row.appendChild(data);
  // data = document.createElement('td');
  // data.innerText = movie.rating;
  // row.appendChild(data);
  // data = document.createElement('td');
  // data.innerText = movie.description;
  // row.appendChild(data);
  // body.appendChild(row); // append the row to the body

  body.innerHTML += `
    <tr>
      <th scope="row">1</th>
      <td>${user.username}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
    </tr>
  `;
}