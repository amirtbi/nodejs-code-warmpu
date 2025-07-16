import fs from "fs/promises";
import path from "path";



const pathRegex = {
    CREATE: /^create the file (.+)/,
    DELETE: /^delete the file (.+)/,
    ADD_TO_FILE: /^add\s+(.+?)\s+to\s+(.+)$/i,
    RENAME_FILE: /^rename\s+(.+?)\s+to\s+(.+)$/i,
}


const commands = {
    CREATE_FILE: "create the file",
    EDIT_FILE: "edit the file",
    DELETE_FILE: "delete the file",
    RENAME_FILE: "rename the file",
    ADD_TO_FILE: "add",
    RENAME_FILE: "rename"
}

const events = await fs.watch("./command.txt");

const readCommand = async () => {
    const getOutputPath = (filePath) => {
        const outputFilePath = path.join(process.cwd(), filePath);
        const normalizedPath = path.normalize(outputFilePath);
        return normalizedPath;
    }

    const fileExists = async (filePath) => {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    const createFile = async (filePath, content) => {
        const existedFile = await fileExists(filePath);
        if (existedFile) {
            return console.log(`====The file ${filePath} ===existed`);
        } else {
            try {
                await fs.writeFile(filePath, content, "utf-8");
            }
            catch (e) {
                throw new Error("Creation of file failed");
            }
        }
    }

    const deleteFile = async (filePath) => {
        try {
            const existed = await fileExists(filePath);
            if (!existed) {
                throw new Error("File does not exist.")
            }
            await fs.unlink(filePath);
        }
        catch (e) {
            console.log(e)
        }
    }

    const addToFile = async (filePath, newContent) => {
        try {
            await fs.appendFile(filePath, newContent);
        }
        catch (e) {
            console.log("Adding new content failed")
        }
    }


    const renameTheFile = async (filePath, newFileName) => {
        try {
            const existed = await fileExists(filePath);
            if (!existed) {
                throw new Error("File does not exist.")
            }
            await fs.rename(filePath, newFileName)
        }
        catch (e) {
            console.log(e);
        }
    }

    for await (const event of events) {
        if (event.eventType === "change") {
            const commandFileContent = await fs.readFile("./command.txt", "utf-8");
            if (commandFileContent.includes(commands.CREATE_FILE)) {
                const match = commandFileContent.match(pathRegex.CREATE);
                if (match && match[1]) {
                    const filePath = getOutputPath(match[1].trim());
                    return await createFile(filePath, "Welcome to Iran");

                }
            } else if (commandFileContent.includes(commands.DELETE_FILE)) {
                const match = commandFileContent.match(pathRegex.DELETE);
                if (match && match[1]) {
                    const filePath = getOutputPath(match[1].trim());
                    return await deleteFile(filePath);

                }
            } else if (commandFileContent.includes(commands.ADD_TO_FILE)) {
                const match = commandFileContent.match(pathRegex.ADD_TO_FILE);
                if (match && match[1] && match[2]) {
                    const filePath = getOutputPath(match[2].trim());
                    return await addToFile(filePath, match[1]);
                }
            } else if (commandFileContent.includes(commands.RENAME_FILE)) {
                const match = commandFileContent.match(pathRegex.RENAME_FILE);
                if (match && match[1] && match[2]) {
                    const oldFilePath = getOutputPath(match[1].trim());
                    const newFilePath = getOutputPath(match[2].trim());
                    return await renameTheFile(oldFilePath, newFilePath);
                }
            }
        }
    }
}


readCommand()