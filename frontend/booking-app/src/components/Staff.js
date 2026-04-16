import { Link } from "react-router-dom";

const Lounge = () => {
  return (
    <section>
      <h1>A személyzet oldala</h1>
      <br />
      <p>Ha ezt látod, akkor van szerkesztői vagy admin jogosultságod.</p>
      <div className="flexGrow">
        <Link to="/">Kezdőlap</Link>
      </div>
    </section>
  );
};

export default Lounge;
