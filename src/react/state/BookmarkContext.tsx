import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type BookmarkContextValue = Readonly<{
  bookmarkIds: readonly string[];
  isBookmarked: (evidenceId: string) => boolean;
  toggleBookmark: (evidenceId: string) => void;
}>;

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

type BookmarkProviderProps = Readonly<{
  bookmarkIds: readonly string[];
  onToggleBookmark: (evidenceId: string) => void;
  children: ReactNode;
}>;

export function BookmarkProvider({
  bookmarkIds,
  onToggleBookmark,
  children,
}: BookmarkProviderProps) {
  const isBookmarked = useCallback(
    (evidenceId: string) => bookmarkIds.includes(evidenceId),
    [bookmarkIds],
  );

  const value = useMemo<BookmarkContextValue>(
    () => ({
      bookmarkIds,
      isBookmarked,
      toggleBookmark: onToggleBookmark,
    }),
    [bookmarkIds, isBookmarked, onToggleBookmark],
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmarks must be used inside BookmarkProvider");
  }

  return context;
}
