import * as core from '@actions/core'
import * as github from '@actions/github'
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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run(): Promise<void> {
  const token = defaultParse('token')
  const owner = defaultParse('owner')
  const repo = defaultParse('repo')
  const deploymentId = defaultParse('deployment_id')
  const waitingTime = defaultParse('waiting_time') || 10

  const stop = false

  const requestWithAuth = request.defaults({
    headers: {
      authorization: `Bearer ${token}`
    },
    mediaType: {
      previews: ['ant-man']
    }
  })

  while (!stop) {
    try {
      const result = await requestWithAuth(
        'GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses',
        {
          token,
          owner,
          repo,
          deployment_id: deploymentId
        }
      )
      console.log('result', result)
      if (result && result.data) {
        core.setOutput('data', result.data)
      }
    } catch (error: any) {
      console.log('error', error)
      core.setFailed(error.message)
    }

    await sleep(waitingTime * 1000)
  }
}

run()
