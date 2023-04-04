import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:fwfh_webview/fwfh_webview.dart';

class StreamsView extends StatelessWidget {
  final String streamId;

  const StreamsView(this.streamId, {super.key});

  @override
  Widget build(BuildContext context) {
    return HtmlWidget(
        key: Key(streamId),
        '<iframe allow="fullscreen" src="https://streams.bitmovin.com/$streamId/embed"></iframe>',
        enableCaching: false,
        onErrorBuilder: (context, element, error) => Text('$element error: $error'),
        onLoadingBuilder: (context, element, loadingProgress) => const CircularProgressIndicator(),
        factoryBuilder: () => _WidgetFactory(webViewMediaPlaybackAlwaysAllow: true));
  }
}

class _WidgetFactory extends WidgetFactory with WebViewFactory {
  @override
  final bool webViewMediaPlaybackAlwaysAllow;

  _WidgetFactory({required this.webViewMediaPlaybackAlwaysAllow});
}
