import React from 'react';
import { Parse } from 'parse';
import Navigation from './components/Navigation';
import store from './redux/store';
import { setMeAction } from './redux/actions';

import './App.css';

class App extends React.Component {
  async componentDidMount() {
    const user = await Parse.User.currentAsync();
    console.log(Parse.User);
    if (user != null) {
      // Make sure we don't have stale data in local storage by refreshing
      // TODO is there a better way to refresh?
      const refreshUser = await new Parse.Query(Parse.User)
        .equalTo('objectId', user.id)
        .first();
      store.dispatch(setMeAction(refreshUser));
    }
  }

  render() {
    return (
      <Navigation />
    );
  }
}

export default App;
