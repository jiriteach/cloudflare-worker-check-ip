(() => {
	(() => {
	  addEventListener("fetch", async (event) => {
		event.respondWith(handleRequest(event.request));
	  });

	  async function handleRequest(request) {
  
		const clientIP = request.headers.get("CF-Connecting-IP");
		console.log("Debug - IP - " + clientIP);
  
		const url = new URL(request.url);
		const urlPath = url.pathname;
		console.log("Debug - Url = " + url);
		
		const cleanedUrlPath = urlPath.replace("/", "");
  
		let enteredIp = false;
		
		if (cleanedUrlPath === "") {
		  enteredIp = false;
		} else {
		  enteredIp = true;
		};
  
		console.log("Debug - Entered IP = " + enteredIp);
  
		const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
		const enteredValidIp = ipv4Pattern.test(cleanedUrlPath);
  
		console.log("Debug - Entered Valid IP - " + enteredValidIp);
		
		if (urlPath === "/details" || urlPath === "/provider" || enteredValidIp) {
  
		  let ipToCheck;
		  if (enteredValidIp) {
			ipToCheck = cleanedUrlPath
		  } else {
			ipToCheck = clientIP
		  }
		  console.log("Debug - IP To Check - " + ipToCheck);
  
		  const apiUrl = "https://" + apiDomain + "/" + ipToCheck + "/json?token=" +  apiToken;

		  const apiRequest = new Request(
			apiUrl.toString(),
			new Request(request)
		  );

		  apiRequest.headers.set("Referer", "https://" + apiReferer);
		  apiRequest.headers.set("Content-Type", "application/json");
		  
		  console.log("Debug - Calling API ... ");
		  const apiResponse = await fetch(apiRequest);
		  console.log("Debug - Processing Response ...");
		  
		  let apiResponseToJson = await apiResponse.json();

		  let currentDate = new Date();
		  
		  if (enteredValidIp) {
			apiResponseToJson = Object.assign({}, apiResponseToJson, { source: "IPinfo - IP provided" });
		  } else {
			apiResponseToJson = Object.assign({}, apiResponseToJson, { source: "IPinfo - IP detected" });
		  }
		 
		  apiResponseToJson = Object.assign({}, apiResponseToJson, { queried: currentDate.toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }) + " via Cloudflare Worker" });
		  delete apiResponseToJson.loc;
		  delete apiResponseToJson.city;
		  delete apiResponseToJson.postal;

		  // Fix for Spark New Zealand & One New Zealand & Cloudflare Names
		  apiResponseToJson.org = apiResponseToJson.org.replace(" Trading Ltd.", "");
		  apiResponseToJson.org = apiResponseToJson.org.replace(" Group Limited", "");
		  apiResponseToJson.org = apiResponseToJson.org.replace(", Inc.", "");
		  
		  const jsonResponse = JSON.stringify(apiResponseToJson, null, 2); 
		  console.log("Debug - Response - " + jsonResponse);

		  if (urlPath === "/details" || enteredValidIp) {
			return new Response(jsonResponse + "\n", {
				status: 200
			  });
		  } else if (urlPath === "/provider") {
			return new Response(clientIP + "\n" + apiResponseToJson.org, {
				status: 200
			  });
		  }

		  
		} else {
  
		  if (enteredIp === false) {
  
			console.log("Debug - Response - " + clientIP);
			return new Response(clientIP + "\n", {
			  status: 200
			});
  
		  } else {
  
			console.log("Debug - Response - Invalid IP Entered");
			return new Response("Invalid IP Or Path Entered!" + "\n", {
			  status: 200
			});
		  }
  
		}
		async function gatherResponse(response) {
		}
	  }
	})();
  })();