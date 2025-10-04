import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

function TopBar() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const response = await fetch(API_URL + "/api/admin/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const adminObject = await response.json();
          setAdmin(adminObject);
        } else if (response.status === 401) {
          setAdmin(null);
        }
      } catch (error) {
        console.error(error);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdmin();
  }, []);

  if (!isLoading && !admin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div id="top-bar-container">
      <section className="menu-logo top-bar-section">
        <div id="menu">
          <GiHamburgerMenu size={25} />
        </div>
        <img id="logo" src="/roadsafe logo.png" alt="Roadsafe logo" />
      </section>
      <section className="admin-name-profile top-bar-section">
        {isLoading ? (
          <>
            <div id="loading-admin-name"></div>
            <div id="loading-admin-profile"></div>
          </>
        ) : (
          <>
            <span id="admin-name">{admin.admin_name}</span>
            {/* first letter of the admin name */}
            <div id="admin-profile">{admin.admin_name.slice(0, 1)}</div>
          </>
        )}
      </section>
    </div>
  );
}

export default TopBar;
