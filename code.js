// this script needs to be copy pasted in the browser's console while logged in

// this whole script is taken from https://stackoverflow.com/a/74133719 and adapted
const username = "USER_NAME_HERE";

/**
 * Initialized like this so we can still run it from browsers, but also use typescript on a code editor for intellisense.
 */
let followers = [{ username: "", full_name: "" }];
let followings = [{ username: "", full_name: "" }];
let dontFollowMeBack = [{ username: "", full_name: "" }];
let iDontFollowBack = [{ username: "", full_name: "" }];

followers = [];
followings = [];
dontFollowMeBack = [];
iDontFollowBack = [];

// Function to download data to a file
// from https://stackoverflow.com/a/30832210
function download(data, filename, type) {
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
		        url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

(async () => {
	try {
		console.log(`Process started! Give it a couple of seconds`);

		const userQueryRes = await fetch(
			`https://www.instagram.com/web/search/topsearch/?query=${username}`
		);

		const userQueryJson = await userQueryRes.json();

		const userId = userQueryJson.users.map(u => u.user)
							.filter(
					u => u.username === username
							 )[0].pk;

		let after = null;
		let has_next = true;

		while (has_next) {
			await fetch(
				`https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
				encodeURIComponent(
					JSON.stringify({
						id: userId,
						include_reel: true,
						fetch_mutual: true,
						first: 50,
						after: after,
					})
				)
			)
			.then((res) => res.json())
			.then((res) => {
				has_next = res.data.user.edge_followed_by.page_info.has_next_page;
				after = res.data.user.edge_followed_by.page_info.end_cursor;
				followers = followers.concat(
					res.data.user.edge_followed_by.edges.map(({ node }) => {
						return {
							username: node.username,
							full_name: node.full_name,
						};
					})
				);
			});
		}

		console.log({ followers });

		after = null;
		has_next = true;

		while (has_next) {
			await fetch(
				`https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
				encodeURIComponent(
					JSON.stringify({
						id: userId,
						include_reel: true,
						fetch_mutual: true,
						first: 50,
						after: after,
					})
				)
			)
			.then((res) => res.json())
			.then((res) => {
				has_next = res.data.user.edge_follow.page_info.has_next_page;
				after = res.data.user.edge_follow.page_info.end_cursor;
				followings = followings.concat(
					res.data.user.edge_follow.edges.map(({ node }) => {
						return {
							username: node.username,
							full_name: node.full_name,
						};
					})
				);
			});
		}

		console.log({ followings });

		dontFollowMeBack = followings.filter((following) => {
			return !followers.find(
				(follower) => follower.username === following.username
			);
		});

		console.log({ dontFollowMeBack });

		iDontFollowBack = followers.filter((follower) => {
			return !followings.find(
				(following) => following.username === follower.username
			);
		});

		console.log({ iDontFollowBack });

		console.log(
			`Process is done: Type 'copy(followers)' or 'copy(followings)' or 'copy(dontFollowMeBack)' or 'copy(iDontFollowBack)' in the console and paste it into a text editor to take a look at it`
		);

		let filename = "";

		filename = `${username}_followers.json`;
		download(JSON.stringify(followers, null, 4), filename, "application/json");

		filename = `${username}_followings.json`;
		download(JSON.stringify(followings, null, 4), filename, "application/json");

		filename = `${username}_dontFollowMeBack.json`;
		download(JSON.stringify(dontFollowMeBack, null, 4), filename, "application/json");

		filename = `${username}_iDontFollowBack.json`;
		download(JSON.stringify(iDontFollowBack, null, 4), filename, "application/json");

	} catch (err) {
		console.log({ err });
	}
})();
