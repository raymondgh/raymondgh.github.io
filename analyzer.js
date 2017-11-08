//takes a uniqueID and list of events and returns a list of events for that uniqueID
function ownedEvents(uniqueID, events) {
	var owned = [];

	events.forEach(function(event) {
		if (event.userid == uniqueID) {
			owned.push(event);
		}
	});

	return owned
}

//takes a list of event objects and returns a list of event objects with session duration
function durableEvents(events) {

	var durables = [];

	events.forEach(function(event) {
		if (event.custom_params.duration) {
			durables.push(event);
		}
	});

	return durables
}

//takes a list of durable events and returns their average duration
function averageDurationOfEvents(events) {

	var totalTime = 0
	events.forEach(function(event) {
		totalTime += parseInt(event.custom_params.duration, 10)
	})


	return (totalTime / events.length).toFixed(2)
}

//takes a list of event objects and returns a list of unique IDs appearing in that list
function uniqueIDs(events) {
	var listOfUserIDs = [];

	events.forEach(function(item){
		listOfUserIDs.push(item.userid)
	})


	return Array.from(new Set(listOfUserIDs))
}

//takes a list of json objects and returns all the top level keys for the objects in the list
function jsonKeys (json) {

	var moreKeys = []

	json.forEach(function(item){
		moreKeys.push(Object.keys(item)) //.custom_params)
	})

	return Array.from(new Set([].concat.apply([], moreKeys)))
}

//takes a key and produces an html option element
function createOptionElement(key) {
	var optionElement = document.createElement("option")
	optionElement.setAttribute("value", key);
	optionElement.innerHTML = key;
	return optionElement
}

//takes a list of keys and produces a list of html option elements
function createOptionElementList (listOfKeys) {
	var options = []
	for (var i = listOfKeys.length - 1; i >= 0; i--) {
		options.push(createOptionElement(listOfKeys[i]))
	}
	return options
}

//takes list of option elements and a parent element and appends the options as chiledren to the parent
function listOptions(listOfOptionElements, parentID) {
	listOfOptionElements.forEach(function(element){
		document.getElementById(parentID).appendChild(element)
	})
}

// takes a key and list of objects and returns all the key values for those objects
function childrenKeys(parentKey, json) {
	var children = []

	json.forEach(function(event) {
		if (event[parentKey]){
		children.push(event[parentKey])
}
	})
	return children
}

// create new select element
function createSelectElement(listOfKeys) {
	var selectElement = document.createElement("select")
	selectElement.setAttribute("onchange", "selector2Update()")
	selectElement.setAttribute("id", document.getElementById("x-variable").innerHTML)
	return selectElement
}

//display new select element
function displaySelectElement(element, parentID) {
	document.getElementById(parentID).appendChild(element)
}

//takes a json key and object and returns a list of values from the json object for that key
function valuesForKey(key, events) {
	var values = [];

	events.forEach(function(item){
		values.push(item.key)
	})


	return Array.from(new Set (values))
}

//update selector representation
function selectorUpdate(){

	var selectorID = "x-selector-1"

	var selectedDisplay = document.getElementById("x-variable")
	var selectorElement = document.getElementById(selectorID)


	//displays selection next to x-axis variable
	selectedDisplay.innerHTML = selectorElement.value;

	// determines whether object has children
// Object.keys(eventsJSON[1].ts).length -> 0
// Object.keys(eventsJSON[1].custom_params).length -> 3


	displaySelectElement(createSelectElement(selectedDisplay.innerHTML),"summary")


	listTier2Options()

	return document.getElementById("x-selector-1").value

}

//optionlister2
function listTier2Options (){
	listOptions(createOptionElementList(jsonKeys(childrenKeys("custom_params",eventsJSON))),"custom_params")
}

//selector2
function selector2Update(){
	console.log("trick or treat")
}