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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const request_1 = require("@octokit/request");
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
const token = defaultParse('token');
const owner = defaultParse('owner');
const repo = defaultParse('repo');
const deploymentId = defaultParse('deployment_id');
const requestWithAuth = request_1.request.defaults({
    headers: {
        authorization: `Bearer ${token}`
    },
    mediaType: {
        previews: ['ant-man']
    }
});
requestWithAuth('GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses', {
    token,
    owner,
    repo,
    deployment_id: deploymentId
})
    .then(result => {
    console.log('result', result);
    if (result && result.data) {
        core.setOutput('data', result.data);
    }
})
    .catch(error => {
    console.log('error', error);
    core.setFailed(error.message);
});
