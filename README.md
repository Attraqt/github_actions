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

| Input           | Description        | Example      |
|-----------------|--------------------|--------------|
| **module_name** | Name of the module | _identities_ |

#### Secrets

| Secret                              | 
|-------------------------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   |
| GH_PACKAGES_READ_ACCESS_TOKEN       |
| GH_DEPLOYMENT_CREATION_ACCESS_TOKEN |

</details>

<details>

<summary> Deploy job </summary>

The workflow is located [here](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/deploy-job.yml).

#### Inputs

| Input       | Description        | Example                                                                                                                                                  |
|-------------|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **module_name** | Name of the module | _identities_                                                                                                                                             |
| **job_name**    | Name of the job    | _user-merges-router_, for [deploy-jobs-user-merges-router](https://github.com/Attraqt/identities/blob/master/.github/workflows/deploy-jobs-user-merges-router.yml) |

#### Secrets

| Secret                              | 
|-------------------------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   |
| GH_PACKAGES_READ_ACCESS_TOKEN       |
| GH_DEPLOYMENT_CREATION_ACCESS_TOKEN |

</details>

<details>

<summary>Publish protobuf</summary>

The workflow is located [here](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/publish-protobuf.yml).

#### Inputs

| Input                | Description             | Example                                                                                                                        |
|----------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| **module_name**      | Name of the module      | _identities_                                                                                                                   |
| **environment_name** | Name of the environment | _config_, for [deploy-config-grpc](https://github.com/Attraqt/identities/blob/master/.github/workflows/deploy-config-grpc.yml) |

#### Secrets

| Secret                              | 
|-------------------------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   |
| GITHUB_TOKEN                        |

</details>