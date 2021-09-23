import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const history = useHistory();
  const checkLogin = () => {
    if (localStorage.getItem("token")) {
      history.push("/TaskListScreen");
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState({});

  const handleLogin = async () => {
    let mounted = true;
    if (!email) {
      setError({ email: "Please enter email." });
    } else if (!password) {
      setError({ password: "Password is required." });
    } else {
      try {
        setLoading(true);
        setDisabled(true);
        const response = await axios.post(
          `http://todo.dev.api.iodatalabs.com/api/v1/users/login`,
          { username: email, password },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        if (mounted) {
          console.log(response.data.payload["auth-token"]);
          setLoading(false);
          setDisabled(false);
          localStorage.setItem("token", response.data.payload["auth-token"]);
          history.push("/TaskListScreen");
        }
      } catch (err) {
        console.log(err);
        setError({ error: `${err.response.data.msg}` });
        setLoading(false);
        setDisabled(false);
      }
      return () => {
        mounted = false;
      };
    }
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="login_container">
              <h2>Login</h2>
              <div className="inputWrapper">
                <label>Email</label>
                <input
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setError({ new: "" });
                    setEmail(e.target.value);
                  }}
                  type="email"
                  required
                />
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "0",
                    paddingTop: "5px",
                  }}
                >
                  {error.email}
                </p>
              </div>
              <div className="inputWrapper">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setError({ new: "" });
                    setPassword(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.code === "Enter") {
                      handleLogin();
                    }
                  }}
                />
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "0",
                    paddingTop: "5px",
                  }}
                >
                  {error.password}
                </p>
              </div>
              <div className="buttonwrapper">
                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "400",
                    margin: "0",
                    padding: "5px 0",
                  }}
                >
                  {error.error}
                </p>
                <button
                  className="submit"
                  onClick={handleLogin}
                  disabled={disabled}
                >
                  {loading ? (
                    <Loader
                      type="TailSpin"
                      color="#fff"
                      height={20}
                      width={20}
                    />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
