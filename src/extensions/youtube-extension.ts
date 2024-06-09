import * as ytdl from "ytdl-core";
import * as ffmpeg from "fluent-ffmpeg";
import { SingleBar, Presets } from "cli-progress";

import type { ZicottToolbox } from "../types";

const extension = (toolbox: ZicottToolbox) => {
	const { print, utils, filesystem } = toolbox;

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

	async function download(id: string, ffmpegPath?: string, output?: string) {
		const progressBar = new SingleBar(
			{
				clearOnComplete: true,
				barsize: 30,
			},
			Presets.shades_classic
		);

		try {
			if (ffmpegPath && !(await utils.isValidPath(ffmpegPath))) {
				print.error("[ERROR]: Invalid ffmpeg path");
				return;
			}

			if (output && !(await utils.isValidPath(output))) {
				print.error("[ERROR]: Invalid output path");
				return;
			}

            if (ffmpegPath) {
                ffmpeg.setFfmpegPath(ffmpegPath);
            }

            const videoInfo = await ytdl.getInfo(id);
            const videoTitle = videoInfo.videoDetails.title;

            const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: "highestaudio" });
            const audioSize = Number(audioFormat.contentLength);

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

            const stream = ytdl.downloadFromInfo(videoInfo, { quality: "highestaudio" });

            print.info(`[Title]: ${videoTitle}`);
            print.info(`[Output]: ${outputPath}`);

			let started = false;

            ffmpeg(stream)
                .audioBitrate(320)
                .save(outputPath)
                .on("progress", (event) => {
                    if (!started) {
                        progressBar.start(audioSize, 0);
                        started = true;
                    }

                    progressBar.update(event.targetSize * 512);
                })
                .on("end", () => {
                    progressBar.stop();
                    print.success("Download completed successfully!");
                });
		} catch (error) {
			print.error("[ERROR]: Failed to download");
		}
	}

	toolbox.youtube = {
		getVideoID,
		download,
	};
};

export default extension;
