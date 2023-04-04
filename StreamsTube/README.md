# StreamsTube 🌊📺

Welcome to StreamsTube, a demonstration of the capabilities and potential of Bitmovin Streams in a video streaming environment. This project showcases an elegant and intuitive interface for streaming videos while leveraging the power of Bitmovin Streams.

**Note:** This project is intended as a proof of concept and not a fully-fledged video streaming platform. 

## Table of Contents

- [Overview](#overview)
- [Built with](#built-with)
- [Installation](#installation)
- [Configuration](#configuration)
- [Building](#building)
- [Running](#running)
- [Contributing](#contributing)
- [License](#license)

## Overview

StreamsTube demonstrates the following features:

- Efficient video streaming using Bitmovin API
- Intuitive user interface

## Built With

- [Next.js](https://nextjs.org/) - A popular React framework for building web applications
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development


## Installation

To set up StreamsTube on your local machine, follow these steps:

1. Clone the repository:

```sh
git clone "https://github.com/bitmovin/streams-examples.git"
cd StreamsTube 
```

2. Install the required dependencies using your preferred package manager:

- npm:

```sh
npm install
```

- yarn:

```sh
yarn
```

- pnpm:

```sh
pnpm install
```

## Configuration

Create a `.env` file in the root folder of the project and add your Bitmovin API key.

```sh
echo "NEXT_PUBLIC_BITMOVIN_API_KEY=your_api_key_here" > .env
```

## Building

Build the project by running the following command:

```sh
npm run build
```

or

```sh
yarn build
```

or

```sh
pnpm build
```

## Running

Start the server by running the following command:

```sh
npm run serve:build
```

or

```sh
yarn serve:build
```

or

```sh
pnpm serve:build
```

Now, open your browser and visit http://localhost:3000 to explore StreamsTube. 


## Contributing

We welcome any contributions, whether it's feedback, bug reports, feature requests, or code contributions.

## License

StreamsTube Proof of Concept is released under the [MIT License](LICENSE).
