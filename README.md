# github_workflows

## :warning: To change
This is a **.github** "clone", in order to test and use github workflows. 
It should be removed and replaced by **.github** repository (currently not reusable because of privacy).

## :information_source: Use

This repository allows you to use different github workflows, in order for you to not copy paste **.yaml** files anymore for the CI/CD repository.

Workflows are located in the _.github/workflows_ folder.

For now, there are three workflows :

 - _deploy grpc_, in order to deploy your grpc service.
 - _deploy job_, in order to deploy a specific job on Dataflow.
 - _publish protobuf_, in order to publish a new protobuf contract.


## :green_book: How to

We will use the [identities repository](https://github.com/Attraqt/identities/tree/master/.github/workflows) in order to demonstrate the following examples.

<details>

<summary> Deploy grpc </summary>

The workflow is located [here](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/deploy-grpc.yml).

#### Inputs

| Input                 | Description                                                             | Type    | Example                                                                                                                             |
|-----------------------|-------------------------------------------------------------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------|
| **module_name**       | Name of the module                                                      | String  | _identities_                                                                                                                        |
| **service_name**      | Name of the service                                                     | String  | _config-grpc_, for [deploy-config-grpc](https://github.com/Attraqt/identities/blob/master/.github/workflows/deploy-config-grpc.yml) |
| **deploy_on_gateway** | To set if a docker image has to be pushed on the gateway (**optional**) | Boolean | _true_, for [deploy-grpc **in items**](https://github.com/Attraqt/items/blob/master/.github/workflows/deploy-grpc.yml)              |


#### Secrets

| Secret                              | Required           | 
|-------------------------------------|--------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   | :white_check_mark: |
| GH_PACKAGES_READ_ACCESS_TOKEN       | :white_check_mark: |
| GH_DEPLOYMENT_CREATION_ACCESS_TOKEN | :white_check_mark: |

</details>

<details>

<summary> Deploy job </summary>

The workflow is located [here](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/deploy-job.yml).

#### Inputs

| Input           | Description        | Type   | Example                                                                                                                                                            |
|-----------------|--------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **module_name** | Name of the module | String | _identities_                                                                                                                                                       |
| **job_name**    | Name of the job    | String | _user-merges-router_, for [deploy-jobs-user-merges-router](https://github.com/Attraqt/identities/blob/master/.github/workflows/deploy-jobs-user-merges-router.yml) |

#### Secrets

| Secret                              | Required                      |
|-------------------------------------|-------------------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   | :white_check_mark:            |
| GH_PACKAGES_READ_ACCESS_TOKEN       | :white_check_mark:            |
| GH_DEPLOYMENT_CREATION_ACCESS_TOKEN | :white_check_mark:            |
| ARTIFACTORY_PASSWORD                | :negative_squared_cross_mark: |

</details>

<details>

<summary>Publish protobuf</summary>

The workflow is located [here](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/publish-protobuf.yml).

#### Inputs

| Input            | Description         | Type   | Example                                                                                                                             |
|------------------|---------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------|
| **module_name**  | Name of the module  | String | _identities_                                                                                                                        |

#### Secrets

| Secret                            | Required           | 
|-----------------------------------|--------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY | :white_check_mark: |
| GITHUB_TOKEN                      | :white_check_mark: |

</details>