import { useState } from "react";

const FormComponent = ({ onSubmit, buttonText }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    onSubmit({
      email,
      password,
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="mb-3">
        <label className="form-label">Email</label>

        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>

        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-primary w-100">
        {buttonText}
      </button>
    </form>
  );
};

export default FormComponent;