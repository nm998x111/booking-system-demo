import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section>
      <h1>Hozzáférés megtagadva</h1>
      <br />
      <p>Nincs jogosultságod megtekinteni ezt az oldalt.</p>
      <div className="flexGrow">
        <button onClick={goBack}>Vissza</button>
      </div>
    </section>
  );
};

export default Unauthorized;
