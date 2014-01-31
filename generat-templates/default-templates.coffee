module.exports = ({register, log, mkdirp, copy}) ->

	register "bot", ["name"], ->
		mkdirp("src/bots/{{name}}")
		copy("bot.coffee", "src/bots/{{name}}/bot.coffee")
		copy("api.coffee", "src/bots/{{name}}/api.coffee")

	register "service", ["name"], ->
		mkdirp("tmp/{{name}}")
		copy("bot.coffee", "tmp/{{name}}/bot.coffee")
