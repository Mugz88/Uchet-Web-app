import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const HistoryIcon = () => (
  <Svg width={24} height={24} fill="none">
    <Circle cx={12} cy={12} r={9} stroke="#AFB2BF" strokeWidth={1.5} />
    <Path
      d="M12 7v5l3 2"
      stroke="#AFB2BF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default HistoryIcon;
