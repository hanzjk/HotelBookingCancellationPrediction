import React , {useState,useEffect} from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Home2 from "./components/Home2";


function App() {
 
   return (
     <BrowserRouter>
       <Routes>
         <Route exact path="/home" element={<Home />} />
         <Route exact path="/home2" element={<Home2 />} />
       </Routes>
     </BrowserRouter>
   );
}

export default App