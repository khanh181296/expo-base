import type { LucideIcon } from 'lucide-react-native'
import { Pressable, type PressableProps, View } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

import type { ColorToken } from '@/lib/theme'
import { cn } from '@/lib/utils'

import { Icon } from './icon'
import { Spinner } from './spinner'
import { Text } from './text'

const buttonVariants = tv({
  slots: {
    container: 'flex-row items-center justify-center gap-2 rounded active:opacity-80',
    label: 'font-semibold',
  },
  variants: {
    variant: {
      primary: { container: 'bg-primary', label: 'text-primary-foreground' },
      secondary: { container: 'bg-secondary', label: 'text-secondary-foreground' },
      outline: { container: 'border border-border bg-transparent', label: 'text-foreground' },
      ghost: { container: 'bg-transparent', label: 'text-foreground' },
      destructive: { container: 'bg-destructive', label: 'text-destructive-foreground' },
    },
    size: {
      sm: { container: 'h-9 px-3', label: 'text-sm' },
      md: { container: 'h-12 px-4', label: 'text-base' },
      lg: { container: 'h-14 px-6', label: 'text-lg' },
    },
    disabled: {
      true: { container: 'opacity-50' },
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

const CONTENT_COLOR: Record<NonNullable<ButtonVariants['variant']>, ColorToken> = {
  primary: 'primary-foreground',
  secondary: 'secondary-foreground',
  outline: 'foreground',
  ghost: 'foreground',
  destructive: 'destructive-foreground',
}

type ButtonVariants = VariantProps<typeof buttonVariants>

export type ButtonProps = Omit<PressableProps, 'children'> &
  Omit<ButtonVariants, 'disabled'> & {
    label: string
    loading?: boolean
    icon?: LucideIcon
    className?: string
  }

export function Button({
  label,
  variant = 'primary',
  size,
  loading = false,
  disabled,
  icon,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading)
  const styles = buttonVariants({ variant, size, disabled: isDisabled })
  const contentColor = CONTENT_COLOR[variant]

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(styles.container(), className)}
      {...props}
    >
      {loading ? (
        <Spinner size="small" color={contentColor} />
      ) : (
        icon && (
          <View>
            <Icon as={icon} size={18} color={contentColor} />
          </View>
        )
      )}
      <Text className={styles.label()}>{label}</Text>
    </Pressable>
  )
}
