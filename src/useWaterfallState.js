import { useCallback, useEffect, useState } from 'react';

export default function useWaterfallState({ pageWidth, lineWidthBase, lineVariance }) {
  const [data, setData] = useState([]);

  const createLineData = useCallback(() => ({
    animationSpeed: Math.random() * lineWidthBase + lineVariance,
    leftPosition: Math.random() * (pageWidth + lineWidthBase),
    lineWidth: Math.random() * (lineWidthBase + lineVariance) + (lineWidthBase / 2),
    emojiCount: Math.floor(Math.random() * lineVariance + (lineVariance / 2)),
    topPosition: Math.random() * (lineWidthBase * lineVariance),
  }),[lineVariance, lineWidthBase, pageWidth]);

  const addLineData = useCallback(() => {
    console.log('fired')
    setData((prevData) => {
      for (let a = 0; a < lineVariance; a++) {
        prevData.push(createLineData());
      }
      return prevData;
    })
  }, [createLineData, lineVariance]);

  const regenerateData = useCallback(() => {
    setData([]);
  }, [])

  useEffect(() => {
    if (!data.length && pageWidth) {
      const numOfColumns = Math.floor(pageWidth / lineWidthBase / 2);
      const initialData = [...new Array(Math.floor(numOfColumns))].map(() => createLineData());
      setData(initialData);
    }
  }, [createLineData, data.length, lineWidthBase, pageWidth]);

  return [data, addLineData, regenerateData];
}