const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const API_RESPONSE_OUTPUT_PARAM = 'api-response';
const ADO_USERNAME_INPUT_PARAM = 'ado-username';
const ADO_PERSONAL_TOKEN_INPUT_PARAM = 'ado-personal-token';
const ADO_ORGANIZATION_INPUT_PARAM = 'ado-organization';
const ADO_PROJECT_INPUT_PARAM = 'ado-project';
const WORK_ITEM_REGEXP = /AB#\d+/gi

try {
  // Action inputs defined in action metadata file
  const adoUsername = core.getInput(ADO_USERNAME_INPUT_PARAM);
  const adoPersonalToken = core.getInput(ADO_PERSONAL_TOKEN_INPUT_PARAM);
  const adoOrganization = core.getInput(ADO_ORGANIZATION_INPUT_PARAM);
  const adoProject = core.getInput(ADO_PROJECT_INPUT_PARAM);

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = github.context.payload;
  const pullRequest = payload.pull_request;
  const pullRequestTitle = pullRequest.title;
  const pullRequestLink = pullRequest._links.html.href;
  const pullRequestActor = github.context.actor;

  // Extract the PR work item id
  const workItem = pullRequestTitle.match(WORK_ITEM_REGEXP);
  if (!workItem) {
    const prFormatWarning = `The PR with title '${pullRequestTitle}' does not contain any work item id in the format AB#xxxxx, no messages will be sent`;
    console.warn(prFormatWarning);
    // If the PR title does not contain the work item, do not return an error because we don't want the action to fail for this.
    return;
  }
  // Extract the ADO work item id
  const adoWorkItemId = workItem[0].replace(/AB#/gi, '');
  // Build the ADO request with the parameters
  // https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/comments/add?view=azure-devops-rest-7.0&tabs=HTTP
  const adoRequestUrl = `https://dev.azure.com/${adoOrganization}/${adoProject}/_apis/wit/workItems/${adoWorkItemId}/comments?api-version=7.0-preview.3`;
  // Build the content of the request and the authorization
  const message = `An update to this work item has been deployed into test/beta by \"${pullRequestActor}\" with title \"${pullRequestTitle}\". You can check all the detailed work and changes <a href=\"${pullRequestLink}\">clicking the following link</a>.`;
  const workItemComment = { text: message };
  const auth = {
    username: adoUsername,
    password: adoPersonalToken
  };

  axios.post(adoRequestUrl, workItemComment, { auth: auth } )
    .then(function (response) {
      core.setOutput(API_RESPONSE_OUTPUT_PARAM, response);
    }).catch(function (error) {
      core.setOutput(API_RESPONSE_OUTPUT_PARAM, error);
    });

} catch (error) {
  core.setFailed(error.message);
}