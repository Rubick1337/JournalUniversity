import React from 'react';
import LoginPage from '../src/pages/LoginPage';
import { Provider } from 'react-redux';
import store from './store/store'
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <LoginPage />
      </div>
    </Provider>

  );
}

export default App;