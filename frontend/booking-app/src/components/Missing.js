import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <article style={{ padding: "100px" }}>
      <h1>404</h1>
      <p>Az oldal nem található</p>
      <div className="flexGrow">
        <Link to="/login">Vissza a bejelentkezéshez</Link>
      </div>
    </article>
  );
};

export default Missing;
