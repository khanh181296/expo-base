import { Link, type LinkProps } from 'expo-router'

import { cn } from '@/lib/utils'

export type TextLinkProps = Omit<LinkProps, 'className'> & { className?: string }

export function TextLink({ className, ...props }: TextLinkProps) {
  return <Link className={cn('text-sm font-semibold text-primary', className)} {...props} />
}
