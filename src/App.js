import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
const Login = React.lazy(() => import('./views/login'));
const Page404 = React.lazy(() => import('./views/page400'));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route
                exact
                path="/login"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
              <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} />
            </Switch>
          </React.Suspense>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
