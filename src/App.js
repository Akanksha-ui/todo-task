import logo from './logo.svg';
import './App.css';
import Login from './Login';
import AddTask from './pages/AddTask/AddTask';
import DetailScreen from './pages/DetailScreen/DetailScreen';
import TaskListScreen from './pages/TaskListScreen/TaskListScreen';
import { Switch, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path='/Login' component={Login} />
        <Route exact path='/AddTask' component={AddTask} />
        <Route exact path='/DetailScreen' component={DetailScreen} />
        <Route exact path='/TaskListScreen' component={TaskListScreen} />
      </Switch>
    </div>
  );
}

export default App;
