import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const DocsIcon = () => (
  <Svg width={24} height={24} fill="none">
    <Rect
      x={5}
      y={3}
      width={14}
      height={18}
      rx={2}
      stroke="#AFB2BF"
      strokeWidth={1.5}
    />
    <Path
      d="M8 7h8M8 11h8M8 15h5"
      stroke="#AFB2BF"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export default DocsIcon;
