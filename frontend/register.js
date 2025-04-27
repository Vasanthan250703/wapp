const API_BASE_URL = 'http://localhost:5000/api/register';
// adjust if backend url changes

async function sendOtp() {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    showMessage('Please fill all fields.', 'red');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      showMessage('OTP sent to your email!', 'green');
      document.getElementById('otp-section').style.display = 'block';
    } else {
      showMessage(data.message || 'Error sending OTP.', 'red');
    }
  } catch (err) {
    console.error(err);
    showMessage('Server error. Please try again.', 'red');
  }
}

async function verifyOtp() {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const otp = document.getElementById('otp').value.trim();

  if (!otp) {
    showMessage('Please enter OTP.', 'red');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, otp })
    });

    const data = await response.json();
    if (response.ok) {
      showMessage('Registered successfully! Redirecting to login...', 'green');
      setTimeout(() => {
        window.location.href = '/frontend/login.html'; // adjust path if needed
      }, 2000);
    } else {
      showMessage(data.message || 'OTP verification failed.', 'red');
    }
  } catch (err) {
    console.error(err);
    showMessage('Server error. Please try again.', 'red');
  }
}

function showMessage(msg, color) {
  const messageEl = document.getElementById('message');
  messageEl.innerText = msg;
  messageEl.style.color = color;
}
