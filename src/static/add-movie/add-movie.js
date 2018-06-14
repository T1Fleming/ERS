function addMovie() {
  const year = parseInt(document.getElementById('input-year').value);
  const title = document.getElementById('input-title').value;
  const rating = parseInt(document.getElementById('input-rating').value);
  const description = document.getElementById('description').value;

  const movie = {year, title, rating, description};

  fetch('http://localhost:3000/movies', {
    body: JSON.stringify(movie),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include',
    method: 'POST'
  })
  .then(resp => {
    if (resp.status === 401 || resp.status === 403) {
      alert('invalid permissions')
      throw 'Invalid permissions';
    }
    return resp.json();
  })
  .then(data => {
    alert('created') // this is horrible, never use alerts
  })
  .catch(err => {
    console.log(err);
  });
}