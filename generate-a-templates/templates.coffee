module.exports = (generat) ->
	{register, log, mkdir, copy} = generat

	 #console.log(generat)   # <- Uncomment and run me to see the full api


	register "bot", ":name", () ->
		log "hi"



