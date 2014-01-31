module.exports = (generat) ->
	{register, log, mkdirp, copy} = generat

	register "bot", ["name"], ->
		mkdirp("tmp/{{name}}")
		copy("bot.coffee", "tmp/{{name}}/bot.coffee")

