#! /usr/bin/env coffee
fs = require 'fs'
path = require 'path'
colors = require './colors'

[_coffee, _cliPath, templateName, args...] = process.argv
#console.log args

#
# Utils
#
extend = (target, source) ->
	for k, v of source
		target[k] = v

#find = (

exists = fs.existsSync

# Exit and show a messge
quit = (message) ->
	console.error(message.red)
	process.exit(1)

logAction = (a...) ->
	[command, args] = a
	console.log(command.bold, args)
#
# Extend String prototype w/ helpers
#
# Watch out devs!  `for in` loops over a string object may not behave as
# expected.  I suggest you run your code before shipping directly to
# production, and not including this file in your main app.
#
extend String.prototype,
	camelcase: ->
		@ + "camel"


#
# Api
#
# What gets passed into a template definitions file
class Api
	constructor: (@templateName, @templateDirPath, @projectDirPath) ->
		@isForReal = false
		@templates = []
	#
	# Template registration
	#
	register: (templateName, args, runFn) =>
		@templates.push({templateName, args, runFn})

	#
	# File manipulation
	#
	copy: (templateFilePath, destinationPath) =>
		logAction("copy", templateFilePath, destinationPath)
		if @isForReal
			# do interpolation and pop .template of the filename if present
			# copy file 
			1

	mkdir: (dir) =>
		logAction("mkdir", dir)
		if @isForReal
			fs.mkdir(dir)

	insertString:({file, string, before, after}) =>
		if !exists(file)
			quite("TODO - no file")

		stringToFind = before ? after

		if !stringToFind?
			quit("""TODO - need before or after""")

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

class DryRunApiImplementation

#
# Template definition
#
readGeneratorFile = ->
	projectDir = process.cwd()
	templateDirPath = path.join(projectDir, "generate-a-templates")
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
	api.templates

#
# Run templates
#

availableTemplates = readGeneratorFile()
availableTemplateNames = availableTemplates.map((t) -> t.templateName)
template = null
template = (t for t in availableTemplates when t.templateName == templateName)[0]

# Ensure user provided a template name
if !templateName
	quit("""
		You must provide a template name to generate.  Available templates:

				#{availableTemplateNames.join(", ")}

		Try it again like:

				generate-a #{availableTemplateNames[0]}
	""")

# Ensure the provided template name is valid
if !template
	quit("""
		I didn't find `#{templateName}` in the available templates:

				#{availableTemplateNames.join(", ")}
	""")


console.log template
{runFn} = template
# Give it a dry run
runFn()

# Run it for real!
#template.run(false)
