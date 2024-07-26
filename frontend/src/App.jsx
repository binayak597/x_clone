import { Outlet } from "react-router-dom"
import LeftSideBar from "./components/common/LeftSideBar"
import RightPanel from "./components/common/RightPanel"

function App() {


  return (
    <div className="flex max-w-6xl mx-auto">
      
      <LeftSideBar />
      <Outlet />
      <RightPanel />
    </div>
  )
}

export default App
