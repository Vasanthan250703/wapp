const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault(); // prevent real form submission

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Login success
      successMessage.style.display = 'block';
      errorMessage.style.display = 'none';
      
      setTimeout(() => {
        window.location.href = "dashboard.html"; // Redirect after showing success
      }, 1000);
    } else {
      // Login failed
      errorMessage.style.display = 'block';
      successMessage.style.display = 'none';
      console.error(data.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    alert('Something went wrong. Please try again.');
  }
});
