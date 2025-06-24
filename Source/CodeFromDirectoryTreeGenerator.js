
class CodeFromDirectoryTreeGenerator
{
	constructor(directoryTreeRoot)
	{
		this.directoryTreeRoot = directoryTreeRoot;
	}

	generateHtmlScriptHost()
	{
		var lines = [];

		lines.push("<html>");
		lines.push("<body>");

		var directoryTreeAsHtml =
			this.directoryTreeRoot.toStringHtmlScriptElements();

		lines.push(directoryTreeAsHtml);

		lines.push("</body>");
		lines.push("<html>");

		var newline = "\n";
		var text = lines.join(newline);

		return text;
	}

	generateTypeScriptImportClassesFromNamespace()
	{
		var lines = [];

		lines.push("import ns = [your namespace here];");
		lines.push("");

		var directoryTreeAsTypeScriptImports =
			this.directoryTreeRoot.toStringTypeScriptImportClassesFromNamespace();

		lines.push(directoryTreeAsTypeScriptImports);

		var newline = "\n";
		var text = lines.join(newline);

		return text;
	}
}
