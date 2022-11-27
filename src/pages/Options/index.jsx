import React from 'react';
import { render } from 'react-dom';
import AppContainer from '../../containers/AppContainer';

import Options from './Options';
import './index.css';

render(
  <AppContainer>
    <Options title={'Settings'} />
  </AppContainer>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
