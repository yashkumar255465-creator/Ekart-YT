// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate("/");
//   };

//   return (
//     <div style={styles.container}>
//       <h1>Welcome Yash 🎉</h1>
//       <button onClick={handleLogout} style={styles.button}>
//         Logout
//       </button>
//     </div>

//   );
// }

// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   button: {
//     padding: "10px 20px",
//     background: "red",
//     color: "#fff",
//     border: "none",
//     marginTop: "20px",
//     cursor: "pointer",
//   },
// };

// export default Home;



// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// function Home() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("user"); // remove saved user
//     navigate("/"); // go to login page
//   };

//   return (
//     <>
//       <Header />
//       <Navbar />

//       <section className="hero">
//         <div className="hero-left">
//           <h1>Latest Electronics at Best Prices</h1>
//           <p>
//             Discover cutting-edge technology with unbeatable deals on
//             smartphones, laptops and more.
//           </p>

//           <div className="hero-buttons">
//             <button className="primary-btn">Shop Now</button>
//             <button className="secondary-btn">View Deals</button>
//           </div>

//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             style={{
//               marginTop: "20px",
//               padding: "10px 20px",
//               background: "red",
//               color: "#fff",
//               border: "none",
//               borderRadius: "6px",
//               cursor: "pointer",
//             }}
//           >
//             Logout
//           </button>
//         </div>

//         <div className="hero-right">
//           <img
//             src="https://i.imgur.com/8Km9tLL.png"
//             alt="phone"
//           />
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// }

// export default Home;






import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // remove saved user
    navigate("/"); // go to login page
  };

  return (
    <>
      <Header />
      <Navbar />

      <section className="hero">
        <div className="hero-left">
          <h1>Latest Electronics at Best Prices</h1>
          <p>
            Discover cutting-edge technology with unbeatable deals on
            smartphones, laptops and more.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Shop Now</button>
            <button className="secondary-btn">View Deals</button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "red",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div className="hero-right">
          <img
            src="https://i.imgur.com/8Km9tLL.png"
            alt="phone"
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;