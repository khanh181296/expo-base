import { Text as RNText, type TextProps as RNTextProps } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

export const textVariants = tv({
  base: 'text-foreground',
  variants: {
    variant: {
      h1: 'text-3xl font-bold',
      h2: 'text-2xl font-bold',
      h3: 'text-lg font-semibold',
      body: 'text-base',
      label: 'text-sm font-medium',
      caption: 'text-xs',
    },
    tone: {
      default: '',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      destructive: 'text-destructive',
      inverse: 'text-primary-foreground',
    },
  },
  defaultVariants: { variant: 'body', tone: 'default' },
})

export type TextProps = RNTextProps & VariantProps<typeof textVariants> & { className?: string }

export function Text({ variant, tone, className, ...props }: TextProps) {
  return <RNText className={cn(textVariants({ variant, tone }), className)} {...props} />
}
