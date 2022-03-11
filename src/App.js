import { useState } from 'react';
import useRefDimensions from './useRefDimensions';
import useTimer, { ACTIONS } from './useTimer';
import useWaterfallState from './useWaterfallState';
import styled, { css, keyframes } from 'styled-components';

const StyledApp = styled('div')`
  min-height: 100vh;
  padding: 0;
  position: relative;
`;

const slideIn = keyframes`
    0% { transform: translateY(-30vh); opacity: 0; }
    10% { opacity: 0.9; }
    100% { opacity: 0; transform: translateY(100vh); }
`;

const StyledStartButton = styled('button').attrs({ type: 'button'})`
  border: solid rgb(0, 155, 0) 2px;
  background-color: #333;
  box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.5);
  color: #eee;
  cursor: pointer;
  font-family: Courier;
  font-size: 2rem;
  font-weight: bold;
  left: 50%;
  padding: 0.5rem 2rem;
  position: fixed;
  top: 50%;
  transform: translate3D(-50%, -50%, 0);
  transition: all 1s;
  width: 25rem;
  z-index: 1;

  &:hover {
    border-color: rgb(0, 255, 0);
  }

  ${({ timerRunning }) => timerRunning && css`
    font-size: 1rem;
    width: 12.5rem;
    top: 95%;
    left: 5%;
  `}
`;

const StyledEmojiLine = styled('div')`
  ${({lineWidth}) => css`
    font-size: ${lineWidth * 0.75}px;
    width: ${lineWidth}px;
  `}
  filter: hue-rotate(80deg);
  height: auto;
  left: ${({leftPosition}) => leftPosition}px;
  overflow: hidden;
  position: absolute;
  text-shadow: 0px 0px 8px rgb(0, 255, 0);
  top: ${({topPosition}) => topPosition}px;

  animation-duration: ${({animationSpeed}) => animationSpeed}s;
  animation-fill-mode: forwards;
  animation-name: ${slideIn};
  animation-timing-function: linear;
  z-index: 0;
`;

export default function App() {
  const emoji = '💩';
  const lineWidthBase = 32;
  const lineVariance = 8;
  const [runMatrix, setRunMatrix] = useState(false);
  const [appRef, appRefDimensions] = useRefDimensions();
  const [data, addLineData] = useWaterfallState({ pageWidth: appRefDimensions.width, lineVariance, lineWidthBase });
  const { timerDispatch, timerRunning } = useTimer({
    autoStart: false,
    autoRestart: true,
    callback: () => new Promise((resolve) => { addLineData(); resolve(); }),
    callbackImmediately: false,
    duration: 4,
  });

  const handleClick = () => {
    if (!runMatrix) {
      setRunMatrix(true);
      timerDispatch({ type: ACTIONS.START_TIMER, payload: 4 });
    } else if (timerRunning) {
      timerDispatch({ type: ACTIONS.STOP_TIMER });
    } else {
      timerDispatch({ type: ACTIONS.START_TIMER, payload: 4 });
    }
  }

  return (
    <StyledApp ref={appRef}>
      <StyledStartButton onClick={handleClick} timerRunning={timerRunning}>{!timerRunning ? 'Enter the Matrix' : '...nevermind.'}</StyledStartButton>

      {runMatrix && data.map(({emojiCount, ...data}, i) => (
        <StyledEmojiLine {...data}>
          {[...new Array(emojiCount)].map(() => emoji).join(' ')}
        </StyledEmojiLine>
      ))}

    </StyledApp>
  )
}
