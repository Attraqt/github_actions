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

We will use the [activities repository](https://github.com/Attraqt/activities/tree/master/.github/workflows) in order to demonstrate the following examples.

### [Deploy grpc](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/deploy-grpc.yml)

#### Inputs

| Input       | Description        | Example        |
|-------------|--------------------|----------------|
| module_name | Name of the module | **activities** |

#### Secrets

| Secret                              | 
|-------------------------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   |
| GH_PACKAGES_READ_ACCESS_TOKEN       |
| GH_DEPLOYMENT_CREATION_ACCESS_TOKEN |

### [Deploy job](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/deploy-job.yml)

#### Inputs

| Input       | Description        | Example                                                                                                                                  |
|-------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| module_name | Name of the module | **activities**                                                                                                                           |
| job_name    | Name of the job    | **enricher**, for [_deploy-jobs-enricher_](https://github.com/Attraqt/activities/blob/master/.github/workflows/deploy-jobs-enricher.yml) |

#### Secrets

| Secret                              | 
|-------------------------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   |
| GH_PACKAGES_READ_ACCESS_TOKEN       |
| GH_DEPLOYMENT_CREATION_ACCESS_TOKEN |

### [Publish protobuf](https://github.com/Attraqt/github_workflows/blob/main/.github/workflows/publish-protobuf.yml)

#### Inputs

| Input       | Description        | Example        |
|-------------|--------------------|----------------|
| module_name | Name of the module | **activities** |

#### Secrets

| Secret                              | 
|-------------------------------------|
| GCP_PUBLISHER_SERVICE_ACCOUNT_KEY   |
| GITHUB_TOKEN                        |