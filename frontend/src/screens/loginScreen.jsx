import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { login } from "../redux/authSlice";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const submitHandler = async (data) => {
    const result = await dispatch(login(data));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/home");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card shadow p-4" style={{ width: "400px" }}>

        <h3 className="text-center mb-3">Login</h3>

        {error && <Message>{error}</Message>}
        {loading && <Loader />}

        <FormComponent
          onSubmit={submitHandler}
          buttonText="Login"
        />

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default LoginScreen;