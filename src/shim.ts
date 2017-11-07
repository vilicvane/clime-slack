import * as Util from 'util';

import {CLI, isPrintable} from 'clime';

import * as ShellWords from 'shellwords';
import stripAnsi = require('strip-ansi');
import through2 = require('through2');

import {SlackCommandContext, isSlackCommandResponse} from './slack';

export class SlackShim {
  constructor(public cli: CLI, public token?: string) {}

  async execute(context: SlackCommandContext): Promise<object> {
    let {token, command, text} = context;

    if (this.token && token !== this.token) {
      return {error: 'Permission denied'};
    }

    if (command.startsWith('/')) {
      command = command.slice(1);
    }

    text = text.replace(/[<>|]/g, '\\$&');

    let args = ShellWords.split(text);

    try {
      let result = await this.cli.execute([command, ...args], context);

      if (isPrintable(result)) {
        let printResult = new PrintResult();

        await result.print(printResult.through, printResult.through);

        return {
          attachments: [
            {
              color: 'good',
              text: code(printResult.plainText),
              mrkdwn_in: ['text'],
            },
          ],
        };
      } else if (isSlackCommandResponse(result)) {
        return result;
      } else {
        return {
          attachments: [
            {
              color: 'good',
              text: code(`${result}`),
              mrkdwn_in: ['text'],
            },
          ],
        };
      }
    } catch (error) {
      if (isPrintable(error)) {
        let printResult = new PrintResult();

        await error.print(printResult.through, printResult.through);

        return {
          attachments: [
            {
              color: 'danger',
              text: code(printResult.plainText),
              mrkdwn_in: ['text'],
            },
          ],
        };
      } else if (error instanceof Error) {
        return {
          attachments: [
            {
              color: 'danger',
              text: code(error.stack || error.message),
              mrkdwn_in: ['text'],
            },
          ],
        };
      } else {
        return {
          attachments: [
            {
              color: 'danger',
              text: code(Util.format(error)),
              mrkdwn_in: ['text'],
            },
          ],
        };
      }
    }
  }
}

class PrintResult {
  text = '';

  through = through2((chunk: string, _encoding, callback) => {
    this.text += chunk;
    callback();
  });

  get plainText(): string {
    return stripAnsi(this.text);
  }
}

function code(text: string): string {
  return `\`\`\`${text}\`\`\``;
}
