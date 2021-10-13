import './App.css';
import Main from './view/Main';
import { BrowserRouter, Route} from 'react-router-dom';
import NewsList from "./view/NewsList";

function App() {
  return (
      <BrowserRouter basename = '/'>
          <Route exact path = '/' component = {Main}></Route>
          <Route path = '/list' component = {NewsList}></Route>
      </BrowserRouter>
  );
}

export default App;
