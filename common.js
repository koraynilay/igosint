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
	user1filename = `${process.cwd()}/${user1.name}_${c}.json`
	user2filename = `${process.cwd()}/${user2.name}_${c}.json`

	try {
		user1[c] = require(user1filename)
	} catch(e) {
		console.error(`Error loading ${user1filename}`, e.message)
		process.exit(1)
	}
	try {
		user2[c] = require(user2filename)
	} catch(e) {
		console.error(`Error loading ${user2filename}:`, e.message)
		process.exit(1)
	}

	// get common object elements
	common = user1[c].filter(e => user2[c].some(v => v.username == e.username))
	console.log(`Common ${c} between ${user1.name} and ${user2.name}:`)
	console.log(common)
	console.log(`${common.length} common ${c} found`)
}
