import Login from "./components/Login";

function App() {
  return (
    <div className="bg-light min-vh-100">
      {/* A clean, temporary Bootstrap Header for professional framing */}
      <nav className="navbar navbar-dark bg-dark mb-5 shadow-sm">
        <div className="container">
          <span className="navbar-brand mb-0 h1 fw-bold">
            Financial Solution Helper
          </span>
        </div>
      </nav>

      {/* Mounting your newly generated component */}
      <Login />
    </div>
  );
}

export default App;
