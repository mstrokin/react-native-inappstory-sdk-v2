/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import { NativeEventEmitter, NativeModules } from 'react-native';
import { useStore } from './useStore';

export const useEvents = ({ onFavoriteCell }) => {
  const addEvent = useStore((state) => state.addEvent);
  const addToFeed = useStore((state) => state.addToFeed);
  const replaceInFeed = useStore((state) => state.replaceInFeed);
  const setFavorite = useStore((state) => state.setFavorite);
  const [readerOpen, setReaderOpen] = React.useState<any>(false);
  const imageCoverCache = React.useRef<any>({});
  const videoCoverCache = React.useRef<any>({});

  React.useEffect(() => {
    console.log('set Listeners');
    const eventEmitter = new NativeEventEmitter(
      NativeModules.RNInAppStorySDKModule
    );
    let eventListeners = [];
    const storiesEvents = [
      'storiesLoaded',
      'ugcStoriesLoaded',
      'clickOnStory',
      'showStory',
      'closeStory',
      'clickOnButton',
      'showSlide',
      'likeStory',
      'dislikeStory',
      'favoriteStory',
      'clickOnShareStory',
      'storyWidgetEvent',
    ];
    const gameEvents = [
      'startGame',
      'finishGame',
      'closeGame',
      'eventGame',
      'gameFailure',
      'gameReaderWillShow',
      'gameReaderDidClose',
      'gameComplete',
    ];
    const storyListEvents = [
      'storyListUpdate',
      'storyUpdate',
      'favoritesUpdate',
    ];
    const goodsEvents = ['getGoodsObject'];
    const systemEvents = [
      'storyReaderWillShow',
      'storyReaderDidClose',
      'sessionFailure',
      'storyFailure',
      'currentStoryFailure',
      'networkFailure',
      'requestFailure',
      'favoriteCellDidSelect',
      'editorCellDidSelect',
      'customShare',
      'onActionWith',
      'storiesDidUpdated',
      'goodItemSelected',
      'favoritesUpdate',
      'scrollUpdate',
    ];
    [
      ...storiesEvents,
      ...gameEvents,
      ...storyListEvents,
      ...goodsEvents,
      ...systemEvents,
    ].forEach((eventName) => {
      eventListeners.push(
        eventEmitter.addListener(eventName, (event) => {
          console.log('event:', eventName);
          //if (!event.length) return;
          if (eventName == 'storyReaderWillShow') {
            setReaderOpen(true);
          }
          if (eventName == 'storyReaderDidClose' || eventName == 'closeStory') {
            setReaderOpen(false);
          }
          if (eventName == 'getGoodsObject') {
            //setLoading(true)
            //FIXME: storyManager.fetchGoods(event);
          }
          if (eventName == 'favoriteCellDidSelect') {
            onFavoriteCell();
          }
          if (eventName == 'favoriteStory') {
            setFavorite(event.storyID, event.favorite);
          }
          if (eventName == 'storyListUpdate') {
            const feedName = event.feed + '_' + event.list;
            event.stories.map((story) => {
              addToFeed(feedName, {
                ...story,
                coverImagePath:
                  imageCoverCache.current[story.storyID] ||
                  story.coverImagePath,
                coverVideoPath:
                  videoCoverCache.current[story.storyID] ||
                  story.coverVideoPath,
              });
            });
          }
          if (eventName == 'storyUpdate') {
            const feedName = event.feed + '_' + event.list;
            if (event.coverImagePath) {
              imageCoverCache.current[event.storyID] = event.coverImagePath;
            }
            if (event.coverVideoPath) {
              videoCoverCache.current[event.storyID] = event.coverVideoPath;
            }
            replaceInFeed(feedName, event);
          }
          addEvent({
            event: eventName,
            data: event,
            time: +Date.now(),
          });
        })
      );
    });
    // Removes the listener once unmounted
    return () => {
      eventListeners.forEach((eventListener) => {
        eventListener.remove();
      });
    };
  }, []);
  return { readerOpen, onFavoriteCell };
};
