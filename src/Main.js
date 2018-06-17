import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import Practice from "./Practice";
import Currency from "./Currency";
import Sector from "./Sector";

import logo from './logo.svg';

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>Emoji Stock Market Visualiser</h1>
		   <img src={logo} className="App-logo" alt="logo" />
          <ul className="header">
			  <li><NavLink exact to="/">Home</NavLink></li>
			  <li><NavLink to="/Practice">Practice</NavLink></li>
        <li><NavLink to="/Currency">Currency</NavLink></li>
        <li><NavLink to="/Sector">Sector</NavLink></li>
          </ul>
          <div className="content">
			  <Route exact path="/" component={Home}/>
			  <Route path="/Practice" component={Practice}/>
        <Route path="/Currency" component={Currency}/>
        <Route path="/Sector" component={Sector}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;


/* template from :
	https://www.kirupa.com/react/creating_single_page_app_react_using_react_router.htm
*/
