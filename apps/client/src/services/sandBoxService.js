import { loadQuickJs } from "https://esm.sh/@sebastianwessel/quickjs@latest";

class SandBoxService {
  constructor() {
    this.options = {
      allowFetch: false,
      allowFs: false,
    };
  }

  async init() {
    this.sandBox = await loadQuickJs(
      "https://esm.sh/@jitl/quickjs-ng-wasmfile-release-sync"
    );
  }

  async runCode(code) {
    return await this.sandBox.runSandboxed(async ({ evalCode }) => {
      return evalCode(code);
    }, this.options);
  }
}

const sandBoxService = new SandBoxService();
await sandBoxService.init();

// const code = `
//   import { join } from 'path'

//   const fn = async ()=>{
//     console.log(join('src','dist')) // logs "src/dist" on host system

//     return 2
//   }

//   export default await fn()
//   `;

// console.log(await sandBoxService.runCode(code));

export default sandBoxService;
