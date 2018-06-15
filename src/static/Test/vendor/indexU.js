function logout(){

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
  var h12 = ((h+11)%12)+1;
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
  document.getElementById('itemM-table-body').innerHTML = ''
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
      const body = document.getElementById('itemM-table-body');
      body.innerHTML = '';
      localStorage.setItem("userData", '[')

      // populate the table for each movie

      let i = 0;
      while (i < user.length) {

        document.getElementById('itemM-table-body').innerHTML += `

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
      const body = document.getElementById('itemM-table-body');
      body.innerText = 'Unable to retreive data';
    });

}


function addReimbursements() {
  let inTitle = document.getElementById('inputTitle').value
  let inAmount = document.getElementById('inputAmount').value
  let inDescription = document.getElementById('inputDescription').value
  let inTime = document.getElementById('inputTime').value

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


  let seeIt = document.getElementById('itemM-table-body')

  //Table could be populated with past Reimbursements
  let check1 = document.getElementById('reTable') && document.getElementById('reTable').getAttribute('value')
  if (check1 == '2') {
    seeIt.innerHTML = ''
    //localStorage.setItem("userData", '[') <-This shouldnt be needed...
  }


  //Initialize First Row if Table is Empty
  let check2 = document.getElementById('tableOn') && document.getElementById('tableOn').getAttribute('value')
  if (check2 != "1") {
    //alert(check2)
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
    <th scope="col">${inTime}</th>
     `

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
      document.getElementById('itemM-table-body').innerHTML = ''
      localStorage.setItem("userData", '[')
      //document.getElementById('error-message').innerText = err;
    })
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
      const body = document.getElementById('itemM-table-body');
      body.innerHTML = '';
      localStorage.setItem("userData", '[')

      // populate the table for each movie

      let i = 0;
      while (i < user.length) {

        document.getElementById('itemM-table-body').innerHTML += `

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
      const body = document.getElementById('itemM-table-body');
      body.innerText = 'Unable to retreive data';
    });


}

function addItem(user) {
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

  // $('#exampleModalLong').modal('show');
}