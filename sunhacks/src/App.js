import FlowNode from "./components/FlowNode";
import Levels from "./pages/Levels";
import Login from "./pages/Login";
import Codespace from "./pages/Codespace";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/levels/login-success" element={<Levels />} />
        <Route path="/codespace" element={<Codespace />} />
      </Routes>
    </BrowserRouter>
    // <div>
    //   <Login></Login>
    //   {/* <FlowNode></FlowNode> */}
    //   {/* <Levels></Levels> */}
    // </div>
  );
}

export default App;
