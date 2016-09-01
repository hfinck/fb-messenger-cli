# fb-messenger-cli
Send mock messages to Messenger using the Facebook Messenger Platform

## Usage

### Configuration
For every message we need a recipient and an access token to be used for each call.
Luckily there is the option set these as defaults so you do not have to enter them over
and over again.

```bash
  messenger-cli.js defaults <recipient_id> <access_token>
```

### Sending MessageS
Messages can be send using the `send` command within the CLI. If you have set your messaging defaults in the previous step you don't even need to provide a recipient ID and access token.

```bash
  messenger.cli.js send <type>
```

You can have a look at which message types are available using the `--help` option.
This is dynamically inferred based on which files are present in the `messages` directory.


### Webhook Server Setup
If you want to receive Messenger messages on your local machine you have to set up a Messenger webhook on your Facebook application.

Facebook tries to verify if the endpoint can actually receive messages so we need a local server, which listens to these type of requests and responds to any authentication messages by Facebook.


### Localhost Tunnels
I recommend to use ngrok to pipe messages to your local machine. ngrok can be installed by your favorite package manager (e.g brew on Mac) or downloaded directly through the website [here](https://ngrok.com/download).

1. Start a local messaging server
```bash
messenger-cli.js server start --verify_token=<random_string>
```
Make sure to to use this verify token in the Messenger webhook section on your app on Facebook.

2. Start ngrok to receive a publicly available address:
```bash
ngrok http 8080 -host-header=rewrite -region eu -bind-tls=true
```

3. Enter your public address and verify token under the Messenger webhook section on Facebook.

Facebook now connects with your local machine awaiting an auth response. If everything went fine the dialog closes and the webhook connection is established.

Now you should connect a Facebook page to your app in order to receive it's messages.
