import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const Home = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <section>
      <h1>Kezdőlap</h1>
      <br />
      <p>Oldalak:</p>
      <br />
      <Link to="/editor">Szerkesztő oldal</Link>
      <br />
      <Link to="/admin">Admin oldal</Link>
      <br />
      <Link to="/staff">Személyzeti menü</Link>
      <div className="flexGrow">
        <button onClick={signOut}>Kijelentkezés</button>
      </div>
    </section>
  );
};

export default Home;
