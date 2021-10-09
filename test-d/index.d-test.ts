import { FastifyInstance } from 'fastify';
import {expectType} from 'tsd'

import lc39 from '../';

const server = lc39('../tests/modules/correct-module.js', {})

expectType<FastifyInstance>(server)
