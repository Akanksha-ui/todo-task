import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./TaskListScreen.css";
import axios from "../../axios";
import TaskList from "../../components/TaskList/TaskList";
import SearchBar from "material-ui-search-bar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

const TaskListScreen = () => {
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

  const [data, setData] = useState([]);
  const [dataforfilter, setDataforfilter] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  const [openAlert2, setOpenAlert2] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const handleOpenAlert = () => setOpenAlert(true);
  const handleCloseAlert = () => setOpenAlert(false);

  const handleOpenAlert2 = () => setOpenAlert2(true);
  const handleCloseAlert2 = () => setOpenAlert2(false);

  const fetchDropdown = async () => {
    let mounted = true;
    try {
      const response = await axios.get(`/v1/todos/?search=${search}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": `${token}`,
        },
      });
      if (mounted) {
        setData(response.data.payload);
        setDataforfilter(response.data.payload);
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    fetchDropdown();
  }, [refresh]);

  const redirectToAddTask = () => {
    history.replace("/AddTask");
  };

  const handleDoneTodo = async (id) => {
    let mounted = true;
    try {
      const response = await axios.put(
        `/v1/todos/${id}`,
        { done: true },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": `${token}`,
          },
        }
      );
      if (response) {
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      mounted = false;
    };
  };

  const handleDeleteAll = async () => {
    let mounted = true;
    try {
      const response = await axios.delete(`/v1/todos/completed`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": `${token}`,
        },
      });
      if (response) {
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      mounted = false;
    };
  };

  const handleChange = (event) => {
    setFilterValue(event.target.value);
  };

  const filterByDone = () => {
    if (filterValue === "Active") {
      let newArray = dataforfilter.filter((item) => item.done === false);
      setData(newArray);
    } else if (filterValue === "Completed") {
      let newArray = dataforfilter.filter((item) => item.done === true);
      setData(newArray);
    } else if (filterValue === "All") {
      setData(dataforfilter);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    history.replace("/Login");
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-12 center">
            <div className="task_container">
              <h2>Todo List</h2>
              <div className="action_button">
                <div>
                  <button onClick={redirectToAddTask}>Add Task</button>
                </div>
                <div>
                  <button onClick={handleOpenAlert2}>Filter</button>
                </div>
                <div>
                  <button onClick={handleOpenAlert}>Delete All</button>
                </div>
                <div>
                  <button onClick={handleLogout}>Log out</button>
                </div>
              </div>
              <div className="action_tile">
                <SearchBar
                  value={search}
                  onChange={(newValue) => setSearch(newValue)}
                  onRequestSearch={() => setRefresh(!refresh)}
                  onCancelSearch={() => {
                    setSearch("");
                    setRefresh(!refresh);
                  }}
                />
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Title</th>
                    </tr>
                  </thead>
                  {data.length === 0 ? (
                    <tbody>
                      <tr>
                        <td></td>
                        <td>No data to show</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {data.map((items) => {
                        return (
                          <TaskList
                            key={items.id}
                            {...items}
                            handleDoneTodo={handleDoneTodo}
                          />
                        );
                      })}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Confirmation!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Close</Button>
          <Button
            onClick={() => {
              handleDeleteAll();
              handleCloseAlert();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAlert2}
        onClose={handleCloseAlert2}
        // sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
      >
        <DialogTitle>Filter</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            aria-label="filter"
            name="filter"
            value={filterValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value="All"
              name="filter"
              key="All"
              control={<Radio />}
              label="All"
            />
            <FormControlLabel
              value="Active"
              name="filter"
              key="Active"
              control={<Radio />}
              label="Active"
            />
            <FormControlLabel
              value="Completed"
              name="filter"
              key="Completed"
              control={<Radio />}
              label="Completed"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert2}>Close</Button>
          <Button
            onClick={() => {
              filterByDone();
              handleCloseAlert2();
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default TaskListScreen;
