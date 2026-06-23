import Svg, { Path, Rect } from 'react-native-svg';

export default function NaverLogo({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect width="24" height="24" rx="4" fill="#03C75A" />
      <Path
        fill="#FFFFFF"
        d="M13.55 12.27L10.24 7H7v10h3.45v-5.27L13.76 17H17V7h-3.45z"
      />
    </Svg>
  );
}
