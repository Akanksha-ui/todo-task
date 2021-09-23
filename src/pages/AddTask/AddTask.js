import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";
import "./AddTask.css";
import axios from "../../axios";
import moment from "moment";

const AddTask = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const checkLogin = () => {
    if (!localStorage.getItem("token")) {
      history.replace("/Login");
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState({});

  const addTask = async () => {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let mounted = true;
    if (!title) {
      setError({ title: "Please enter Title." });
    } else if (!description) {
      setError({ description: "Please provide a description." });
    } else {
      try {
        setLoading(true);
        setDisabled(true);
        const response = await axios.post(
          `/v1/todos/`,
          {
            title,
            description,
            due_date: moment(tomorrow).format("yyyy-M-D"),
            priority: 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "auth-token": `${token}`,
            },
          }
        );
        if (mounted) {
          console.log(response.data);
          setLoading(false);
          setDisabled(false);
          history.replace("/TaskListScreen");
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
            <div className="addtask_container">
              <h2>Create New Task</h2>
              <div className="input_wrapper">
                <label>Title</label>
                <input
                  type="text"
                  maxLength={50}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  {error.title}
                </p>
              </div>
              <div className="input_wrapper">
                <label>Description</label>
                <input
                  type="text"
                  maxLength={256}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {error.description}
                </p>
              </div>
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
              <div className="button_wrapper">
                <button
                  className="submit"
                  onClick={addTask}
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
                    "Add"
                  )}
                </button>
                <button
                  className="back"
                  onClick={() => history.push("/TaskListScreen")}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTask;
