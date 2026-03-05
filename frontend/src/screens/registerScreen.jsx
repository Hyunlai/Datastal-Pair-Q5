import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import FormComponent from "../components/FormComponent";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { register } from "../redux/authSlice";

const RegisterScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const submitHandler = async (data) => {

    const result = await dispatch(register(data));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div className="card shadow p-4" style={{ width: "400px" }}>

        <h3 className="text-center mb-3">
          Register
        </h3>

        {error && <Message>{error}</Message>}
        {loading && <Loader />}

        <FormComponent
          onSubmit={submitHandler}
          buttonText="Register"
        />

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default RegisterScreen;