import React from 'react';

export default function useRefDimensions() {
  const [node, setNode] = React.useState();
  const [refDimensions, setRefDimensions] = React.useState({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const ref = React.useCallback((n) => {
    if (n !== null) {
      setRefDimensions(n.getBoundingClientRect());
      setNode(n);
    }
  }, []);

  return [ref, refDimensions, node];
}
