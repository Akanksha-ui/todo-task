import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./DetailScreen.css";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  Modal,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import axios from "../../axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #fffff",
  boxShadow: 24,
  p: 2,
};

const DetailScreen = (props) => {
  const token = localStorage.getItem("token");
  const { title, description, id } = props.location.state;
  console.log(props);
  const history = useHistory();
  const checkLogin = () => {
    if (!localStorage.getItem("token")) {
      history.replace("/Login");
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const [edittitle, setEditTitle] = useState(title);
  const [editdescription, setEditDescription] = useState(description);

  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleOpenAlert = () => setOpenAlert(true);
  const handleCloseAlert = () => setOpenAlert(false);

  const handleDelete = async () => {
    let mounted = true;
    try {
      const response = await axios.delete(`/v1/todos/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": `${token}`,
        },
      });
      if (response) {
        history.push("/TaskListScreen");
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      mounted = false;
    };
  };

  const EditData = {
    title: edittitle,
    description: editdescription,
  };
  const handleEdit = async () => {
    let mounted = true;
    try {
      const response = await axios.put(`/v1/todos/${id}`, EditData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": `${token}`,
        },
      });
      if (response) {
        history.push("/TaskListScreen");
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      mounted = false;
    };
  };

  return (
    <section>
      <div className="contaoner">
        <div className="row">
          <div className="col-12">
            <div className="detail_container">
              <h2>Deatils Screen</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Delete</th>
                    <th>Edit</th>
                    <th>Back</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{title}</td>
                    <td>{description}</td>
                    <td>
                      <button onClick={handleOpenAlert} className="delete">
                        <DeleteIcon />
                      </button>
                    </td>
                    <td>
                      <button onClick={handleOpen} className="edit">
                        <EditIcon />
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => history.push("/TaskListScreen")}
                        className="edit"
                        style={{ fontSize: "16px" }}
                      >
                        Back
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="edit_container">
            <h3>Edit Todo List</h3>
            <div className="input_wrapper">
              <label>Title</label>
              <input
                type="text"
                value={edittitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="input_wrapper">
              <label>Description</label>
              <input
                type="text"
                value={editdescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </div>
            <div className="button_wrapper">
              <button
                onClick={() => {
                  handleEdit();
                  handleClose();
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </Box>
      </Modal>

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
              handleDelete();
              handleCloseAlert();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default DetailScreen;
