import { useState } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";

const TaskList = (props) => {
  const { title, id, description, done } = props;
  return (
    <tr>
      <td className='check'>
        <label>
          <input
            type="checkbox"
            checked={done === true ? true : false}
            onChange={() => {
              props?.handleDoneTodo(id);
            }}
          />
          <span></span>
        </label>
      </td>
      <td>
        <Link
          to={{
            pathname: "/DetailScreen",
            state: {
              title: title,
              id: id,
              description: description,
            },
          }}
          className="todo_title"
        >
          {title}
        </Link>
      </td>
    </tr>
  );
};

export default TaskList;
