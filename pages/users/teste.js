import { useState } from "react";
import DietaGrafics from "components/user/dietaGrafics";
import DietaHome from "components/user/dietaHome";

export default function Users() {
  const [activeComponent, setActiveComponent] = useState(""); // valor inicial: "dieta"

  const renderComponent = () => {
    if (activeComponent === "dieta") return <DietaHome />;
    if (activeComponent === "evolucao") return <DietaGrafics />;
    return null;
  };

  return (
    <div>
      <div></div>
      <div>
        <div>
          {renderComponent()}
          <a onClick={() => setActiveComponent("dieta")} style={{ cursor: "pointer" }}>
            Minha Dieta
          </a>
          <a onClick={() => setActiveComponent("evolucao")} style={{ cursor: "pointer" }}>
            Minha Evolução
          </a>
        </div>
        <a>Meu Treino</a>
      </div>
    </div>
  );
}
