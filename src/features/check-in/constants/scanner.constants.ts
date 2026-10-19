import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const SCAN_FRAME_SIZE = width * 0.68;
export const SCAN_CORNER_RADIUS = 32;
