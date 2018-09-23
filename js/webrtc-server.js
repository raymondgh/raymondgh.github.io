//////////////////////
// Signaling Server //
//////////////////////

// keep track of who the server knows about
let listOfPeers = ['Peer1', 'Peer2'];

// make sure signal won't crash the server
function parseSignal(rawSignal) {

	try {
		// parse the message as json (or at least try)
		let message = JSON.parse(rawSignal);

		// assuming we got json, make sure the destination is set as a peer on our list
		if (listOfPeers.includes(message.destination)) {

			// if destination is valid, let's dispatch it!
			processSignal(message);

		} else {

			// if destination not on list, let's just give up on this message :(
			console.log("SERVER: Uh oh, that destination isn't on our peer list. Let's just throw this message away!");
		}

	} catch(error) {

		// something failed earlier. probably parsing the json went poorly
		console.log("SERVER: Uh oh, we got a message that we couldn't parse. Let's just throw this message away!");
		console.log("But first, here's the error:", error);

	}
}


// signal is good enough to send, so now we stringify & send it!
function processSignal(message) {

	let payload = JSON.stringify(message);
	
	// simulate sending the message from server to client.
	switch (message.destination) {

		// these functions are how the peer handles signals from the server
		case 'Peer1':
			peer1SignalHandler(payload);
			break;
		case 'Peer2':
			peer2SignalHandler(payload);
			break;
		default:
			console.log("SERVER: Weird, a message was sent to the server and got past the validation but still has nowhere to go! Oh well.")
			console.log("Here's what it was:", message);
			break;
	}
}



