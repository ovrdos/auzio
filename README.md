# Auzio

Auzio is a lightweight command-line downloader for grabbing **audio** and **video** from the web.  
It focuses on simplicity, reliability, and producing high-quality audio/video files using common tools such as `yt-dlp`/`youtube-dl` and `ffmpeg`.

Website: https://auzio.one

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Download audio](#download-audio)
  - [Download video](#download-video)
  - [Advanced examples](#advanced-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- 🎵 Download **audio** (extract & convert to MP3, M4A, etc.)
- 🎥 Download **video** with selectable quality
- ⚡ Scriptable CLI suited for automation and servers
- ✅ Works cross-platform (Linux, macOS, Windows with WSL)
- 🔁 Batch and playlist support (when backend downloader supports it)

---

## Requirements

Auzio uses existing, well-supported command-line tools. Install these before use:

- `yt-dlp` or `youtube-dl` — recommended: `yt-dlp` (actively maintained)
- `ffmpeg` — used for format conversion and merging audio/video
- `bash` / POSIX shell (for the provided scripts)

Installation examples:

```bash
# Debian/Ubuntu
sudo apt update
sudo apt install -y ffmpeg python3-pip
pip3 install --user yt-dlp

# macOS (Homebrew)
brew install yt-dlp ffmpeg

# Alternative: install yt-dlp with pipx (recommended)
pipx install yt-dlp
```

> If you prefer `youtube-dl`, most commands will still work but `yt-dlp` often performs better with modern sites.

---

## Installation

Clone the repository and make the main script(s) executable:

```bash
git clone https://github.com/ovrdos/auzio.git
cd auzio

# if there's a top-level script named `auzio`
chmod +x auzio || true

# make shell scripts in code/ executable
chmod +x code/* || true
```

If your environment doesn't have a top-level wrapper script, check the `code/` folder for scripts you can run directly:

```bash
bash code/auzio.sh audio "https://..."      # example invocation if script is a shell script
```

---

## Usage

**Note:** the exact command names/flags may vary depending on the script version in `code/`. Below are robust examples that should work with the common wrapper scripts.

### Download audio

Download and convert a URL to MP3 (highest available audio quality):

```bash
./auzio audio "https://example.com/watch?v=XYZ" -o "output.mp3"
```

If the repo ships a shell script in `code/` use:

```bash
bash code/auzio.sh audio "https://example.com/watch?v=XYZ" -o "output.mp3"
```

### Download video

Download a video and save as MP4:

```bash
./auzio video "https://example.com/watch?v=XYZ" -q 720 -o "output_720.mp4"
```

Common flags (may depend on the script):

- `-o, --output` — output filename or path
- `-q, --quality` — request a quality (e.g., 1080, 720, 480)
- `--format` — specify container/codec/format if supported

### Advanced examples

Batch download (multiple URLs in a file):

```bash
# urls.txt contains one URL per line
while read -r url; do
  ./auzio audio "$url"
done < urls.txt
```

Download and place outputs into a custom directory:

```bash
AUZIO_OUTPUT_DIR="$HOME/Downloads/auzio" ./auzio video "https://example.com/..."
```

Use `yt-dlp` directly for fine-grained control (examples):

```bash
# audio-only passthrough to yt-dlp, then convert to mp3
yt-dlp -x --audio-format mp3 -o '%(title)s.%(ext)s' "https://example.com/..."
```

---

## Configuration

Auzio can use environment variables for simple configuration. Example variables (subject to script implementation):

- `AUZIO_OUTPUT_DIR` — directory where downloads are saved
- `AUZIO_AUDIO_FORMAT` — desired audio format (e.g., `mp3`, `m4a`)
- `AUZIO_DEFAULT_QUALITY` — default video quality (e.g., `720`)

You can export these in your shell or add them to a `.env` wrapper.

---

## Troubleshooting

- **ffmpeg not found** — install `ffmpeg` (see [Requirements](#requirements)).
- **Download fails on specific site** — try updating `yt-dlp`: `pip3 install --user -U yt-dlp`
- **Permissions error** — ensure your script is executable: `chmod +x auzio`
- **Output looks wrong** — check that the script is invoking `ffmpeg` correctly for conversions and that the backend downloader completed successfully.

If you see site-specific errors, try running the underlying `yt-dlp`/`youtube-dl` command printed by the script to inspect the full error.

---

## Roadmap

- [ ] Add a GUI for desktop users
- [ ] Playlist and queue management
- [ ] Docker image for easy deployment
- [ ] Native Windows executable
- [ ] More output format options and presets

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and add tests if applicable
4. Submit a Pull Request describing your changes

Please open an issue before implementing large features to discuss design.

---

## License

This project is offered under the **MIT License** — see the `LICENSE` file in the repo for full details.

---

## Contact

Project: ovrdos/auzio  
Website: https://auzio.one  
If you'd like help adopting this README into your repository directly, tell me and I can provide exact `git` commands or a patch file.
