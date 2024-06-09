import type { ZicottToolbox } from "../types";

const extension = (toolbox: ZicottToolbox) => {
	const { filesystem } = toolbox;

	async function isValidPath(path: string) {
		return typeof (await filesystem.inspectAsync(path)) !== "undefined";
	}

    function stringToFilename(text: string) {
        if (!text) return;

        return text
            .replace(/[\/|\\:*?"<>]/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 100);
    }

	toolbox.utils = {
		isValidPath,
        stringToFilename,
	};
};

export default extension;
