import * as core from '@actions/core'
import * as github from '@actions/github'
import {request} from '@octokit/request'

function parseArray(inputName: string): any[] | undefined {
  const inputValue = core.getInput(inputName)
  if (inputValue === '') {
    return undefined
  }
  if (inputValue === '<<EMPTY>>') {
    return []
  }
  return inputValue.split(',')
}

function parseBoolean(inputName: string): boolean {
  const inputValue = core.getInput(inputName)
  return inputValue === 'true'
}

function parseNumber(inputName: string): number | undefined {
  try {
    const inputValue = parseInt(core.getInput(inputName))
    if (inputName === 'waiting_time' && inputValue < 0) {
      return undefined
    }
    return inputValue
  } catch (error: any) {
    return undefined
  }
}

function defaultParse(inputName: string): any {
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
  const ref = defaultParse('ref')
  const task = defaultParse('task')
  const auto_merge = parseBoolean('auto_merge')
  const required_contexts = parseArray('required_contexts')
  const payload = defaultParse('payload')
  const environment = defaultParse('environment')
  const description = defaultParse('description')
  const transient_environment = parseBoolean('transient_environment')
  const production_environment = parseBoolean('production_environment')
  const waitingTime = parseNumber('waiting_time') || 10
  let deploymentId: number | undefined = undefined

  let stop = false

  const requestWithAuth = request.defaults({
    headers: {
      authorization: `Bearer ${token}`
    },
    mediaType: {
      previews: ['ant-man']
    }
  })

  //sending development call
  try {
    const result = await requestWithAuth(
      'post /repos/{owner}/{repo}/deployments',
      {
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
      }
    )
    console.log('result', result)
    if (result && result.data && result.data.id) {
      deploymentId = result.data.id
      core.setOutput('id', result.data.id)
    }
    if (result && result.data && result.data.number) {
      core.setOutput('number', result.data.number)
    }
  } catch (error: any) {
    console.log('error', error)
    core.setFailed(error.message)
  }

  console.log(`Deploying on ${repo}... (https://github.com/${owner}/${repo})`)

  //getting statuses and checking if running or over
  while (!stop) {
    try {
      const result = await requestWithAuth(
        'GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses',
        {
          token,
          owner,
          repo,
          deployment_id: deploymentId!!
        }
      )
      if (result && result.data) {
        if (result.data.length > 0) {
          const lastStatus = result.data[0]
          if (
            ['success', 'failure', 'error', 'inactive'].includes(
              lastStatus.state
            )
          ) {
            stop = true
            if (['failure', 'error'].includes(lastStatus.state)) {
              core.setFailed(lastStatus.description)
            } else if (lastStatus.state === 'success') {
              console.log(lastStatus.description)
            } else {
              console.log('Inactive job.')
            }
          }
        }
      }
    } catch (error: any) {
      core.setFailed(error.message)
      stop = true
    }

    if (!stop) await sleep(waitingTime * 1000)
  }
}

run()
