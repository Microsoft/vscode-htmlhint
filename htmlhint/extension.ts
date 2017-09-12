import * as path from 'path';
import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

    // We need to go one level up since an extension compile the js code into
    // the output folder.
    let serverModulePath = path.join(__dirname, '..', 'server', 'server.js');
    let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
    let serverOptions: ServerOptions = {
        run: { module: serverModulePath },
        debug: { module: serverModulePath, options: debugOptions }
    };

    // Get file types to lint from user settings
    let config = workspace.getConfiguration('htmlhint');
    let extensions = config.get('extensions');
    
    // Set options
    let clientOptions: LanguageClientOptions = {
        documentSelector: extensions,
        synchronize: {
            configurationSection: 'htmlhint',
            fileEvents: workspace.createFileSystemWatcher('**/.htmlhintrc')
        }
    }

    let forceDebug = false;
    let client = new LanguageClient('HTML-hint', serverOptions, clientOptions, forceDebug);
    context.subscriptions.push(new SettingMonitor(client, 'htmlhint.enable').start());
}
