import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header/Header';
import { FilterBar } from './components/FilterBar/FilterBar';
import { PokemonList } from './components/PokemonList/PokemonList';
import { usePokemon } from './hooks/usePokemon';
import { useUrlParams } from './hooks/useUrlParams';
import { getTypes } from './services/api';
import styles from './App.module.css';

function AppContent() {
  const { params, updateParams } = useUrlParams();
  const { pokemon, metadata, loading, error, capture, release, updatingId, maxPage } = usePokemon(params);
  const [types, setTypes] = useState<string[]>([]);
  const { ref, inView } = useInView();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // Store the actual page number we have SUCCESSFULLY loaded or ARE loading
  const requestedPageRef = useRef(params.page);

  // Prevent infinite scroll from triggering immediately on refresh/restore
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only proceed if we aren't already loading, the sentinel is in view,
    // we finished the initial cooldown, and there's more data.
    if (!isInitialLoad && inView && metadata && metadata.hasNext && !loading) {
      // Logic for infinite scroll:
      // We want to avoid "chaining" too many pages at once if the user is at the bottom.
      // A small debounce ensures that the UI has time to render new items
      // before we decide to fetch even more.
      const timer = setTimeout(() => {
        // Re-check conditions after delay
        if (inView && !loading && params.page === metadata.page) {
          const nextPage = metadata.page + 1;

          if (requestedPageRef.current < nextPage) {
            requestedPageRef.current = nextPage;
            updateParams({ page: nextPage });
          }
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timer);
    }
  }, [inView, metadata, loading, isInitialLoad, params.page]);

  // Sync the ref if the page changes from outside (reset, filters, etc.)
  // but ONLY if it's a reset or a major change (page becomes 1)
  useEffect(() => {
    if (params.page === 1) {
      requestedPageRef.current = 1;
    }
  }, [params.page]);

  useEffect(() => {
    getTypes().then(res => {
      if (res.success) setTypes(res.types);
    }).catch(err => console.error("Failed to fetch types", err));
  }, []);

  const handleClearAll = () => {
    updateParams({
      search: '',
      type: undefined,
      sort: 'asc',
      page: 1
    });
  };

  return (
    <div className={styles.appContainer}>

      <Header capturedCount={metadata?.capturedCount || 0} />

      <FilterBar
        types={types}
        selectedType={params.type}
        onTypeChange={(type) => updateParams({ type, page: 1 })}
        search={params.search}
        onSearchChange={(search) => updateParams({ search, page: 1 })}
        sort={params.sort}
        onSortChange={(sort) => updateParams({ sort, page: 1 })}
        limit={params.limit}
        onLimitChange={(limit) => updateParams({ limit, page: 1 })}
        onClearAll={handleClearAll}
      />

      <div className={styles.screenArea}>
        <div className={styles.screenGlare}></div>

        <PokemonList
          pokemon={pokemon}
          loading={loading}
          error={error}
          maxPage={maxPage}
          updatingId={updatingId}
          onCapture={capture}
          onRelease={release}
          onResetPage={() => updateParams({ page: 1 })}
        />

        <div ref={ref} className={styles.scrollTrigger}>
          {loading && pokemon.length > 0 && (
            <div className={styles.loadingMore}>
              LOADING MORE...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
