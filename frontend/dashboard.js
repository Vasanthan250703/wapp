function navigateTo(page) {
    // Simulate navigation (You can replace this when you add real pages)
    alert(`Redirecting to ${page}`);
    // window.location.href = page;
  }
  
  function logout() {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "login.html"; // Back to login page
    }
  }
  