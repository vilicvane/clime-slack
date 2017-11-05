[![NPM Package](https://badge.fury.io/js/clime-slack.svg)](https://www.npmjs.com/package/clime-slack)

# Clime Slack (Shim & Utilities)

[Clime](https://github.com/vilic/clime) is a command-line interface framework for TypeScript. The beauty of Clime is that its core is not coupled with standard IO streams, and it uses a shim to generate proper contents for the interface. And in this case, `clime-slack` provides shim and utilities for Slack slash commands.

This (`clime-slack`) is more of a showcase project though it might actually be useful if you decide to write a Slack slash commands application with Clime.

## Usage

### Shim

You can use `SlackShim` with a web framework you like, in this example we are using `express`.

**src/main.ts**

```ts
import * as Path from 'path';

import * as BodyParser from 'body-parser';
import * as express from 'express';

import {CLI} from 'clime';
import {SlackShim} from 'clime-slack';


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

It's basically the same writing a Slack slash command as writing a normal Clime command:

**src/commands/demo.ts**

```ts
import {Command, command, param} from 'clime';
import {SlackUser} from 'clime-slack';

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

This package also provides utilities like `SlackChannel` and `SlackCommandContext` for your convenience.

## License

MIT License.
