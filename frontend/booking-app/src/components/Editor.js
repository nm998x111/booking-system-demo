import { Link } from "react-router-dom";

const Editor = () => {
  return (
    <section>
      <h1>A szerkesztők oldala</h1>
      <br />
      <p>Ha ezt látod, akkor szerkesztői jogosultságod van.</p>
      <br />
      <div className="flexGrow">
        <Link to="/">Kezdőlap</Link>
      </div>
    </section>
  );
};

export default Editor;
