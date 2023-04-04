# streams_in_flutter

An example project showcasing how to use Bitmovin Streams in a Flutter project.

> **_NOTE:_**  This demo works on iOS, Android and Web although fullscreen will currently not work on Android and Web due to an issue within flutter's WebView (see [GitHub Issue](https://github.com/flutter/flutter/issues/27101))

## What you need

- The ID of a published Bitmovin Stream ([Sign up here](https://bitmovin.com/dashboard/signup) to create one)
- A Flutter project ([See Flutter Getting Started](https://docs.flutter.dev/get-started))
- IDE/Editor of choice

## How to do it

1. Adding dependencies
    To use Bitmovin Streams in a Flutter project, we will embed an `iframe` into the app.
    For ease of use and cross-platform compatibility, we can make use of the [`flutter_widget_from_html_core` package](https://pub.dev/packages/flutter_widget_from_html_core) and its [webview extension](https://pub.dev/packages/fwfh_webview).
    Add the packages as a dependencies by running
    `flutter pub add flutter_widget_from_html_core fwfh_webview`
    inside the project directory.

2. Embedding the iframe
    Now we can use the `HtmlWidget` to render the Stream in an iframe using its Stream ID, along with a custom `WidgetFactory` (see [here](https://pub.dev/packages/fwfh_webview#usage)) to allow media playback:

    ```flutter
    HtmlWidget(
        '<iframe allow="fullscreen" src="https://streams.bitmovin.com/$streamId/embed"></iframe>',
        factoryBuilder: () => _WidgetFactory(webViewMediaPlaybackAlwaysAllow: true));
    ```

    ```flutter
    class _WidgetFactory extends WidgetFactory with WebViewFactory {
        @override
        final bool webViewMediaPlaybackAlwaysAllow;

        _WidgetFactory({required this.webViewMediaPlaybackAlwaysAllow});
    }
    ```

See `lib/main.dart` and `lib/streams_view.dart` for an example implementation.

![Web](/screenshots/web.png)
