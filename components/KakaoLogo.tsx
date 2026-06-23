import Svg, { Path } from 'react-native-svg';

export default function KakaoLogo({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#000000"
        d="M12 3C6.477 3 2 6.925 2 11.785c0 3.133 1.87 5.88 4.688 7.451L5.6 22.413a.4.4 0 0 0 .573.44l4.353-2.869c.47.065.953.1 1.474.1 5.523 0 10-3.925 10-8.299C22 6.925 17.523 3 12 3z"
      />
    </Svg>
  );
}
