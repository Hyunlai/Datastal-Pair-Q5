import { createBrowserRouter } from "react-router-dom";

import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import HomeScreen from "./screens/homeScreen";
import ConversationDetailScreen from "./screens/conversationDetailScreen";

import MainLayout from "./layouts/main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },

  {
    path: "/conversation/:id", 
    element: <ConversationDetailScreen />
  },

  {
    path: "/home",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomeScreen />,
      },
    ],
  },
]);

export default router;