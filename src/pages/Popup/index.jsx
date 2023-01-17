import React from 'react'
import { render } from 'react-dom'

import Popup from './Popup'
import './index.css'
import AppContainer from '../../containers/AppContainer'

render(
  <AppContainer>
    <Popup />
  </AppContainer>,
  window.document.querySelector('#app-container')
)

if (module.hot) module.hot.accept()
