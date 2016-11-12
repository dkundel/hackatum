# hackatum
Code from the workshop done at hackaTUM

## Requirements

- [Node.js](https://nodejs.org) and either [`npm`](https://npmjs.org) or [`yarn`](https://yarnpkg.com)
- [Ngrok](https://ngrok.com) for tunneling your localhost
- A Twilio account and a Twilio phone number - [get a free account here](https://www.twilio.com/try-twilio)

## Setup

1. Clone the repository
```bash
git@github.com:dkundel/hackatum.git
cd hackatum
```

2. Install dependencies

    a) Via `npm`:
    ```bash
    npm install
    ```
    b) Via `yarn`:
    ```bash
    yarn
    ```

3. Start a local tunnel using `ngrok`
```bash
ngrok tunnel 3000
```

4. Place the url inside the `index.js` in the `SERVER_BASE_URL`
5. Make sure to store your `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` as the respective environment variables.
6. Start the server:
```bash
npm start
```
7. Configure a Twilio phone number with the webhook `http://YOUR_NGROK_URL/messages`
8. Send an SMS with the respective song you want to hear to that phone number.