let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState === 4 && this.status === 200) {
		// extract object from json text:
		let response = JSON.parse(xhttp.responseText);
		document.getElementById("users-table").innerHTML = createTableFrom(response);
	}
};
xhttp.open("GET", "messages.json", true);
xhttp.send();