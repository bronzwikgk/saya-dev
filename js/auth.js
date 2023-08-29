import { IndexedDB } from "./utils/idb.js";

class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.baseUrl = ""
    }

    async signIn(email, password) {
        // Basic email validation using a regex
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        try {
            const response = await fetch(this.baseUrl+'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log(data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                
                this.token = data.token;
                return true;
            } else {
                throw new Error(data.error || 'Failed to sign in');
            }
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    }

    async signUp(username, email, password) {
        // Basic username validation
        if (username.trim().length === 0) {
            alert('Username cannot be empty.');
            return false;
        }

        // Basic email validation using a regex
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        // Basic password validation
        if (password.length < 6) {  // Assuming a minimum length of 6
            alert('Password should be at least 6 characters long.');
            return false;
        }

        try {
            const response = await fetch(this.baseUrl+'/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                this.token = data.token;
                return true;
            } else {
                throw new Error(data.error || 'Failed to sign up');
            }
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    }

   async signOut() {
        // Clear local storage
        localStorage.clear();

        // Clear specific object stores from IndexedDB
        // Repeat for each object store you want to clear
        try {
            await IndexedDB.DeleteStore("MyDatabase", "documents");
            window.location.href = '/auth.html'; 
            console.log("Successfully logged out and cleared data");
        } catch (error) {
            console.error("Error during logout:", error);
        }
        
    }

    isAuthenticated() {
        return this.token !== null;
    }
}

const auth = new Auth()

 if (document.getElementById('signin-form')) {
    // Authentication SignIn
    document.getElementById('signin-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      if (await auth.signIn(email, password)) {
        window.location.href = "/"
        alert('Signed in successfully!');
        // Redirect or update UI
      } else {
        alert('Failed to sign in.');
      }
    });
  }

  if (document.getElementById('signup-form')) {
    // Authentication SignUp
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
      e.preventDefault();


      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (await auth.signUp(username, email, password)) {
        window.location.href = "/"
        alert('Signed up successfully!');
        // Redirect or update UI
      } else {
        alert('Failed to sign up.');
      }
    });
  }



export {Auth}