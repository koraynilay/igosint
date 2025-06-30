#!/bin/node
user1 = {}
user2 = {}
user1.name = process.argv[2]
user2.name = process.argv[3]
categories = process.argv.slice(4)

if(categories.length == 0) {
	categories = [
		"followers",
		"followings",
		"dontFollowMeBack",
		"iDontFollowBack"
	]
}

for(c of categories) {
	user1[c] = require(`${process.cwd()}/${user1.name}_${c}.json`)
	user2[c] = require(`${process.cwd()}/${user2.name}_${c}.json`)

	// get common object elements
	common = user1[c].filter(e => user2[c].some(v => v.username == e.username))
	console.log(`Common ${c} between ${user1.name} and ${user2.name}:`)
	console.log(common)
	console.log(`${common.length} common ${c} found`)
}
