#! /usr/bin/env coffee
fs = require 'fs'
path = require 'path'
mkdirp = require './mkdirp'
require './string-extensions!!!'

[_coffee, _cliPath, templateName, argv...] = process.argv

#
# Utils
#
exists = fs.existsSync
rm = fs.unlinkSync
rmdir = fs.rmdirSync
write = fs.writeFileSync

read = (p) ->
	fs.readFileSync(p, 'utf8')

isFile = (p) ->
	fs.statSync(p).isFile()

isDir = (p) ->
	!isFile(p)

remove = (p) ->
	if isFile(p)
		rm(p)
	else
		rmdir(p)

#
# Messages
#
# Keeps long strings out of the main code flow
Messages =
	"template file not found": """
		Template file not found: `<%= path %>`
	"""

	"template name missing": """
		You must provide a template name to generate.  Available templates:

				<%= availableTemplateNames.join(", ") %>

		Try it again like:

				generat <%= availableTemplateNames[0] %>
	"""

 "template not found": """
		I didn't find `<%= templateName %>` in the available templates:

				<%= availableTemplateNames.join(", ") %>
	"""

	"missing arguments": """
		You didn't provide enough arguments.  Usage:

			generat <%= templateName %> <%= args.join(" ") %>
	"""

	"file already exists": """
		File already exists <%= path.bold %>
	"""

# Exit and show a messge
# Checks for a message in Messages, or uses the passed in string
quit = (stringOrMessageId, data={}) ->
	string = Messages[stringOrMessageId]
	string ?= "#{stringOrMessageId}\n(TODO - better error message)"
	string = string.interpolate(data)
	string = "\n#{string}\n".red
	console.error(string)
	process.exit(1)

logAction = (a...) ->
	[command, args...] = a
	console.log(command.bold, args...)

#
# Api
#
# What gets passed into a template definitions file
class Api
	constructor: (@templateName, @templateDirPath, @projectDirPath) ->
		@isForReal = false
		@templates = []
		@data = {}
	#
	# Template registration
	#
	register: (templateName, args, runFn) =>
		@templates.push({templateName, args, runFn})

	#
	# File manipulation
	#
	# Copy a file, interpolating it
	copy: (relativeTemplatePath, relativeDestinationPath) =>
		templateFilePath = @templatePath(relativeTemplatePath)
		destinationPath = @projectPath(relativeDestinationPath)

		logAction("copy", templateFilePath, destinationPath)
		if !exists(templateFilePath)
			quit("template file not found", {path: templateFilePath})

		if exists(destinationPath)
			overwrite = true
			console.log "ruh roh, #{destinationPath} exists.  I'm #{overwrite || "NOT"} going to overwrite it"
			if overwrite
				remove(destinationPath)
			else
				quit("file already exists", {path: destinationPath})

		if @isForReal
			contents = read(templateFilePath)
			contents = @interpolate(contents)
			write(destinationPath, contents)

	mkdirp: (dir) =>
		dir = @projectPath(dir)
		logAction("mkdirp", dir)
		if @isForReal
			mkdirp(dir)

	insertString:({file, string, before, after}) =>
		if !exists(file)
			quite("TODO - no file")

		stringToFind = before ? after

		if !stringToFind?
			quit("TODO - need before or after")

		contents = fs.readFileSync(file)
		stringIndex = -1
		if stringIndex == -1
			quit("Didn't find string: `#{string}` in file: `#{file}`")

		if before
			logAction("TODO inserting string before")
			if @isForReal
				updateContentsBlahBlah()

		if after
			logAction("TODO inserting string after")
			if @isForReal
				updateContentsBlahBlah()

	# 
	# Misc
	#
	log: (string) ->
		console.log string

	interpolate: (string) ->
		string.interpolate(@data)

	# Convert a relative path to the template root, and interpolate it
	templatePath: (relativePath) ->
		@interpolate(path.join(@templateDirPath, relativePath))

	# Convert a relative path to the project's root, and interpolate it
	projectPath: (relativePath) ->
		@interpolate(path.join(@projectDirPath, relativePath))

class DryRunApiImplementation

#
# Template definition
#
readGeneratorFile = ->
	projectDir = process.cwd()
	templateDirPath = path.join(projectDir, "generat-templates")
	templateDefinitionFile = path.join(templateDirPath, "templates.coffee")

	if !exists(templateDirPath)
		quit("template dir not found: `#{templateDirPath}`")

	if !exists(templateDefinitionFile)
		quit("template definition file not found: #{templateDefinitionFile}")
	
	# Read their builder fn
	fn = require(templateDefinitionFile)
	if typeof fn != 'function'
		quit("template definition file didnt export a function")

	api = new Api(templateName, templateDirPath, projectDir)
	fn(api)
	api

#
# Run templates
#

api = readGeneratorFile()
availableTemplates = api.templates
availableTemplateNames = availableTemplates.map((t) -> t.templateName)
template = null
template = (t for t in availableTemplates when t.templateName == templateName)[0]

# Ensure user provided a template name
if !templateName
	quit("template name missing", {availableTemplateNames})

# Ensure the provided template name is valid
if !template
	quit("template not found", {availableTemplateNames, templateName})

# Ensure correct args were given
#console.log template.args, argv
if argv.length < template.args.length
	quit("missing arguments", {templateName, args: template.args})

for argName, i in template.args
	argValue = argv[i]
	api.data[argName] = argValue

{runFn} = template

# Give it a dry run
#runFn()

# Run it for real!
api.isForReal = true
runFn()
