import { View } from 'react-native'

import { Skeleton } from '@/components/ui'

export function NotesSkeleton() {
  return (
    <View className="gap-3 p-4">
      {Array.from({ length: 6 }, (_, index) => (
        <View key={index} className="gap-2 rounded-lg border border-border p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </View>
      ))}
    </View>
  )
}
