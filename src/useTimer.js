// TODO: I don't believe this will work outside of the immediate need of this project. It expects
// to be run with a callback function, autoRestart set to true and autoStart set to true. It's a
// decent start though.
import { useCallback, useEffect, useReducer, useRef } from 'react';

export const ACTIONS = {
  PAUSE_TIMER: 'PAUSE_TIMER',
  RESUME_TIMER: 'RESUME_TIMER',
  START_TIMER: 'START_TIMER',
  STOP_TIMER: 'STOP_TIMER',
  UPDATE_COUNT: 'UPDATE_COUNT',
};

const initialState = {
  count: null,
  timerRunning: false,
  timerStopped: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.PAUSE_TIMER:
      return { ...state, timerRunning: false, timerStopped: true };
    case ACTIONS.RESUME_TIMER:
      return { ...state, timerRunning: true, timerStopped: false };
    case ACTIONS.START_TIMER:
      return { count: payload, timerRunning: true, timerStopped: false };
    case ACTIONS.STOP_TIMER:
      return { ...initialState, timerRunning: false, timerStopped: true };
    case ACTIONS.UPDATE_COUNT:
      return { ...state, count: payload };
    default:
      return state;
  }
}

export default function useTimer({
  duration,
  autoRestart = false,
  autoStart = false,
  callback,
  callbackImmediately,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);

  const tick = useCallback(() => {
    timerRef.current = setInterval(() => {
      dispatch({ type: ACTIONS.UPDATE_COUNT, payload: state.count - 1 });
    }, 1000);
  }, [state]);

  useEffect(() => {
    if (isFirstRender.current && autoStart) {
      isFirstRender.current = false;
      if (typeof callback === 'function' && callbackImmediately) {
        (async () => await callback())();
      }
      dispatch({ type: ACTIONS.START_TIMER, payload: duration });
    }

    if (state.count === 0) {
      if (typeof callback === 'function') {
        (async () => await callback())();
      }
      dispatch({ type: autoRestart ? ACTIONS.START_TIMER : ACTIONS.STOP_TIMER, payload: duration });
    }

    if (state.timerRunning) {
      tick();
    }

    return () => clearInterval(timerRef.current);
  }, [
    autoRestart,
    autoStart,
    callback,
    callbackImmediately,
    duration,
    state.count,
    state.timerRunning,
    tick,
  ]);

  return { ...state, timerDispatch: dispatch };
}
