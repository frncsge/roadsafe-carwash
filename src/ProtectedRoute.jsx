import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

//component for checking if user is already logged in.
function ProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //runs on mount and for fetching data from the express server to check if user is logged in.
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/validation", {
          method: "GET",
          credentials: "include", //Send the cookies along with this request, even if it’s cross-origin.
        });

        const data = await response.json(); //parse the json that came with the fetch back into a JS object.
        setIsLoggedIn(data.isLoggedIn); //true or false.
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      } finally { //this run after either the try or catch blocks. 
        setIsLoading(false);
      }
    }

    checkSession(); //call the async function
  }, []);

  if(isLoading){
    return <h1>Loading...</h1>; //temporary
  }

  return isLoggedIn ? children : <Navigate to="/admin/login" />;
}

export default ProtectedRoute;
