/**
 * Drives Python execution in a Web Worker running Pyodide.
 *
 * The worker (`pyodide.worker.js`) loads the Pyodide runtime once, then traces
 * each `execute` call with `sys.settrace`, returning an array of execution
 * snapshots. This class owns the worker lifecycle and matches asynchronous
 * worker replies back to their callers via an id → callback map.
 *
 * Exposed as a singleton (`pyodideExecutor`) so the worker and the loaded
 * runtime are shared across the app.
 */
class PyodideExecutor{
    constructor(){
        this.worker = null; 
        this.messageId = 0;
        this.pendingCallbacks = new Map();
        this.isReady = false;
        this.initializationTimeout = 10000;
        this.executionTimeout = 10000;
    }

    /**
     * Spawns the Pyodide worker (idempotent) and wires up its message/error
     * handlers, then blocks until the worker reports `ready`. The `onmessage`
     * handler routes each reply to the caller registered under its `id` and
     * sets `isReady` when the runtime has finished loading; `onerror` fails all
     * pending callbacks at once.
     *
     * @returns {Promise<void>} Resolves once the worker is initialized.
     * @throws {Error} If init does not complete within `initializationTimeout` (10s).
     */
    async initialize(){
        if(this.worker) return;

        this.worker = new Worker(new URL('./pyodide.worker.js', import.meta.url));

        this.worker.onerror = (error) => {
            console.error('[Executor] Worker error:', error);
            this.pendingCallbacks.forEach((callback) => {
                callback({
                    success: false,
                    error: `Worker error: ${error.message}`,
                    errorType: 'WorkerError'
                });
            });
            this.pendingCallbacks.clear();
        };

        this.worker.onmessage = (event) => {
            const {type, id, ...data} = event.data;

            if(type === 'ready'){
                this.isReady = true;
            }

            const callback = this.pendingCallbacks.get(id);
            if(callback){
                callback(data);
                this.pendingCallbacks.delete(id);
            }
        };
        
        try {
            await this.sendMessageWithTimeout('init', {}, this.initializationTimeout);
        } catch (error) {
            throw new Error(`Worker initialization failed: ${error.message}`);
        }
    }

    /**
     * Posts a message to the worker tagged with a fresh monotonic `id`, and
     * returns a Promise that resolves with the worker's reply payload (the
     * message minus its `type`/`id` fields). The Promise never rejects on its
     * own — see {@link sendMessageWithTimeout} for the bounded variant.
     *
     * @param {string} type - Worker command (e.g. `'init'`, `'execute'`).
     * @param {Object} [data={}] - Extra fields merged into the posted message.
     * @returns {Promise<Object>} The worker reply payload.
     */
    sendMessage(type, data = {}){
        return new Promise((resolve) => {
            const id = this.messageId++;
            this.pendingCallbacks.set(id, resolve);
            this.worker.postMessage({type, id, ...data});
        });
    }

    /**
     * Races a {@link sendMessage} call against a timeout. If the worker does
     * not reply within `timeoutMs`, the returned Promise rejects with an Error
     * carrying `isTimeout = true` and a user-facing infinite-loop hint.
     *
     * Note: on timeout the underlying callback stays registered in
     * `pendingCallbacks` (the worker is still busy); callers that need a clean
     * slate should {@link terminate}.
     *
     * @param {string} type - Worker command.
     * @param {Object} [data={}] - Extra fields merged into the posted message.
     * @param {number} [timeoutMs=this.executionTimeout] - Timeout in milliseconds.
     * @returns {Promise<Object>} The worker reply payload.
     * @throws {Error} With `isTimeout = true` if the deadline elapses first.
     */
    sendMessageWithTimeout(type, data = {}, timeoutMs = this.executionTimeout){
        return Promise.race([
            this.sendMessage(type, data),
            new Promise((_, reject) =>
                setTimeout(() => {
                    const seconds = Math.round(timeoutMs / 1000);
                    const err = new Error(`Execution timed out after ${seconds}s. Your program may have an infinite loop or be too slow to visualize.`);
                    err.isTimeout = true;
                    reject(err);
                }, timeoutMs)
            )
        ]);
    }

    /**
     * Runs `pythonCode` in the traced worker, initializing the runtime first if
     * needed. Returns the worker's result contract rather than throwing: on
     * failure the result has `success: false` plus an `error`/`errorType`
     * (and, for Python errors, `phase`, `errorLine`, `errorTraceback`).
     *
     * @param {string} pythonCode - User source; trimmed before execution.
     * @param {number} [maxSteps=1000] - Cap on captured trace snapshots.
     * @param {number|null} [timeoutMs=null] - Per-run timeout; falls back to
     *   `executionTimeout` (10s) when null.
     * @returns {Promise<Object>} On success:
     *   `{ success: true, snapshots, debug, stdout }`. On failure:
     *   `{ success: false, error, errorType, ... }`.
     */
    async execute(pythonCode, maxSteps = 1000, timeoutMs = null){
        try {
            if(!this.isReady){
                await this.initialize();
            }

            const timeout = timeoutMs || this.executionTimeout;
            const result = await this.sendMessageWithTimeout('execute', {
                code: pythonCode.trim(),
                maxSteps: maxSteps
            }, timeout);

            if (result.success === false) {
                console.error('[Executor] Python execution failed:', result.error);
                return result;
            }

            return result;
        } catch (error) {
            console.error('[Executor] Execution error:', error);
            return {
                success: false,
                error: error.message,
                errorType: error.isTimeout ? 'TimeoutError' : 'ExecutionError'
            };
        }
    }

    /**
     * Hard-stops and discards the worker, resetting the executor to its
     * pre-`initialize` state. Pending callbacks are dropped (their Promises
     * never settle), so this is the escape hatch after a timeout or hang. A
     * subsequent `execute`/`initialize` spins up a fresh worker.
     *
     * @returns {void}
     */
    terminate(){
        if (this.worker){
            this.worker.terminate();
            this.worker = null;
            this.isReady = false;
            this.pendingCallbacks.clear();
        }
    }
}

export const pyodideExecutor = new PyodideExecutor();