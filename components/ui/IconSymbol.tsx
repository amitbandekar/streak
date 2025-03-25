import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

const MAPPING = {
  'house.fill': { name: 'home', type: 'Material' },
  'paperplane.fill': { name: 'send', type: 'Material' },
  'chevron.left.forwardslash.chevron.right': { name: 'code', type: 'Material' },
  'chevron.right': { name: 'chevron-right', type: 'Material' },
  'gearshape.fill': { name: 'settings', type: 'Feather' }, // Using Feather icon now
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    { name: string; type: 'Material' | 'Feather' }
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const icon = MAPPING[name];

  if (!icon) return null;

  if (icon.type === 'Material') {
    return <MaterialIcons name={icon.name} size={size} color={color} style={style} />;
  } else if (icon.type === 'Feather') {
    return <Feather name={icon.name} size={size} color={color} style={style} />;
  }

  return null;
}
