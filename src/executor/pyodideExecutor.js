
class PyodideExecutor{
    constructor(){
        this.worker = null; 
        this.messageId = 0;
        this.pendingCallbacks = new Map();
        this.isReady = false;
        this.initializationTimeout = 10000; // 10 seconds
        this.executionTimeout = 10000; // 10 seconds (backstop for runaway code)
    }

    async initialize(){
        if(this.worker) return;

        this.worker = new Worker(new URL('./pyodide.worker.js', import.meta.url));

        this.worker.onerror = (error) => {
            console.error('[Executor] Worker error:', error);
            // Reject any pending callbacks
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
        
        // Initialize worker with timeout
        try {
            await this.sendMessageWithTimeout('init', {}, this.initializationTimeout);
        } catch (error) {
            throw new Error(`Worker initialization failed: ${error.message}`);
        }
    }

    sendMessage(type, data = {}){
        return new Promise((resolve) => {
            const id = this.messageId++;
            this.pendingCallbacks.set(id, resolve);
            this.worker.postMessage({type, id, ...data});
        });
    }

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

            // Check if result has success flag
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