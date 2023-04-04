# File upload

This example shows how to implement a file upload component in React that uses the [Bitmovin direct file upload API](https://developer.bitmovin.com/streams/reference/postencodinginputsdirectfileupload).
The uploaded file is then used as an input to create a new Bitmovin Stream.

For more information about using file upload in combination with Streams, see the [Bitmovin documentation](https://developer.bitmovin.com/streams/docs/use-cdn-file-upload-with-streams).

## Prerequisites

- [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/) installed
- A valid [Bitmovin API key](https://bitmovin.com/dashboard/account) (You can sign up for a free trial [here](https://bitmovin.com/dashboard/signup))

## Steps

1. Clone this repository
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm dev` or `yarn dev`
4. Add your Bitmovin API key to `App.tsx` (line 5)
5. Open [http://localhost:3000](http://localhost:3000) in your browser and upload a video file
