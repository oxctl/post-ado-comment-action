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
  ado-organization: 'jedis'
  ado-project: 'The Light Side'
  ado-username: obiwan@jedis.com
  ado-personal-token: this_has_to_be_private
```

### Releasing

This library is published to npmjs and to make a new release do:
```bash
    npm version minor
```

And then if it completes ok push the tags and GitHub actions will build and publish the package to npmjs.

```bash
    git push
    git push --tags
```

then you want to update the major version tag to point to the latest release (updating the versions):

```bash
    git push origin -f v1.3.0:v1
```
