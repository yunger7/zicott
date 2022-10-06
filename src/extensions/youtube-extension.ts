import * as YoutubeMp3Downloader from "youtube-mp3-downloader";
import { SingleBar, Presets } from "cli-progress";

import type { ZicottToolbox } from "../types";

const extension = (toolbox: ZicottToolbox) => {
	const { print, utils } = toolbox;

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

	async function download(id: string, ffmpeg?: string, output?: string) {
		const progressBar = new SingleBar(
			{
				clearOnComplete: true,
				barsize: 30,
			},
			Presets.shades_classic
		);

		try {
			if (ffmpeg && !(await utils.isValidPath(ffmpeg))) {
				print.error("[ERROR]: Invalid ffmpeg path");
				return;
			}

			if (output && !(await utils.isValidPath(output))) {
				print.error("[ERROR]: Invalid output path");
				return;
			}

			const YD = new YoutubeMp3Downloader({
				ffmpegPath: ffmpeg,
				outputPath: output || process.cwd(),
				queueParallelism: 1,
				progressTimeout: 1000,
				allowWebm: false,
			});

			YD.download(id);

			let started = false;

			YD.on("progress", ({ progress }) => {
				if (!started) {
					progressBar.start(progress.length, 0);
					started = true;
				}
				progressBar.update(progress.transferred);
			});

			YD.on("finished", (error, data) => {
				progressBar.stop();
				if (error) throw error;

				print.success("Download completed successfully!");
				print.info(`[Title]: ${data.title}`);
				print.info(`[Output file]: ${data.file}`);
				print.info(`[YouTube URL]: ${data.youtubeUrl}`);
			});

			YD.on("error", error => {
				progressBar.stop();
				throw error;
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
