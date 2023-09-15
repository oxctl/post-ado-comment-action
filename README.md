# Post ADO Comment action
Contains a custom Github action to post comments to Azure DevOps work items.

## Inputs

### `ado-organization`

**Required** The ADO organization.

### `ado-project`

**Required** The ADO project.

### `ado-username`

**Required** The ADO username that will be the owner of the comment IMPORTANT: Do not reveal this from the caller action, use secrets.

### `ado-personal-token`

**Required** The ADO personal token for the username. IMPORTANT: Do not reveal this from the caller action, use secrets.

## Outputs

### `api-response`

The Azure DevOps API response after requesting to post a comment.

## Example usage

```yaml
uses: oxctl/post-ado-comment-action@v1.0
with:
  ado-username: obiwan@jedis.com
  ado-personal-token: this_has_to_be_private
```