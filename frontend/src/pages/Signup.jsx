// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Signup() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (name && email && password) {
//       alert("Signup Successful ✅");
//       navigate("/");
//     } else {
//       alert("Please fill all fields");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form style={styles.form} onSubmit={handleSignup}>
//         <h2>Signup</h2>

//         <input
//           type="text"
//           placeholder="Enter Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           type="password"
//           placeholder="Enter Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//         />

//         <button type="submit" style={styles.button}>
//           Signup
//         </button>

//         <p>
//           Already have an account? <Link to="/">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f5f5f5",
//   },
//   form: {
//     padding: "30px",
//     background: "#fff",
//     borderRadius: "10px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     width: "300px",
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     margin: "10px 0",
//   },
//   button: {
//     width: "100%",
//     padding: "10px",
//     background: "green",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//   },
// };

// export default Signup;








import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All fields are required ❌");
      return;
    }

    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || firstName; // Fallback if no last name provided

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful ✅ Please check your email for verification.");
        navigate("/");
      } else {
        alert(data.message || "Signup failed ❌");
      }
    } catch (error) {
      alert("Network error: Failed to signup");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSignup}>
        <h2>Signup</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Signup
        </button>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  form: {
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "green",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Signup;