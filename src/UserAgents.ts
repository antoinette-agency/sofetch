import {Browser} from "./browser.ts";
import {OS} from "./OS.ts";

interface UserAgent {
    browser:Browser,
    os:OS,
    value: string
}
export const UserAgents:UserAgent[] = [
    {
        browser:"Chrome",
        os:"Windows",
        value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    },
    {
        browser:"Firefox",
        os:"Windows",
        value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0"
    },
    {
        browser:"Edge",
        os:"Windows",
        value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0"
    },
    {
        browser:"Chrome",
        os:"macOS",
        value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    },
    {
        browser:"Firefox",
        os:"macOS",
        value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0"
    },
    {
        browser:"Safari",
        os:"macOS",
        value:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15"
    },
    {
        browser:"Chrome",
        os:"Linux",
        value:"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    },
    {
        browser:"Firefox",
        os:"Linux",
        value:"Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0"
    },
]