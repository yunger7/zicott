import type { ZicottToolbox } from "../types";

const extension = (toolbox: ZicottToolbox) => {
	const { filesystem } = toolbox;

	async function isValidPath(path: string) {
		return typeof (await filesystem.inspectAsync(path)) !== "undefined";
	}

	toolbox.utils = {
		isValidPath,
	};
};

export default extension;
