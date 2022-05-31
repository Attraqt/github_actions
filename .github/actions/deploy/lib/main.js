"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const request_1 = require("@octokit/request");
function parseArray(inputName) {
    const inputValue = core.getInput(inputName);
    if (inputValue === '') {
        return undefined;
    }
    if (inputValue === '<<EMPTY>>') {
        return [];
    }
    return inputValue.split(',');
}
function parseBoolean(inputName) {
    const inputValue = core.getInput(inputName);
    return inputValue === 'true';
}
function parseNumber(inputName) {
    try {
        const inputValue = parseInt(core.getInput(inputName));
        if (inputName === 'waiting_time' && inputValue < 0) {
            return undefined;
        }
        return inputValue;
    }
    catch (error) {
        return undefined;
    }
}
function defaultParse(inputName) {
    const inputValue = core.getInput(inputName);
    if (!inputValue) {
        if (inputName === 'owner') {
            return github.context.repo.owner;
        }
        if (inputName === 'repo') {
            return github.context.repo.repo;
        }
    }
    return inputValue || undefined;
}
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = defaultParse('token');
        const owner = defaultParse('owner');
        const repo = defaultParse('repo');
        const ref = defaultParse('ref');
        const task = defaultParse('task');
        const auto_merge = parseBoolean('auto_merge');
        const required_contexts = parseArray('required_contexts');
        const payload = defaultParse('payload');
        const environment = defaultParse('environment');
        const description = defaultParse('description');
        const transient_environment = parseBoolean('transient_environment');
        const production_environment = parseBoolean('production_environment');
        const waitingTime = parseNumber('waiting_time') || 10;
        let deploymentId = undefined;
        let stop = false;
        const requestWithAuth = request_1.request.defaults({
            headers: {
                authorization: `Bearer ${token}`
            },
            mediaType: {
                previews: ['ant-man']
            }
        });
        //sending development call
        try {
            const result = yield requestWithAuth('post /repos/{owner}/{repo}/deployments', {
                token,
                owner,
                repo,
                ref,
                task,
                auto_merge,
                required_contexts,
                payload,
                environment,
                description,
                transient_environment,
                production_environment
            });
            console.log('result', result);
            if (result && result.data && result.data.id) {
                deploymentId = result.data.id;
                core.setOutput('id', result.data.id);
            }
            if (result && result.data && result.data.number) {
                core.setOutput('number', result.data.number);
            }
        }
        catch (error) {
            console.log('error', error);
            core.setFailed(error.message);
        }
        console.log(`Deploying on ${repo}... (https://github.com/${owner}/${repo})`);
        //getting statuses and checking if running or over
        while (!stop) {
            try {
                const result = yield requestWithAuth('GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses', {
                    token,
                    owner,
                    repo,
                    deployment_id: deploymentId
                });
                if (result && result.data) {
                    if (result.data.length > 0) {
                        const lastStatus = result.data[0];
                        if (['success', 'failure', 'error', 'inactive'].includes(lastStatus.state)) {
                            stop = true;
                            if (['failure', 'error'].includes(lastStatus.state)) {
                                core.setFailed(lastStatus.description);
                            }
                            else if (lastStatus.state === "success") {
                                console.log(lastStatus.description);
                            }
                            else {
                                console.log("Inactive job.");
                            }
                        }
                    }
                }
            }
            catch (error) {
                core.setFailed(error.message);
                stop = true;
            }
            if (!stop)
                yield sleep(waitingTime * 1000);
        }
    });
}
run();
