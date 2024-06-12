addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {

	const clientIP = request.headers.get('CF-Connecting-IP');
    console.log("Debug - IP - " + clientIP);

	const url = new URL(request.url);
	const urlPath = url.pathname;

    console.log("Debug - url = " + url);

	if (urlPath === "/information") {

		const jsonStructure = {
			connection: {
				ip: clientIP,
				asn: request.cf.asn,
				isp: request.cf.asOrganization,
			},
			location: {
				city: request.cf.city,
				region: request.cf.region,
				postcode: request.cf.postcode,
				country: request.cf.country, 
				coordinates: {
					latitude: request.cf.latitude,
					longitude: request.cf.longitude
				}
			}, 
			debug: {
				fromDataCentre: request.cf.colo,
				timezone: request.cf.timezone				
			}
		  };
	
		  const valuesToReturn = JSON.stringify(jsonStructure, null, 2)
		  console.log("Debug - valuesToReturn = " + valuesToReturn);

		return new Response(valuesToReturn, {
			status: 200,
			});
	} else {
		return new Response(clientIP, {
			status: 200,
			});
	}
}