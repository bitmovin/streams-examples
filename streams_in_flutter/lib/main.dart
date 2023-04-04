import 'package:flutter/material.dart';
import 'package:streams_in_flutter/streams_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Streams in Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Streams in Flutter Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final textController = TextEditingController();
  String _streamId = "cglb2v14uvs51rqc8ji0";

  Widget renderInputRow() {
    return Row(children: [
      Expanded(
          child: TextField(
        controller: textController,
        decoration: const InputDecoration(
          border: OutlineInputBorder(),
          hintText: 'Enter your Stream ID',
        ),
      )),
      const SizedBox(width: 10),
      Flex(
        direction: Axis.vertical,
        children: [
          ElevatedButton(
              onPressed: () {
                setState(() {
                  _streamId = textController.text;
                });
              },
              child: const Text("Load"))
        ],
      ),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: SingleChildScrollView(
          child: Center(
            child: FractionallySizedBox(
                widthFactor: 0.75,
                child: Column(children: [
                  const SizedBox(height: 10),
                  renderInputRow(),
                  const SizedBox(height: 10),
                  StreamsView(_streamId),
                ])),
          ),
        ));
  }
}
