import os from "os";
import ytdl from 'ytdl-core';
import ytpl from "ytpl";
import ffmpeg from "fluent-ffmpeg";
import YTDlpWrap from "yt-dlp-wrap";
import { SingleBar, Presets } from "cli-progress";

import type { ZicottToolbox, DownloadOptions } from "../types";

const extension = (toolbox: ZicottToolbox) => {
	const { print, utils, filesystem, meta } = toolbox;

	function getVideoID(url: string) {
		const VALID_HOSTNAMES = ["youtube", "youtu.be"];

		try {
			const ytURL = new URL(url);
			const selectedHost = VALID_HOSTNAMES.find(h =>
				ytURL.hostname.includes(h)
			);

			if (!selectedHost) {
				print.error("[ERROR]: Unsupported host");
				print.muted(`Supported hosts are: ${VALID_HOSTNAMES.join(", ")}`);
				return;
			}

			switch (selectedHost) {
				case "youtube":
					return ytURL.searchParams.get("v");
				case "youtu.be":
					return ytURL.pathname.slice(1);
			}
		} catch (error) {
			print.error("[ERROR]: Invalid URL");
		}
	}

    async function getVideoIdsFromPlaylist(url: string) {
        try {
            const playlist = await ytpl(url);
            const videoIds = playlist.items.map((item) => item.id);

            return videoIds;
        } catch (error) {
            print.error("[ERROR]: Failed to fetch playlist data");
            console.log(error);
        }
    }

	async function download(videoId: string, options: DownloadOptions) {
        const { ffmpegPath, output, skipProgressBar } = options;

        if (!meta.src) {
            throw new Error("Failed to find CLI src folder");
        }

        const ytdlpBinaryPath = filesystem.path(meta.src, "..", "yt-dlp");
        const ytdlpBinaryExists = await filesystem.existsAsync(ytdlpBinaryPath);

        if (!ytdlpBinaryExists) {
            print.info("Downloading yt-dlp");

            await YTDlpWrap.downloadFromGithub(
                ytdlpBinaryPath,
                '2024.08.06',
                os.platform(),
            );
        }

        const ytdlp = new YTDlpWrap(ytdlpBinaryPath);

		const progressBar = new SingleBar(
			{
				clearOnComplete: true,
				barsize: 30,
			},
			Presets.shades_classic
		);

		try {
			if (ffmpegPath && !(utils.isValidPath(ffmpegPath))) {
				print.error("[ERROR]: Invalid ffmpeg path");
				return;
			}

			if (output) {
                const filename = output.split("/").pop();

                if (filename && !utils.isValidFilename(filename)) {
                    print.error("[ERROR]: Invalid output path");
                    return;
                }

                const outputPath = output.split("/").slice(0, -1).join("/");

                if (outputPath && !utils.isValidPath(outputPath)) {
                    print.error("[ERROR]: Invalid output path");
                    return;
                }
			}

            if (ffmpegPath) {
                ffmpeg.setFfmpegPath(ffmpegPath);
            }

            const videoInfo = await ytdl.getInfo(videoId);
            const videoTitle = videoInfo.videoDetails.title;

            const filename = utils.stringToFilename(videoTitle);
            const outputPath = output || `${filename}.mp3`;

            if (filesystem.exists(outputPath)) {
                print.warning("[WARNING]: File already exists");
                return;
            }

            process.on("SIGINT", () => {
                progressBar.stop();
                filesystem.remove(outputPath);
                print.info("Download aborted");

                process.exit();
            });

            print.info(`[Title]: ${videoTitle}`);

            await new Promise((resolve, reject) => {
                let started = false;

                ytdlp.exec([
                    `https://www.youtube.com/watch?v=${videoId}`,
                    "--format",
                    "bestaudio",
                    "--output",
                    outputPath,
                ])
                .on("progress", (progress) => {
                    if (!skipProgressBar) {
                        if (!started) {
                            progressBar.start(100, 0);
                            started = true;
                        }

                        progressBar.update(progress.percent);
                    }
                })
                .on("close", () => {
                    if (!skipProgressBar) {
                        progressBar.stop();
                    }

                    print.success("Download completed successfully!");
                    resolve(true);
                })
                .on("error", (error) => {
                    if (!skipProgressBar && started) {
                        progressBar.stop();
                    }

                    print.error(`[ERROR]: ${error.message}`);
                    reject(error);
                });
            });
		} catch (error) {
			print.error("[ERROR]: Failed to download");
		}
	}

	toolbox.youtube = {
		getVideoID,
        getVideoIdsFromPlaylist,
		download,
	};
};

export default extension;
