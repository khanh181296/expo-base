import { Link, type LinkProps } from 'expo-router'
import { Pressable } from 'react-native'

import { Text } from './text'

export type TextLinkProps = Omit<LinkProps, 'className' | 'asChild' | 'children'> & {
  children: React.ReactNode
  className?: string
}

/** Styled link. `asChild` keeps NativeWind styles on native, where Link renders its own Text. */
export function TextLink({ className, children, ...props }: TextLinkProps) {
  return (
    <Link asChild {...props}>
      <Pressable accessibilityRole="link" hitSlop={8} className={className}>
        <Text variant="label" tone="primary" className="font-semibold">
          {children}
        </Text>
      </Pressable>
    </Link>
  )
}
