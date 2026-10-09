import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { NotebookPen, Plus } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Pressable, RefreshControl, View } from 'react-native'

import { EmptyState, ErrorState, Icon, Spinner } from '@/components/ui'
import { useThemeColors } from '@/lib/theme'

import { useNotes } from '../hooks'
import { NoteCard } from './note-card'
import { NotesSkeleton } from './notes-skeleton'

export function NotesList() {
  const { t } = useTranslation()
  const { colors } = useThemeColors()
  const query = useNotes()
  const openNew = () => router.push('/notes/new')

  if (query.isPending) return <NotesSkeleton />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />

  return (
    <View className="flex-1">
      <FlashList
        data={query.data.notes}
        keyExtractor={(note) => note.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <NoteCard note={item} onPress={() => router.push(`/notes/${item.id}`)} />
        )}
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage()
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching && !query.isFetchingNextPage}
            onRefresh={() => query.refetch()}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={NotebookPen}
            title={t('notes.emptyTitle')}
            description={t('notes.emptyDescription')}
            actionLabel={t('notes.create')}
            onAction={openNew}
          />
        }
        ListFooterComponent={query.isFetchingNextPage ? <Spinner className="py-4" /> : null}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('notes.create')}
        onPress={openNew}
        className="absolute bottom-6 right-6 size-14 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-80"
      >
        <Icon as={Plus} size={26} color="primary-foreground" />
      </Pressable>
    </View>
  )
}
