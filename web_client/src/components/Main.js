import React from 'react';
import ChatPane from './ChatPane';

import './styles/Main.css';

/* eslint-disable react/prefer-stateless-function */
class Main extends React.Component {
  render() {
    return (
      <div className="main">
        <ChatPane roomID="coinflip" />
        <div>
          <h2>
            Welcome to the Home Page, you greasy degenerate!
          </h2>
        </div>
      </div>
    );
  }
}

export default Main;
