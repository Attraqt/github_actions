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

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run(): Promise<void> {
  const token = defaultParse('token')
  const owner = defaultParse('owner')
  const repo = defaultParse('repo')
  const deploymentId = defaultParse('deployment_id')
  const waitingTime = defaultParse('waiting_time') || 10

  let stop = false

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
        if (result.data.length > 0) {
          const lastStatus = result.data[0]
          if (
            ['success', 'failure', 'error', 'inactive'].includes(
              lastStatus.state
            )
          ) {
            console.log('Stopping...')
            stop = true
            if (['failure', 'error'].includes(lastStatus.state)) {
              core.setFailed(lastStatus.description)
            }
          }
        }
      }
    } catch (error: any) {
      console.log('error', error)
      core.setFailed(error.message)
      stop = true
    }

    await sleep(waitingTime * 1000)
  }
}

run()
