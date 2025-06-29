
class DirectoryTreeNode
{
	constructor(directoryName, filesInDirectoryNames, children)
	{
		this.directoryName = directoryName;
		this.filesInDirectoryNames = filesInDirectoryNames;
		this.children = children.map(x => x.parentSet(this) );
	}

	static create()
	{
		return new DirectoryTreeNode("", [], []);
	}

	static fromDirectoryName(directoryName)
	{
		return new DirectoryTreeNode(directoryName, [], []);
	}

	static fromString(directoryTreeAsString)
	{
		var newline = "\n";
		var directoryTreeAsLines =
			directoryTreeAsString.split(newline);

		// Remove any lines for non-JavaScript files.
		directoryTreeAsLines =
			directoryTreeAsLines.filter
			(
				line =>
					line.indexOf(".") == -1
					|| line.endsWith(".js")
			);
		
		// Remove the characters representing lines in a diagram.
		directoryTreeAsLines =
			directoryTreeAsLines.map
			(
				x => 
					x
					.split("|").join(" ")
					.split("+").join(" ")
					.split("-").join(" ")
					.split("\\").join(" ")
			);

		// Remove any blank lines.
		directoryTreeAsLines =
			directoryTreeAsLines.filter(x => x.trim() != "");

		// Replace spaces with tabs.
		directoryTreeAsLines =
			directoryTreeAsLines.map
			(
				x => x.split("    ").join("\t")
			);

		// Remove any lines with no identation.
		directoryTreeAsLines =
			directoryTreeAsLines.filter(x => x.startsWith("\t") );

		var treeNodeRoot = DirectoryTreeNode.create();
		var treeNodeCurrent = treeNodeRoot;

		for (var i = 0; i < directoryTreeAsLines.length; i++)
		{
			var line = directoryTreeAsLines[i];

			var indentsOnThisLine = 0;

			while (line.startsWith("\t") )
			{
				indentsOnThisLine++;
				line = line.substr(1);
			}

			if (line.endsWith(".js") )
			{
				treeNodeCurrent.fileInDirectoryNameAdd(line);
			}
			else
			{
				var treeNodeForLine =
					DirectoryTreeNode.fromDirectoryName(line);

				var treeNodeCurrentDepth = treeNodeCurrent.depth();

				if (indentsOnThisLine > treeNodeCurrentDepth)
				{
					// Subdirectory.
					treeNodeCurrent.childAdd(treeNodeForLine);
				}
				else if (indentsOnThisLine == treeNodeCurrentDepth)
				{
					// Sibling directory.
					treeNodeCurrent = treeNodeCurrent.parent;
					treeNodeCurrent.childAdd(treeNodeForLine);
				}
				else if (indentsOnThisLine < treeNodeCurrentDepth)
				{
					var depthToRise =
						treeNodeCurrentDepth - indentsOnThisLine + 1;
					for (var d = 0; d < depthToRise; d++)
					{
						treeNodeCurrent = treeNodeCurrent.parent;
					}
					treeNodeCurrent.childAdd(treeNodeForLine);
				}
				treeNodeCurrent = treeNodeForLine;

			}
		}

		return treeNodeRoot;
	}

	static fromParent(parent)
	{
		return DirectoryTreeNode.create().parentSet(parent);
	}

	childAdd(child)
	{
		this.children.push(child);
		child.parentSet(this);
		return this;
	}

	depth()
	{
		if (this._depth == null)
		{
			this._depth =
				this.parent == null
				? 0
				: this.parent.depth() + 1;
		}
		return this._depth;
	}

	directoryPath()
	{
		if (this._directoryPath == null)
		{
			this._directoryPath =
				this.parent == null
				? ""
				: this.parent.directoryPath() + this.directoryName + "/";
		}
		return this._directoryPath;
	}

	fileInDirectoryNameAdd(fileName)
	{
		this.filesInDirectoryNames.push(fileName);
	}

	parentSet(value)
	{
		this.parent = value;
		this._directoryPath = null;
		return this;
	}

	toStringHtmlScriptElements()
	{
		var directoryPath = this.directoryPath();

		var filesAsHtmlStrings =
			this.filesInDirectoryNames.map
			(
				x =>
					"<script type='text/javascript'"
					+ " src='" + directoryPath + x + "'"
					+ " ></script>"
			);
		var childrenAsHtmlStrings =
			this.children.map(x => x.toStringHtmlScriptElements() );

		var thisAndDescendantsAsStrings = [];
		thisAndDescendantsAsStrings.push(...filesAsHtmlStrings);
		thisAndDescendantsAsStrings.push(...childrenAsHtmlStrings);

		var newline = "\n";
		var thisAndDescendantsAsString =
			thisAndDescendantsAsStrings.join(newline);

		return thisAndDescendantsAsString;
	}

	toStringTypeScriptImportClassesFromNamespace()
	{
		var filesAsImportLines =
			this.filesInDirectoryNames.map
			(
				x =>
				{
					var className = x.split(".")[0];
					var returnValue =
						"import " + className + " = ns." + className + ";";
					return returnValue;
				}
			);
		var childrenAsImportLines =
			this.children.map
			(
				x => x.toStringTypeScriptImportClassesFromNamespace()
			);

		var thisAndDescendantsAsStrings = [];
		thisAndDescendantsAsStrings.push(...filesAsImportLines);
		thisAndDescendantsAsStrings.push(...childrenAsImportLines);

		var newline = "\n";
		var thisAndDescendantsAsString =
			thisAndDescendantsAsStrings.join(newline);

		return thisAndDescendantsAsString;
	}
}
