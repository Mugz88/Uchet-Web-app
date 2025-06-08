import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeIcon = () => (
  <Svg width={24} height={24} fill="none">
    <Path
      stroke="#AFB2BF"
      strokeWidth={1.5}
      d="M3 10.5L12 3l9 7.5M5.25 9v10.5A1.5 1.5 0 0 0 6.75 21h3A1.5 1.5 0 0 0 11.25 19.5V15a1.5 1.5 0 0 1 3 0v4.5A1.5 1.5 0 0 0 15.75 21h3a1.5 1.5 0 0 0 1.5-1.5V9"
    />
  </Svg>
);

export default HomeIcon;