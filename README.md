# workiva-api-consumer

Demonstrates a very simple use case for importing data from github and dumping it into a Workiva spreadsheet.

## How to use

1. Install Node v6.x (not tested on any other version).
2. Run `npm install`.
3. Get credentials for workiva and github.
  * For Workiva, you need to be able to create OAuth2 grants.
  * For Github, head to the [OAuth2/Developer Applications](https://github.com/settings/developers) page and create a new app.  You do not need to provide an Authorization Callback URL.
4. In bash...
  * `export WORKIVA_API_URL=http://whatever.api.you/want/to/use`
  * `export WORKIVA_AUTH_TOKEN=Your-Workiva-Oauth2-grant-token`
  * `export GH_CLIENT_ID=client-id-from-your-github-developer-application`
  * `export GH_CLIENT_SECRET=client-secret-from-your-github-developer-application`
5. Then do `npm start`.
6. Open Postman or any other HTTP request app and hit the `/sendToWorkiva` endpoint with a payload like this...

```json
{
    "github_owner": "nodejs",
    "github_repo": "node"
}
```

Open wk-dev Spreadsheets and look for a new sheet named something like `workiva-api-consumer-sheet-(some large decimal)`.
