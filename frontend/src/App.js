import Log from "./components/pages/Log";
import Acceuil from "./components/pages/Acceuil";

//Import react dom router
import { Routes, Route } from "react-router-dom";

function App() {
  // const [uid,setUid] = useState(null);
  return (
    // <UidContext.Provider value={uid}>
    <div className="app">
      <Routes>
        <Route path="/" element={<Log />}></Route>
        <Route path="/Acceuil" element={<Acceuil />}></Route>
        <Route></Route>
      </Routes>
    </div>


  );
}
export default App;
