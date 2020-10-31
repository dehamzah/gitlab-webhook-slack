# Gitlab Webhook Slack

To post message to slack based on event happened in gitlab, we can easily setup using [Incoming WebHooks](https://wahyooguardian.slack.com/apps/A0F7XDUAZ-incoming-webhooks) slack app, but it just sent the content as it is. This project act as a middleman to intercept incoming webhook gitlab and reformat the messages. Currently its support the following webhook handler:

### Note Event

Transform the gitlab usernames to slack usernames so the person in slack is mentioned whenever someone mention him / her in gitlab, or if someone commented on his / her merge requests or issues.

![slack message preview](https://user-images.githubusercontent.com/6959476/97783059-cacff400-1bc7-11eb-862d-75322c329d68.png)

## Installation

This project is using vercel as development and deployment. You can easily run in development using the following commands:

```
yarn install
yarn start
```

But before you can start it, you need to prepare the `vercel.json`.

### Setup Environment Config

Create the `vercel.json` in the root directory, with the following template :

```
{
  "env": {
    "GITLAB_API_BASE_URL": "https://gitlab.com/api/v4/users/",
    "GITLAB_PA_TOKEN": "xxx",
    "SLACK_WEBHOOK_CHANNEL_URL": "",
    "GITLAB_SLACK_USERNAMES_MAP": "my_gitlab_username:my_slack_user_id",
    "IGNORED_GITLAB_USERNAMES": "ignored_gitlab_username",
    "GITLAB_WEBHOOK_TOKEN": "xxx"
  }
}
```

#### GITLAB_API_BASE_URL

You don't need to change this, basically this is used to get the gitlab username by user id, since the payload we got from note event is returning user id in property author of merge requests or issues.

#### GITLAB_PA_TOKEN

Create your gitlab [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#creating-a-personal-access-token) so that we can call gitlab api to get user info.

#### SLACK_WEBHOOK_CHANNEL_URL

Get your slack webhook channel post url to post our message to. You can follow [this step](#setup-slack-app) to get one.

#### GITLAB_SLACK_USERNAMES_MAP

In order to mention the correct person in slack, we need to map the gitlab usernames with the slack user ids. Here is the example value of this enviroment config:

```
kuro:UN91P81A1
```

The left side of semicolon is for gitlab username, and right side is for slack user id. You can get the slack user id by clicking on slack user profile and click more.

![slack-profile](https://user-images.githubusercontent.com/6959476/97783863-0a4d0f00-1bcd-11eb-8974-473001caaa56.png)

You can add as many gitlab username x slack user id mapping.

```
kuro:UN91P81A1,hamzah:UN91Q91A1,shiro:UX91Q93A1
```

#### IGNORED_GITLAB_USERNAMES

Sometimes you might have automated bot commentted in your merge request, and you don't want to clutter your webhook note notification for not actual comment notification. You can do it by listing the ignored gitlab usernames here, for example:

```
my_bot,another_bot
```

#### GITLAB_WEBHOOK_TOKEN

After you deployed the project, you will setup your custom webhook in your project settings webhook. This is the token that you will fill in 'Secret Token' field when you setup the webhook.

### Setup Slack App

1. You need to create slack app to post the webhook messages, you can create one from [here](https://api.slack.com/apps?new_app=1).
2. Activate the incoming webhook options [here](https://api.slack.com/apps/A01DB2ULS5D/incoming-webhooks?).
3. Click 'Add New Webhook to Workspace' at the bottom of the page, you will be redirected to choose the channel where you want to post the message to. Choose one, and click 'Allow'.
4. Copy the Webhook URL, we will need it later.

## Deployment and Usage

```
yarn global add vercel
vercel
```

### Setup Gitlab Webhook

1. Go to your project settings webhook and add the deployed url to field 'URL', example: `${deployedUrl}/api/gitlab/comment-events`
2. Fill the 'Secret Token' same as the value in 'GITLAB_WEBHOOK_TOKEN' environment config.
3. Checklist only the trigger 'Comments'.
4. Click 'Add webhook.

## Development

```
yarn start
```

Start http tunneling using [ngrok](https://ngrok.com/) to post the gitlab events to your local computer.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

ISC
