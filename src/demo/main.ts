// tslint:disable:no-implicit-dependencies

import 'source-map-support/register';

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
