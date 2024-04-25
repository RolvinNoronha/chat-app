import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Login from "./components/Login";
import Rooms from "./components/Rooms";
import Chat from "./components/Chat";
import SignIn from "./components/SignIn";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./context/Context";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/rooms",
    element: <Rooms />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/signup",
    element: <SignIn />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContext>
      <RouterProvider router={router} />
    </AuthContext>
  </React.StrictMode>
);
