import fs from "fs/promises";
import path from "path";



const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}


const analyzeFiles = async (dir) => {
    const files = await fs.readdir(dir);
    for (const file of files) {
        if (file.endsWith(".js")) {
            const status = await fs.stat(`${dir}/${file}`);
            console.log(`${file} - ${status.size} bytes`)
        }
    }
}


const copyFile = async (src, destinationDr) => {
    const destinationPath = path.join(process.cwd(), destinationDr);
    const isExistedDir = await fileExists(destinationPath);
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    if (isExistedDir) {
        console.log("directory is already exists")
    } else {
        await fs.mkdir(destinationPath, { recursive: true })
    }
    const ext = path.extname(src);
    const base = path.basename(src, ext);
    const newFileName = `${base}_${date}${ext}`;
    const _destinationPath = path.join(process.cwd(), destinationDr, newFileName);
    console.log("_destinationpath", _destinationPath);
    try {
        await fs.copyFile(src, _destinationPath);
    } catch (e) {
        console.error("Copy failed:", e.message);
    }
}



const logChanges = async () => {
    const events = await fs.watch("./backup");
    console.log("Event", events)
    const logFolder = path.join(process.cwd(), "logs");


    try {
        await fs.access(logFolder)
    }
    catch (e) {
        await fs.mkdir(logFolder);
    }

    for await (const event of events) {
        const changedFileName = event.filename;
        const filePath = path.join(process.cwd(), "/backup", changedFileName);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const srcFilePath = path.join(process.cwd(), "logs", "logs.txt");

        try {
            const fileIsExisted = await fileExists(srcFilePath);
            if (fileIsExisted) {
                await fs.appendFile(srcFilePath, `event type:${event.eventType} \nMessage:${fileContent}`)
            }
        }
        catch (e) {
            await fs.writeFile(srcFilePath, `event type:${event.eventType} \nMessage:${fileContent}`)
        }

    }
}


const files = await fs.readdir(path.join(".."));
await fs.stat(path.join("."));


for (const file of files) {
    if (path.extname(file).includes("txt")) {
        await copyFile(path.join("..", file), "storybook");
    }
}


const fetchData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    const data = await response.json();
    const dirPath = path.join(process.cwd(), "collectedData");
    const filePath = path.join(dirPath, "data.json");

    if (data) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
        }
        catch (e) {
            await fs.appendFile(filePath, JSON.stringify(data, null, 2), "utf-8");
        }
    }
}

// ======Actions======

// logChanges();

// fetchData()
