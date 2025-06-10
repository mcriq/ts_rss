import { readConfig, setUser } from "./config";

function main() {
    setUser("Matt");
    const cfg = readConfig();
    console.log(cfg);
}

main();