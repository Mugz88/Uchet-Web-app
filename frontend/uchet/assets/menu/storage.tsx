import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const StorageIcon = () => (
  <Svg width={24} height={24} fill="none">
    <Rect
      x={3}
      y={4}
      width={18}
      height={4}
      rx={1}
      stroke="#AFB2BF"
      strokeWidth={1.5}
    />
    <Rect
      x={3}
      y={10}
      width={18}
      height={4}
      rx={1}
      stroke="#AFB2BF"
      strokeWidth={1.5}
    />
    <Rect
      x={3}
      y={16}
      width={18}
      height={4}
      rx={1}
      stroke="#AFB2BF"
      strokeWidth={1.5}
    />
  </Svg>
);

export default StorageIcon;
