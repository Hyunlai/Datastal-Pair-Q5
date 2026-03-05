import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>

      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/home">
            Mythology Scholar
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mt-4">
        <Outlet />
      </div>

    </div>
  );
};

export default MainLayout;