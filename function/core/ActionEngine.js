class ActionEngine {
    constructor(functions, schemas) {
        if (!functions || typeof functions !== 'object') {
            throw new Error('Functions object is required for initialization.');
        }

        if (!schemas || typeof schemas !== 'object') {
            throw new Error('Schemas object is required for initialization.');
        }

        this.functions = functions;
        this.schemas = schemas;
        this.flows = {};
    }

    getValueFromStringRef(obj, ref) {
        if (ref[0] !== '$') {
            throw new Error('Invalid string reference provided.');
        }
        let path = ref.substring(1).split('.');
        path.shift();

        let value = obj;
        for (const key of path) {
            value = value[key];
        }
        return value;
    }

    addFlow(flowId, executionType, flow) {
        if (!flowId || !executionType || !flow) {
            throw new Error('All parameters are required to add a flow.');
        }

        this.flows[flowId] = {
            executionType: executionType,
            flow: flow
        };
    }

    async runFlow(flowId, data, dataStore = {}) {

        const flowData = this.flows[flowId];
        if (!flowData) {
            throw new Error('Flow ID not found.');
        }
        const { executionType, flow } = flowData;

        return executionType === 'sequential'
            ? await this.executeSequentially(flow, data, dataStore)
            : await this.executeParallel(flow, data, dataStore);
    }

    async executeSequentially(flow, data, dataStore) {
        for (const step of flow) {
            const parameters = step.parameters.map(param => {
                return param[0] === '$'
                    ? this.getValueFromStringRef(param.includes('dataStore.') ? dataStore : data, param)
                    : param;
            });
            const result = await this.functions[step.name](...parameters);

            if (step.store) {
                dataStore[step.store] = result;
            }

            if (result && step.onSuccess) {
                await this.runFlow(step.onSuccess, data, dataStore);
            } else if (!result && step.onFailure) {
                await this.runFlow(step.onFailure, data, dataStore);
            }
        }
    }

    async executeParallel(flow, data, dataStore) {
        const promises = flow.map(async step => {
            const parameters = step.parameters.map(param => {
                return param[0] === '$'
                    ? this.getValueFromStringRef(param.includes('dataStore.') ? dataStore : data, param)
                    : param;
            });

            const result = await this.functions[step.name](...parameters);

            if (step.store) {
                dataStore[step.store] = result;
            }

            if (result && step.onSuccess) {
                await this.runFlow(step.onSuccess, data, dataStore);
            } else if (!result && step.onFailure) {
                await this.runFlow(step.onFailure, data, dataStore);
            }
        });

        await Promise.all(promises);
    }

    getSchema(functionName) {
        return this.schemas[functionName];
    }
}


export {ActionEngine}