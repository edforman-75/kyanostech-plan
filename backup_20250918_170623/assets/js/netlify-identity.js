// Initialize Netlify Identity
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/";
      });
    }
  });
}

// Add login/logout controls to the page
document.addEventListener('DOMContentLoaded', function() {
  // Create login/logout button container
  const authContainer = document.createElement('div');
  authContainer.id = 'netlify-auth';
  authContainer.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;
  
  // Add to page
  document.body.appendChild(authContainer);
  
  // Check login status and update UI
  function updateAuthUI() {
    const user = netlifyIdentity.currentUser();
    if (user) {
      authContainer.innerHTML = `
        <span>Welcome, ${user.user_metadata?.full_name || user.email}!</span>
        <button onclick="netlifyIdentity.logout()" style="margin-left: 10px;">Logout</button>
      `;
    } else {
      authContainer.innerHTML = `
        <button onclick="netlifyIdentity.open()">Login</button>
      `;
      // Redirect to login if not authenticated
      // netlifyIdentity.open();
    }
  }
  
  // Update UI when identity widget loads
  netlifyIdentity.on('init', updateAuthUI);
  netlifyIdentity.on('login', updateAuthUI);
  netlifyIdentity.on('logout', updateAuthUI);
});