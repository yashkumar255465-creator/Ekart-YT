import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const signOut = useSignOut();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/user/logout", {
        method: "POST",
        headers: { "Authorization": authHeader }
      });
      signOut();
      navigate("/login"); // or "/"
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">🛒 KART</div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <span>Hello, Yash</span>

        <div className="cart">
          🛍 <span className="cart-count">0</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;