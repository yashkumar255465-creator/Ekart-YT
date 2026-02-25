 //import React from 'react'

// const App = () => {
//   return (
//     <div classname= 'red-tex-700'>
//       hello yash
//     </div>
//   )
// }

// export default App
// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/login";
// import Signup from "./pages/signup";
// import Home from "./pages/Home";

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/home" element={<Home />} />
//     </Routes>
//   );
// };

// export default App;












import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;