/// <reference types="jest" />
/// <reference types="node" />

import 'expect-puppeteer';
import { Page, Browser } from 'puppeteer';

declare global {
    var page: Page;
    var browser: Browser;
}

export {}; // Make this file a module
