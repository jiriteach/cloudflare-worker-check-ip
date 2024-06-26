<img src="https://www.cloudflare.com/img/logo-cloudflare.svg" width="150">  

# Cloudflare Worker - Check IP

Cloudflare Worker designed to check the IP address and IP information of a connecting client.

## Using a Browser

Option 1 - 
`https://cloudflare.worker.url/` returns the the clients IP address as determined by Cloudflare. This uses `request.headers.get("CF-Connecting-IP")` to provide the clients IP.

Example response - 
```
210.xxx.xxx.xxx
```

Option 2 - `https://cloudflare.worker.url/details` returns the the clients IP information as determined by IPInfo.   
NOTE - IPinfo's API requires a token.

Example response - 
```
{
   "ip":"210.xxx.xxx.xxx",
   "hostname":"210-xxx-xxx-xxx.xxx.xxx.co.nz",
   "region":"Auckland",
   "country":"NZ",
   "org":"AS4771 Spark New Zealand Trading Ltd",
   "timezone":"Pacific/Auckland",
   "source":"IPinfo - IP detected",
   "queried":"12/06/2024, 5:47:05 pm via Cloudflare Worker"
}
```
Option 3 - `https://cloudflare.worker.url/210.xxx.xxx.xxx` returns the the clients IP information as determined by IPInfo.  
NOTE - IPinfo's API requires a token.

Example response - 
```
{
  "ip": "210.xxx.xxx.xxx",
  "hostname": "210-xxx-xxx-xxx.xxx.co.nz",
  "region": "Waikato",
  "country": "NZ",
  "org": "AS4771 Spark New Zealand Trading Ltd",
  "timezone": "Pacific/Auckland",
  "source": "IPinfo - IP provided",
  "queried": "12/06/2024, 5:49:43 pm via Cloudflare Worker"
}
```
Option 4 - 
`https://cloudflare.worker.url/provider` returns the the clients IP address and provider information as determined by IPInfo.  
NOTE - IPinfo's API requires a token.

Example response - 
```
210.xxx.xxx.xxx
AS4771 Spark New Zealand Trading Ltd
```

## Using Curl

Can also called using Curl.

Example - 

```
jxs@709 ~ % curl -L cloudflare.worker.url
210.xxx.xxx.xxx
```

Example - 

```
jxs@709 ~ % curl -L cloudflare.worker.url/details
{
   "ip":"210.xxx.xxx.xxx",
   "hostname":"210-xxx-xxx-xxx.xxx.xxx.co.nz",
   "region":"Auckland",
   "country":"NZ",
   "org":"AS4771 Spark New Zealand Trading Ltd",
   "timezone":"Pacific/Auckland",
   "source":"IPinfo - IP detected",
   "queried":"12/06/2024, 5:47:05 pm via Cloudflare Worker"
}
```

Example - 
```
jxs@709 ~ % curl -L cloudflare.worker.url/210.xxx.xxx.xxx
{
  "ip": "210.xxx.xxx.xxx",
  "hostname": "210-xxx-xxx-xxx.xxx.co.nz",
  "region": "Waikato",
  "country": "NZ",
  "org": "AS4771 Spark New Zealand Trading Ltd",
  "timezone": "Pacific/Auckland",
  "source": "IPinfo - IP provided",
  "queried": "12/06/2024, 5:49:43 pm via Cloudflare Worker"
}
```
Example - 

```
jxs@709 ~ % curl -L cloudflare.worker.url/provider
210.xxx.xxx.xxx
AS4771 Spark New Zealand Trading Ltd
```

## Required Environment Variables

This Cloudflare Worker reads environment variables which store configuration information. Setup these environment variables under Settings > Variables of the worker.

* apiDomain - the domain name of the IPinfo API. Default should be `ipinfo.io`

* apiToken - the API token as provided by IPInfo.
* apiReferer - the referer that the API token allows. Setup within the IPinfo dashboard. Default should be `cloudflare.worker.url`

## Using Cloudflare to Determine IP Information

`worker.backup.js` is a working example of using Cloudflare (instead of IPinfo) to detemine IP information.

This uses `request.headers.get("CF-Connecting-IP")` to provide the clients IP and uses `request.cf` to provide IP information.

IP information `request.cf` can provide - 
```
request.cf.asn
request.cf.asOrganization
request.cf.city
request.cf.region
request.cd.postcode
request.cf.country
request.cf.latitude
request.cf.longitude
request.cf.colo
request.cf.timezone
```

`worker.backup.js` only supports Option 1 and Option 2.