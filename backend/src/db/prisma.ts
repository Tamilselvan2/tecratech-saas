import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
