import * as React from 'react';
import { useState, useCallback, createContext } from 'react';
import { useEvents } from '../hooks/useEvents';
import { View } from 'react-native';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import { StoriesList } from '../stories/StoriesList';
import type { StoriesListViewModel } from 'react-native-ias';
export const InAppStoryContext = createContext({
  events: [],
  tags: [],
  placeholders: [],
  imagePlaceholders: [],
  lang: '',
  userID: '',
});

export const useInAppStoryContext = function (props) {
  const [test, setTest] = useState(props.test || 'Hello world');
  const [tags, setTags] = useState([]);
  const [placeholders, setPlaceholders] = useState([]);
  const [imagePlaceholders, setImagePlaceholders] = useState();
  const [lang, setLang] = useState('en_US');
  const [userID, setUserID] = useState('en_US');
  const [apiKey, setApiKey] = useState('en_US');
  const [customStoryView, setCustomStoryView] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);

  const toggleTest = useCallback(() => {
    setTest((_test) => (_test === 'Hi' ? 'You are awesome' : 'Hi'));
  }, []);

  return {
    test,
    tags,
    placeholders,
    imagePlaceholders,
    lang,
    userID,
    apiKey,
    setTags,
    setPlaceholders,
    setImagePlaceholders,
    setLang,
    setUserID,
    setApiKey,
    toggleTest,
    customStoryView,
    setCustomStoryView,
    showFavorites,
    setShowFavorites,
  };
};

export const InAppStoryProvider = ({
  children,
  storyManager,
  appearanceManager,
  ...props
}) => {
  const [favoritesOpen, setFavoritesOpen] = useState('default');
  const context = useInAppStoryContext(props);
  const onFavoriteCell = (feed) => {
    setFavoritesOpen(feed);
    sheetRef.current.open();
  };
  const sheetRef = React.useRef<BottomSheetMethods>({ open: () => {} });
  const onLoadEnd = () => {};
  const onLoadStart = () => {};
  const storiesListViewModel = React.useRef<StoriesListViewModel>();
  const viewModelExporter = useCallback(
    (viewModel: StoriesListViewModel) =>
      (storiesListViewModel.current = viewModel),
    []
  );
  React.useEffect(() => {
    console.log('uno iascontext');
  }, []);
  const { events, feeds, readerOpen } = useEvents({ onFavoriteCell });
  return (
    <InAppStoryContext.Provider
      value={{ ...context, events, feeds, readerOpen, onFavoriteCell }}
    >
      {children}
      <BottomSheet ref={sheetRef}>
        <View style={{ paddingHorizontal: 10 }}>
          {!!favoritesOpen && (
            <StoriesList
              feed={favoritesOpen}
              favoritesOnly={true}
              storyManager={storyManager}
              appearanceManager={appearanceManager}
              onLoadEnd={onLoadEnd}
              onLoadStart={onLoadStart}
              viewModelExporter={viewModelExporter}
            />
          )}
        </View>
      </BottomSheet>
    </InAppStoryContext.Provider>
  );
};

export function useInAppStory() {
  const context = React.useContext(InAppStoryContext);
  if (!context) throw new Error('Use app context within provider!');
  return context;
}