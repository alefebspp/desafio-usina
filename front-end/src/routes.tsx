import { createBrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Home from "./pages/Home";
import AppLayout from "./layouts/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);
