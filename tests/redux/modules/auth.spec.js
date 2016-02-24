import { polyfill } from 'es6-promise'; polyfill()

import {
  STORAGE_KEY,
  login,
  logout,
  requestLogin,
  requestLogout,
  receiveTokens,
  receiveErrors,
  default as authReducer
} from 'redux/modules/auth'

import hdviet from 'redux/utils/hdviet'

describe('(Redux Module) Auth', () => {
  describe('(Reducer)', () => {
    beforeEach(() => {
      localStorage.removeItem(STORAGE_KEY)
    })

    it('Should be a function.', () => {
      expect(authReducer).to.be.a('function')
    })

    it('Should initialize with a default state.', () => {
      const initState = authReducer(undefined, {})
      expect(initState).to.deep.equal({
        hasError: false,
        error: {},
        isFetching: false,
        isAuthenticated: false,
        creds: {}
      })
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = authReducer(undefined, {})
      state = authReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal({
        hasError: false,
        error: {},
        isFetching: false,
        isAuthenticated: false,
        creds: {}
      })
      state = authReducer(state, requestLogin())
      expect(state).to.deep.equal({
        hasError: false,
        error: {},
        isFetching: true,
        isAuthenticated: false,
        creds: {}
      })
      state = authReducer(state, { type: '@@@@@@@' })
      expect(state).to.deep.equal({
        hasError: false,
        error: {},
        isFetching: true,
        isAuthenticated: false,
        creds: {}
      })
    })
  })

  describe('(Action Creator) login', function () {
    let _globalState
    let _dispatchSpy
    let _getStateSpy

    afterEach(function () {
      localStorage.removeItem(STORAGE_KEY)
    })

    beforeEach(function () {
      _globalState = {
        auth: authReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          auth: authReducer(_globalState.auth, action)
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    it('Should be exported as a function.', function () {
      expect(login).to.be.a('function')
    })

    it('Should return a function (is a thunk).', function () {
      expect(login()).to.be.a('function')
    })

    it('Should call dispatch and getState exactly once.', function () {
      const p = new Promise((resolve, reject) => {})
      const stub = sinon.stub(hdviet, 'login').returns(p)
      login('e', 'p')(_dispatchSpy, _getStateSpy)
      expect(_dispatchSpy.calledOnce).to.be.true
      stub.restore()
    })

    it('Should dispatch requestLogin() and dispatch receiveTokens()', async function () {
      const p = new Promise((resolve, reject) => {
        resolve({
          ok: true
        })
      })
      const stub = sinon.stub(hdviet, 'login').returns(p)
      const dispatchSpy = sinon.spy()
      await login('e', 'p')(dispatchSpy, _getStateSpy)
      const action1 = dispatchSpy.getCall(0).args[0]
      const action2 = dispatchSpy.getCall(1).args[0]

      expect(action1).to.deep.equal(requestLogin())
      expect(action2).to.deep.equal(receiveTokens({ ok: true }))
      stub.restore()
    })

    it('Should dispatch requestLogin() and dispatch receiveErrors()', async function () {
      const p = new Promise((resolve, reject) => {
        reject(new Error('Login Failed'))
      })
      const stub = sinon.stub(hdviet, 'login').returns(p)
      const dispatchSpy = sinon.spy()
      await login('e', 'p')(dispatchSpy, _getStateSpy)
      const action1 = dispatchSpy.getCall(0).args[0]
      const action2 = dispatchSpy.getCall(1).args[0]

      expect(action1).to.deep.equal(requestLogin())
      expect(action2).to.deep.equal(receiveErrors(new Error('Login Failed')))
      stub.restore()
    })
  })

  describe('(Action Creator) logout', function () {
    let _globalState
    let _dispatchSpy

    beforeEach(function () {
      _globalState = {
        auth: authReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          auth: authReducer(_globalState.auth, action)
        }
      })
    })

    it('Should be exported as a function.', function () {
      expect(logout).to.be.a('function')
    })

    it('Should return a function (is a thunk).', function () {
      expect(logout()).to.be.a('function')
    })

    it('Should call dispatch exactly once.', function () {
      logout()(_dispatchSpy)
      expect(_dispatchSpy.calledOnce).to.be.true
    })

    it('Should dispatch requestLogout()', async function () {
      const dispatchSpy = sinon.spy()
      await logout()(dispatchSpy)
      const action = dispatchSpy.getCall(0).args[0]

      expect(action).to.deep.equal(requestLogout())
    })
  })

  // NOTE: if you have a more complex state, you will probably want to verify
  // that you did not mutate the state. In this case our state is just a number
  // (which cannot be mutated).
  describe('(Action Handler) LOGIN', function () {
    it('Should indicate that isFetching is true', function () {
      const state = authReducer(undefined, {})
      expect(state.isFetching).to.be.false
      const newState = authReducer(state, requestLogin())
      expect(newState.isFetching).to.be.true
      expect(newState).to.not.equal(state)
    })
  })
})
