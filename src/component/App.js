import React from "react";
import Display from "./Display";
import ButtonPanel from "./ButtonPanel";
import calculate from "../logic/calculate";
import { validKeys } from "./ValidKeys";
import "./App.css";

export default class App extends React.Component {
  state = {
    total: null,
    next: null,
    operation: null,
    higherOrder: {
      next: null,
      operation: null,
    },
  };

  handleClick = buttonName => {
    this.setState(calculate(this.state, buttonName));
  };

  // ISSUE #55 doesn't support key presses
  handleKeyPress = keyEvent => {
    const key = validKeys.find(k => k.charCode === keyEvent.charCode);
    if (key) {
      this.setState(calculate(this.state, key.name));
    }
  };

  render() {
    return (
      <div
        tabIndex="0"
        onKeyPress={this.handleKeyPress}
        className="component-app"
      >
        <Display value={this.state.next || this.state.total || "0"} />
        <ButtonPanel clickHandler={this.handleClick} />
      </div>
    );
  }
}
