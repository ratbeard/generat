module.exports = (generat) ->
	{register, log, mkdirp, copy} = generat

	 #console.log(generat)   # <- Uncomment and run me to see the full api

	register "bot", ["name"], ->
		mkdirp("tmp/{{name}}")
		copy("bot.coffee", "tmp/{{name}}/bot.coffee")

