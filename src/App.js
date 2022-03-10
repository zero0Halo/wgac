import {useMemo} from 'react';
import useRefDimensions from "./useRefDimensions";
import styled, { css, keyframes } from 'styled-components';

const StyledApp = styled('div')`
  min-height: 100vh;
  padding: 0;
`;

const slideIn = keyframes`
    from {
      transform: translateY(0%);
    }

    to {
      transform: translateY(100vh);
    }
`;

const StyledPooLine = styled('div')`
  ${({lineWidth}) => css`
    font-size: ${lineWidth * 0.75}px;
    width: ${lineWidth}px;
  `}
  height: auto;
  left: ${({leftPosition}) => leftPosition}px;
  overflow: hidden;
  position: absolute;
  top: ${({topPosition}) => topPosition}px;
  animation-duration: ${({animationSpeed}) => animationSpeed}s;
  animation-fill-mode: forwards;
  animation-name: ${slideIn};
  animation-timing-function: linear;
`;

export default function App() {
  const emoji = '💩 💩 💩 💩 💩 💩 💩 💩 ';
  const lineWidthBase = 32;
  const lineVariance = 8;
  const [appRef, appRefDimensions, node] = useRefDimensions();

  const waterfallData = useMemo(() => {
    if (node) {
      const numOfColumns = Math.floor(appRefDimensions.width / lineWidthBase);
      const data = [...new Array(Math.floor(numOfColumns))].map((_, i) => ({
        animationSpeed: Math.random() * lineWidthBase + lineVariance,
        leftPosition: Math.random() * (appRefDimensions.width + lineWidthBase),
        lineWidth: Math.random() * (lineWidthBase + lineVariance) + (lineWidthBase / 2),
        topPosition: Math.random() * (lineWidthBase * lineVariance),
      }));

      return data;
    }
    return [];

  }, [appRefDimensions.width, node])

  return (
    <StyledApp ref={appRef}>
      {waterfallData.map((data, i) => (
        <StyledPooLine key={`line-${i}`} {...data}>
          {emoji}
        </StyledPooLine>
      ))}

    </StyledApp>
  )
}
