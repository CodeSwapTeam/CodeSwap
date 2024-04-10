import Carreiras from "./components/HomePage/Carreiras";
import Home from "./components/HomePage/Home";

import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Metodologia from "./components/HomePage/Metodologia";
import Comunidade from "./components/HomePage/Comunidade";
import SaibaMais from "./components/HomePage/SaibaMais";
import Login from "./components/HomePage/Login";
import Cadastro from "./components/HomePage/Cadastro";

import Dashboard from "./components/Private/Dashboard";
import { AuthProvider } from "./contexts/authVerify";
import { PrivateRoutes } from "./components/PrivateRoutes";
import { ContextStore } from "./contexts/contextProject";
import AdmUser from "./components/Private/AdmUser";


export default function Home() {
  return (
    <div>
        <p>Hello Word</p>
    </div>
  );
}
