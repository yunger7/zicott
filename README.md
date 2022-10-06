<pre align="center">
   ______     __     ______     ______     ______   ______  
  /\___  \   /\ \   /\  ___\   /\  __ \   /\__  _\ /\__  _\ 
  \/_/  /__  \ \ \  \ \ \____  \ \ \/\ \  \/_/\ \/ \/_/\ \/ 
    /\_____\  \ \_\  \ \_____\  \ \_____\    \ \_\    \ \_\ 
    \/_____/   \/_/   \/_____/   \/_____/     \/_/     \/_/ 
    
    A CLI tool to easily download YouTube music.
</pre>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/yunger7/zicott?colorA=4c566a&colorB=5E81AC&label=Latest%20commit&logo=github&logoColor=ECEFF4&style=flat-square" />
  <img src="https://img.shields.io/github/languages/code-size/yunger7/zicott?colorA=4c566a&colorB=5E81AC&label=Code%20size&logo=github&logoColor=ECEFF4&style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/yunger7/zicott?colorA=4c566a&colorB=5E81AC&label=TypeScript&logo=typescript&logoColor=ECEFF4&style=flat-square" />
  <img src="https://img.shields.io/github/license/yunger7/zicott?colorA=4c566a&colorB=5E81AC&label=License&logo=github&logoColor=ECEFF4&style=flat-square" />
</p>

<!-- Badges -->

## About
Zicott is a Gluegun-powered CLI for quickly downloading YouTube videos as MP3. It's a simple tool that I've build for my personal usage, so don't expect it to be heavily maintained. Personally, I've been using YouTube to listen to music, but there are a couple of problems with it:
- Ads.
- Videos get taken down all the time.
- No offline mode.
- Message popup saying *"Are you still watching?"*.

So that's why this tool exists.

**⚠ Important:** To run this CLI, you need to have [FFmpeg](https://www.ffmpeg.org/) installed on your computer. Also, keep in mind that downloading audio from videos other than your own is against YouTube TOS, use this tool at your own risk.

## Install
```
npm i -g zicott
```

## Usage
<!-- First, install the CLI with `npm i -g zicott` or `yarn global add zicott`. Then, use --help -->
```
$ zicott --help

  USAGE
    zicott <link?> [flags]

  FLAGS
    --help (h)      Show help about a command
    --version (v)   Show installed version
    --output (o)    Path to output mp3 file (defaults to current working directory)
    --ffmpeg        Path to FFmpeg binary

  EXAMPLES
    $ zicott
    $ zicott https://youtu.be/YNYXLWYcu-A
    $ zicott https://youtu.be/d7V3M2DAq1E --output C:\\Users\\foo\\Downloads
    $ zicott "https://www.youtube.com/watch?v=TV0uYFPEkks&list=PLIpqsKgkQEvMUFbngp-GbW1JwDGXnxcm9&index=7"
```

## License
Licensed under the MIT License. See `LICENSE` for more details.

<hr /><br />

<p align="center">Powered by ☕ and TypeScript <br/> Made with 💙 by <a href="https://github.com/yunger7">yunger</a></p>
