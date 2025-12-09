class ProgramProfiler {
  constructor() {
    this.opsStartTime = null;
    this.opsEndTime = null;
  }
  opsStart() {
    this.opsStartTime = new Date();
  }
  opsEnd() {
    this.opsEndTime = new Date();
    const durationMs = this.opsEndTime - this.opsStartTime;
    return durationMs;
  }
}
module.exports = { ProgramProfiler };
