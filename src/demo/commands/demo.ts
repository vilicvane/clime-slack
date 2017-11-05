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
