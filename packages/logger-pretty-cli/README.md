# `@gradientedge/logger-pretty-cli`

## Usage

This package exposes the `pretty-logs` binary, which pretty prints
JSON log messages exposed by `@gradientedge/logger`.

### Using the binary

If your server runs with the following command...

```bash
node server.js
```

...then you can pretty print the logs by piping both `stdout` and `stderr`
to the `pretty-logs` command:

```bash
node server.js 2>&1 | pretty-logs
```
