import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <section>
      <h1>Az adminok oldala</h1>
      <br />
      <p>Ha ezt látod, akkor admin jogosultságod van.</p>
      <br />
      <div className="flexGrow">
        <Link to="/">Kezdőlap</Link>
      </div>
    </section>
  );
};

export default Admin;
