import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen/LoadingScreen";

//component for checking if user is already logged in.
function ProtectedRoute({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //runs on mount and for fetching data from the express server to check if user is logged in.
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/validation", {
          method: "GET",
          credentials: "include", //Send the cookies along with this request, even if it’s cross-origin.
        });

        if(response.ok){
          setIsLoggedIn(true);
        } else if(response.status === 401){
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession(); //call the async function
  }, []);

  if(isLoading){
    return <LoadingScreen />;
  }

  return isLoggedIn ? children : <Navigate to="/admin/login"/>;
}

export default ProtectedRoute;
