import React from 'react'
import { mount, shallow } from 'enzyme'
import * as authService from 'services/authService'
import { reports } from '../__mocks___/response.data'
import Login from "@/views/auth/Login'
const CLIENT_URL = process.env.REACT_APP_CLIENT_URL
describe('login :', () => {
  const props = {
    match: {
      url: CLIENT_URL
    },
  }
  it('renders without crashing', () => {
    
  })
})