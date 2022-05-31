"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const request_1 = require("@octokit/request");
function defaultParse(inputName) {
    const inputValue = core_1.default.getInput(inputName);
    if (!inputValue) {
        if (inputName === 'owner') {
            return github_1.default.context.repo.owner;
        }
        if (inputName === 'repo') {
            return github_1.default.context.repo.repo;
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
        core_1.default.setOutput('data', result.data);
    }
})
    .catch(error => {
    console.log('error', error);
    core_1.default.setFailed(error.message);
});
