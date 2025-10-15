module.exports = {
    launch: {
        headless: true,
        args: [
            '--allow-insecure-localhost',
            '--disable-web-security',
            '--ignore-certificate-errors',
            '--disable-site-isolation-trials'
        ]
    },
};
