import { useState } from 'react';
import useRefDimensions from "./useRefDimensions";
import useTimer, { ACTIONS } from "./useTimer";
import useWaterfallState from "./useWaterfallState";
import styled, { css, keyframes } from 'styled-components';

const StyledApp = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 0;
`;

const slideIn = keyframes`
    0% { transform: translateY(-10vh); opacity: 0; }
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
  padding: 0.5rem 2rem;
  position: relative;
  transition: all 250ms;
  z-index: 1;

  &:hover {
    border-color: rgb(0, 255, 0);
  }
`;

const StyledPooLine = styled('div')`
  ${({lineWidth}) => css`
    font-size: ${lineWidth * 0.75}px;
    width: ${lineWidth}px;
  `}
  filter: hue-rotate(80deg);
  height: auto;
  left: ${({leftPosition}) => leftPosition}px;
  overflow: hidden;
  position: absolute;
  text-shadow: 0px 0px 5px rgb(0, 255, 0);
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
  const { timerDispatch } = useTimer({
    autoStart: false,
    autoRestart: true,
    callback: () => new Promise((resolve) => { addLineData(); resolve(); }),
    callbackImmediately: false,
    duration: 4,
  });

  const handleClick = () => {
    if (runMatrix) {
      setRunMatrix(false);
      timerDispatch({ type: ACTIONS.STOP_TIMER });
    } else {
      setRunMatrix(true);
      timerDispatch({ type: ACTIONS.START_TIMER, payload: 4 });
    }
  }

  return (
    <StyledApp ref={appRef}>
      <StyledStartButton onClick={handleClick}>{runMatrix ? 'Nevermind...' : 'Enter the Matrix'}</StyledStartButton>

      {/* I know, the key isn't really unique despite what we talked about in the interview. */}
      {runMatrix && data.map(({emojiCount, ...data}, i) => (
        <StyledPooLine key={`line-${i}`} {...data}>
          {[...new Array(emojiCount)].map(() => emoji).join(' ')}
        </StyledPooLine>
      ))}

    </StyledApp>
  )
}
