import React from "react";
import ReactDOM from "react-dom";
import './App.css';
import {initializeEvents, reducer, saga, Top} from './top/top'
import {Provider} from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import {applyMiddleware, compose, createStore} from 'redux'
import {createBrowserHistory} from 'history';
import createEnvironment from './environment/environment';

import reportWebVitals from "./reportWebVitals";
import { call, fork, put, take, spawn } from "redux-saga/effects";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const App = (props) => (
  <div className={"App"}>
    <Provider store={props.store}>
      <Top />
    </Provider>
  </div>
);

const renderReact = (component, target) =>
  new Promise((resolve) => ReactDOM.render(component, target, resolve));
const getElementById = (id) => document.getElementById(id);

// I like to use redux sagas to drive the toplevel of the application
// for three reasons:
//
// 1. toplevel side effects in JS files always feel like a code smell:
// importing a javascript file shouldn't really "do" anything, besides
// making a bunch of definitions available: this helps keep the
// control flow of application initialization clear.
//
// 2. Making redux-sagas your "toplevel" allows you to test that react
// renders the right component to the right DOM element (see lines
// 77-85)
//
// 3. This toplevel is now testable: you iterate over the values the
// generator generates and assert that they're equal to your expected
// redux-saga effects. This looks something like (the insights
// frontend application had a testing utility that made this nicer):
//
// import {createBrowserHistory} from "...";
//
// describe("toplevelSaga", () => {
//   test("creates a browser history", () => {
//     const saga = toplevelSaga('sentinel store')();
//     const {historyEffect, done} = saga.next();
//     expect(historyEffect).toEqual(call(createBrowserHistory));
//     expect(done).toBeFalsey();
//     saga.send('sentinel history');
//
//     const {createEnvironmentEffect, done} = saga.next();
//     expect(createEnvironmentEffect)
//       .toEqual(call(createEnvironment, {fetch, 'sentinel history}));
//     expect(done).toBeFalsey();
//     ...
//  }
// }
const toplevelSaga = (store) =>
  function* () {
    const history = yield call(createBrowserHistory);

    const environment = yield call(createEnvironment, {
      fetch,
      history,
    });

    yield fork(saga(environment));

    for (let event of initializeEvents) {
      yield put(event);
    }

    const target = yield call(getElementById, "root");

    yield call(
      renderReact,
      <React.StrictMode>
        <App store={store} />
      </React.StrictMode>,
      target
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    yield call(reportWebVitals);
  };

const toplevel = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    reducer,
    {},
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(toplevelSaga(store));
};

export default toplevel;
