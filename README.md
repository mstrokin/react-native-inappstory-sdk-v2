# react-native-inappstory-sdk

Wrapper for InAppStory

## Installation

```sh
npm install react-native-inappstory-sdk
```

or

```sh
yarn add react-native-inappstory-sdk
```

## iOS Requirements

1. Add required dependencies to Podfile

```ruby
pod 'InAppStory', :git => 'https://github.com/inappstory/ios-sdk.git', :tag => '1.23.5'
pod 'InAppStoryUGC', :git => 'https://github.com/inappstory/ios-ugc-sdk.git', :tag => '1.3.1'
pod 'IASFilePicker', :git => 'https://github.com/inappstory/ios-filepicker.git', :tag => '0.1.0'
```

2. After running pod install, Open Xcode, find react-native-inappstory-sdk in Pods, Open Build Phases,
   and add required SDK to Link Binary With Libraries

## Android Requirements

Add Android SDK to your app/build.gradle

```gradle
implementation 'com.github.inappstory:android-sdk:0c282fbc27c9d982de665317926320b7b0fcf8fb'
```

Import InAppStory SDK in MainApplication

```java
import com.inappstory.sdk.InAppStoryManager;
```

Add following code to onCreate() function

```java
    InAppStoryManager.initSDK(getApplicationContext())
```

## Usage

To use the library, create **storyManager** singleton with your API key and **appearanceManager** with styles (you can copy src/services/StoryService.js from example project to get started)

```js
const storyManagerConfig: StoryManagerConfig = {
  apiKey: 'test-key',
  userId: '1',
  tags: [],
  placeholders: {
    username: 'Guest',
  },
  lang: 'en',
  defaultMuted: true,
};
const createStoryManager = () => {
 return new StoryManager(storyManagerConfig);
}

export const storyManager = createStoryManager();
```

## Story View

To display feed, use StoriesList component

```js
import { StoriesList } from 'react-native-inappstory-sdk';

<StoriesList
  storyManager={storyManager}
  appearanceManager={appearanceManager}
  feed={feedId}
  onLoadStart={onLoadStart}
  onLoadEnd={onLoadEnd}
  viewModelExporter={viewModelExporter}
/>;
```

## Custom Story Cell

To render custom cells, add renderCell function to **StoriesList**

```js
<StoriesList
  ...props
  renderCell={(story) => {
    return <Text>{story.storyID}</Text>;
  }}
/>
```

## Games

```js
InAppStorySDK.showGame(gameID);
```

## Tags

```js
InAppStorySDK.setTags(['tag1']);
```

## Placeholders

```js
InAppStorySDK.setPlaceholders({ username: 'John Doe' });
```

## Image Placeholders

```js
InAppStorySDK.setImagesPlaceholders({
  image1: 'https://example.com/image.jpg',
});
```

## Story Reader Appearance

```js
InAppStorySDK.setOverScrollToClose(value);
InAppStorySDK.setSwipeToClose(value);
InAppStorySDK.setTimerGradientEnable(value);
InAppStorySDK.setCloseButtonPosition(value);
InAppStorySDK.setScrollStyle(value);
InAppStorySDK.setPresentationStyle(value);
InAppStorySDK.setReaderBackgroundColor(value);
InAppStorySDK.setReaderCornerRadius(value);
```

## Likes, Share, Favorites

```js
InAppStorySDK.setHasLike(value);
InAppStorySDK.setHasShare(value);
InAppStorySDK.setHasFavorites(value);
```

## Sound

```js
InAppStorySDK.changeSound(value);
```

### UGC editor

```js
InAppStorySDK.showEditor();
```

### Goods

To use goods widget, add a function that returns products to getGoodsObject

```js
storyManager.getGoodsObject((skus) => {
  //TODO: return array of Goods
});
```

### Migrating from old version

Breaking changes:

1. Font settings are defined using separate variables (fontSize, fontWeight, fontFamily) instead of a string
2. If you used svgMask in appearance manager, try to use custom cells to achieve same results.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
