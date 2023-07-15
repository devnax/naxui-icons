import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from 'naxui-manager';
import HomeIcon from './src/filled/Home'

const App = () => {
  return (
    <ThemeProvider>
      <HomeIcon color="primary" />
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
