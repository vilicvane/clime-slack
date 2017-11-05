[![NPM Package](https://badge.fury.io/js/clime-slack.svg)](https://www.npmjs.com/package/clime-slack)

# Clime Slack (Shim & Utilities)

[Clime](https://github.com/vilic/clime) is a command-line interface framework for TypeScript. The beauty of Clime is that its core is not coupled with standard IO streams, and it uses a shim to generate proper contents for the interface. And in this case, `clime-slack` provides shim and utilities for Slack slash commands.

This (`clime-slack`) is more of a showcase project though it might actually be useful if you decide to write one Slack slash commands application with Clime.

## Usage

### Shim

You can use `SlackShim` with framework you like, in this example we are using `express`.

**src/main.ts**

```ts
import * as Path from 'path';

import * as BodyParser from 'body-parser';
import {CLI} from 'clime';
import * as express from 'express';

import {SlackShim} from '..';

let cli = new CLI('/', Path.join(__dirname, 'commands'));
let shim = new SlackShim(cli /*, [token]*/);

let app = express();

app.use(
  BodyParser.urlencoded({
    extended: false,
  }),
);

app.post('/api/slack/command', async (req, res) => {
  let result = await shim.execute(req.body);
  res.json(result);
});

app.listen(10047);
```

### Commands

It's basically the same writing a Slack slash commands as writing a normal Clime command:

**src/commands/demo.ts**

```ts
import {Command, command, param} from 'clime';

import {SlackUser} from '../..';

@command({
  description: 'This is a command for printing a greeting message',
})
export default class extends Command {
  execute(
    @param({
      description: 'A slack user',
      required: true,
    })
    user: SlackUser,
  ) {
    return `Hello, ${user}, your ID is ${user.id}!`;
  }
}
```

In the example above, we are using castable `SlackUser` provided by `clime-slack`. To make this valid, you will need to check the "Escape channels, users, and links sent to your app" settings in your Slack slash command configuration.

## License

MIT License.
