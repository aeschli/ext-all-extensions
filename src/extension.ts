// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ext-all-extensions" is now active!');

	const channel = vscode.window.createOutputChannel('extensions');

	const asExtensionKind = (extensionKind: vscode.ExtensionKind) => {
		switch (extensionKind) {
			case vscode.ExtensionKind.UI: return 'UI';
			case vscode.ExtensionKind.Workspace: return 'Workspace';
			default: return 'unknown';
		}
	};

	const readmeLength = async (extension: vscode.Extension<void>) => {
		const readmePath = vscode.Uri.joinPath(extension.extensionUri, 'README.md');
		try {
			const readme = await vscode.workspace.fs.readFile(readmePath);
			return readme.length;
		} catch (e) {
			return 'Failed to read README.md';
		}
	};

	const printExtensions = async () => {
		channel.show();
		const extensions = vscode.extensions.allAcrossExtensionHosts;
		for (const extension of extensions) {
			channel.appendLine(`* ${extension.id}`);
			channel.appendLine(`  * extensionUri: ${extension.extensionUri}`);
			try {
				const contributions = extension.packageJSON.contributes || {};
				channel.appendLine(`  * extensionKind: ${asExtensionKind(extension.extensionKind)}`);
				channel.appendLine(`  * export: ${extension.isActive ? typeof extension.exports : 'not active'}`);
				channel.appendLine(`  * contributes: ${Object.keys(contributions).join(', ')}`);
				channel.appendLine(`  * access readme: ${await readmeLength(extension)}`);
				channel.appendLine(`  * access vscode.extensions.getExtension(id, false): ${!!vscode.extensions.getExtension(extension.id, false)}`);
				channel.appendLine(`  * access vscode.extensions.getExtension(id, true): ${!!vscode.extensions.getExtension(extension.id, true)}`);
			} catch (e) {
				channel.appendLine(`  * error: ${extension.extensionUri}`);
			}
		}
	};

	vscode.extensions.onDidChange(() => {
		channel.appendLine(`** Extensions changed **`);
	});


	let disposable = vscode.commands.registerCommand('ext-all-extensions.showExtensions', async () => {
		printExtensions();
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
