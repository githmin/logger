const fs = require("fs");
const path = require("path");

class logger {
  name: String;
  path: String;
  cacheSize: Number;
  cache: any;
  constructor(name: String, dir = "./logs", cacheSize = 100) {
    this.name = name;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    this.path = path.join(
      dir,
      `${new Date().toISOString().split(".")[0]}-${this.name}.log`
    );
    this.cacheSize = cacheSize;
    this.cache = [];
  }
  private log(level: String, message: String) {
    const log = `[${new Date().toLocaleString()}] [${level}] ${message}`;
    console.log(log);
    this.cache.push(log);
    if (this.cache.length >= this.cacheSize) {
      fs.appendFileSync(
        this.path,
        this.cache.map((l: String) => l + "\n").join("")
      );
      this.cache = [];
    }
  }
  public async close() {
    await fs.appendFileSync(
      this.path,
      this.cache.map((l: String) => `${l}\n`).join("")
    );
    console.log("Log Cache Flushed");
  }
  public info(message: String) {
    this.log(" INFO  ", message);
  }
  public debug(message: String) {
    this.log(" DEBUG ", message);
  }
  public trace(message: String) {
    this.log(" TRACE ", message);
  }
  public warn(message: String) {
    this.log(" WARN  ", message);
  }
  public error(message: String) {
    this.log(" ERROR ", message);
  }
  public fatal(message: String) {
    this.log(" FATAL ", message);
  }
}

module.exports = logger;