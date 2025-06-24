
class UiEventHandler
{
	static buttonGenerate_Clicked()
	{
		var d = document;
		var textareaDirectoryTree =
			d.getElementById("textareaDirectoryTree");

		var directoryTreeAsString =
			textareaDirectoryTree.value;

		var directoryTreeRoot =
			DirectoryTreeNode.fromString(directoryTreeAsString);

		var generator =
			new CodeFromDirectoryTreeGenerator(directoryTreeRoot);

		var selectCodeType =
			d.getElementById("selectCodeType");
		var codeTypeName = selectCodeType.value;

		var codeGenerated =
			codeTypeName == "HTML Script Host"
			? generator.generateHtmlScriptHost()
			: codeTypeName == "Import-Classes-from-Namespace .ts"
			? generator.generateTypeScriptImportClassesFromNamespace()
			: "Error: Unrecognized Code Type: " + codeTypeName + ".";

		var textareaCodeGenerated =
			d.getElementById("textareaCodeGenerated");
		textareaCodeGenerated.value = codeGenerated;

		var generator = new CodeFromDirectoryTreeGenerator();
	}

	static inputFile_Changed(inputFile)
	{
		var file = inputFile.files[0];
		if (file != null)
		{
			var fileReader = new FileReader();
			fileReader.onload = (event) =>
			{
				var fileText = event.target.result;
				var d = document;
				var textareaDirectoryTree =
					d.getElementById("textareaDirectoryTree");
				textareaDirectoryTree.value = fileText;
			};
			fileReader.readAsText(file);
		}
	}
}
