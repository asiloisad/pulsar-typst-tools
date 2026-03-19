# typst-tools

Compile Typst documents with build tools, compile-on-save, and PDF viewer integration. Includes linter diagnostics, multiple simultaneous builds, and a built-in Typst installer.

## Features

- **Compilation**: Build documents using the `typst` compiler with configurable output format.
- **Compile-on-save**: Automatically recompile when the file is saved.
- **PDF viewing**: Open output PDFs internally via [pdf-viewer](https://web.pulsar-edit.dev/packages/pdf-viewer).
- **Linter integration**: Error and warning reporting via `linter-indie`. With [linter-bundle](https://github.com/asiloisad/pulsar-linter-bundle), errors display clickable references to source locations.
- **Multiple builds**: Compile multiple files simultaneously with independent build states.
- **Built-in installer**: Download the Typst binary directly from GitHub releases.

## Installation

To install `typst-tools` search for [typst-tools](https://web.pulsar-edit.dev/packages/typst-tools) in the Install pane of the Pulsar settings or run `ppm install typst-tools`. Alternatively, you can run `ppm install asiloisad/pulsar-typst-tools` to install a package directly from the GitHub repository.

## Installing Typst

This package requires the `typst` binary. You can install it in several ways:

**Via the package:**

Run the `Typst Tools: Install Typst` command from the command palette. This downloads the latest Typst release from GitHub and places the binary in the package's `bin/` directory.

**Manual installation:**

- **Windows**: `winget install --id Typst.Typst` or download from [typst/typst releases](https://github.com/typst/typst/releases)
- **macOS**: `brew install typst`
- **Linux**: `cargo install typst-cli` or download from [typst/typst releases](https://github.com/typst/typst/releases)

After installation, verify that `typst` is available:

```bash
typst --version
```

If `typst` is not in your PATH, set the full path in the package settings under **Path to Typst**.

## Commands

Commands available in `atom-workspace`:

- `typst-tools:install-typst`: download and install the Typst binary from GitHub releases.

Commands available in `atom-text-editor[data-grammar~="typst"]`:

- `typst-tools:compile`: (`F5`) compile the current Typst document,
- `typst-tools:watch`: (`Alt+F5`) toggle compile-on-save mode for the current file,
- `typst-tools:interrupt`: (`Ctrl+F5`) stop the current build process for the active file,
- `typst-tools:interrupt-all`: (`Ctrl+F6`) stop all running build processes,
- `typst-tools:clean-linter`: (`F6`) clear all linter messages,
- `typst-tools:open-pdf`: (`F7`) open the generated PDF in Pulsar,
- `typst-tools:list-fonts`: list all fonts available to Typst.

## Status bar

The status bar item shows the current build state with a live timer:

- **Typ** — idle, click to compile
- **Typ\*** — compile-on-save is enabled

**Mouse interactions:**

| Action | Effect |
| --- | --- |
| Left click | Compile |
| Alt + Left click | Toggle compile-on-save |
| Middle click | Split PDF / Typst source |
| Right click | Interrupt build and clear linter |

## Integration with pdf-viewer

This package works seamlessly with the [pdf-viewer](https://web.pulsar-edit.dev/packages/pdf-viewer) package:

- **Status bar**: The Typst status bar remains visible when viewing PDFs, allowing you to compile, open PDF, or interrupt builds directly from the PDF viewer.
- **Build waiting**: If you open a PDF while a build is in progress, the package will wait for completion and automatically open the updated PDF.

## Multiple simultaneous builds

The package supports compiling multiple Typst files simultaneously. Each file tracks its own build state independently, allowing you to start a compilation in one file while another is still building. The status bar updates to show the build state of the currently active file.

## Provided Service `typst-tools`

Allows other packages to integrate with Typst compilation. Subscribe to build events, query build status, and control compilation.

In your `package.json`:

```json
{
  "consumedServices": {
    "typst-tools": {
      "versions": {
        "1.0.0": "consumeTypstTools"
      }
    }
  }
}
```

In your main module:

```javascript
consumeTypstTools(service) {
  // Subscribe to build events
  this.subscriptions.add(
    service.onDidStartBuild(({ file }) => {
      console.log(`Build started: ${file}`);
    }),
    service.onDidFinishBuild(({ file, output }) => {
      console.log(`Build finished: ${file}`);
    }),
    service.onDidFailBuild(({ file, error, output }) => {
      console.log(`Build failed: ${file}`, error);
    }),
    service.onDidChangeBuildStatus(({ status, file, error }) => {
      console.log(`Build status changed: ${status}`);
    })
  );

  // Get current status for a specific file
  const { status, file } = service.getStatus(filePath);

  // Check if a specific file is currently building
  const building = service.isBuilding(filePath);
}
```

### Methods

| Method | Description |
| --- | --- |
| `onDidStartBuild(callback)` | Called when a build starts. Callback receives `{ file }`. |
| `onDidFinishBuild(callback)` | Called when a build succeeds. Callback receives `{ file, output }`. |
| `onDidFailBuild(callback)` | Called when a build fails. Callback receives `{ file, error, output }`. |
| `onDidChangeBuildStatus(callback)` | Called on any status change. Callback receives `{ status, file, error? }`. |
| `getStatus(filePath?)` | Returns status for a specific file or all builds if no path provided. |
| `isBuilding(filePath)` | Returns `true` if the specified file is currently being compiled. |
| `compile(filePath)` | Trigger compilation for the given file. |
| `interrupt(filePath)` | Interrupt the build for the given file. |
| `interruptAll()` | Interrupt all running builds. |
| `toggleCompileOnSave()` | Toggle compile-on-save mode for the active editor. |
| `isCompileOnSaveEnabled(filePath)` | Returns `true` if compile-on-save is active for the file. |

### Status values

- `'idle'` — No build in progress
- `'building'` — Build is currently running
- `'success'` — Last build completed successfully
- `'error'` — Last build failed

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub — any feedback's welcome!
