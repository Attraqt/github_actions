import core from '@actions/core'
import github from '@actions/github'
import {request} from '@octokit/request'

function defaultParse(inputName: string): any | undefined {
  const inputValue = core.getInput(inputName)
  if (!inputValue) {
    if (inputName === 'owner') {
      return github.context.repo.owner
    }

    if (inputName === 'repo') {
      return github.context.repo.repo
    }
  }

  return inputValue || undefined
}

const token = defaultParse('token')
const owner = defaultParse('owner')
const repo = defaultParse('repo')
const deploymentId = defaultParse('deployment_id')

const requestWithAuth = request.defaults({
  headers: {
    authorization: `Bearer ${token}`
  },
  mediaType: {
    previews: ['ant-man']
  }
})

requestWithAuth(
  'GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses',
  {
    token,
    owner,
    repo,
    deployment_id: deploymentId
  }
)
  .then(result => {
    console.log('result', result)
    if (result && result.data) {
      core.setOutput('data', result.data)
    }
  })
  .catch(error => {
    console.log('error', error)
    core.setFailed(error.message)
  })
